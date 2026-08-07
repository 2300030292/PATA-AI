"""HTTP service for the trained ETA estimator and OR-Tools route solver."""

from __future__ import annotations

from math import asin, cos, radians, sin, sqrt
from pathlib import Path
from typing import Literal

import json
import joblib
import numpy as np
import pandas as pd

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from ortools.constraint_solver import pywrapcp, routing_enums_pb2
from pydantic import BaseModel, Field, field_validator

from services.gemini_service import parse_indian_address
from services.osm_service import search_landmark
from services.pincode_service import verify_pincode

MODEL_PATH = Path(__file__).parent / "models" / "eta_model.joblib"

app = FastAPI(
    title="Pata API",
    description="AI-powered Location Intelligence for Last-Mile Delivery",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5177",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5177",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ETARequest(BaseModel):
    distance_km: float = Field(gt=0, le=500)
    traffic_level: Literal["low", "medium", "high", "jam"] = "medium"
    hour_of_day: int = Field(ge=0, le=23)
    weather: Literal["sunny", "cloudy", "fog", "stormy", "windy"] = "sunny"
    package_weight_kg: float = Field(default=1, gt=0, le=100)
    stops_remaining: int = Field(default=0, ge=0, le=100)
    is_festival: bool = False


class BatchETARequest(BaseModel):
    deliveries: list[ETARequest] = Field(
        min_length=1,
        max_length=250,
    )


class Stop(BaseModel):
    id: str | int
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    demand: int = Field(default=1, ge=0)


class RouteRequest(BaseModel):
    depot_latitude: float = Field(ge=-90, le=90)
    depot_longitude: float = Field(ge=-180, le=180)
    stops: list[Stop] = Field(
        min_length=1,
        max_length=100,
    )
    vehicle_capacities: list[int] = Field(
        default=[100],
        min_length=1,
        max_length=20,
    )

    @field_validator("vehicle_capacities")
    @classmethod
    def positive_capacities(cls, values: list[int]) -> list[int]:
        if any(v < 1 for v in values):
            raise ValueError("Vehicle capacities must be positive")
        return values


class AddressRequest(BaseModel):
    address: str = Field(
        ...,
        min_length=5,
        max_length=500,
    )


def load_model():
    if not MODEL_PATH.exists():
        raise HTTPException(
            status_code=503,
            detail="ETA model is not installed. Run train_eta.py before serving predictions.",
        )

    return joblib.load(MODEL_PATH)
def predict(deliveries: list[ETARequest]) -> list[float]:
    model = load_model()

    frame = pd.DataFrame(
        [delivery.model_dump() for delivery in deliveries]
    )

    values = model.predict(frame)

    return [
        round(max(float(value), 1.0), 1)
        for value in values
    ]


def haversine_meters(
    a_lat: float,
    a_lon: float,
    b_lat: float,
    b_lon: float,
) -> int:

    lat_delta = radians(b_lat - a_lat)
    lon_delta = radians(b_lon - a_lon)

    h = (
        sin(lat_delta / 2) ** 2
        + cos(radians(a_lat))
        * cos(radians(b_lat))
        * sin(lon_delta / 2) ** 2
    )

    return int(2 * 6371000 * asin(sqrt(h)))


@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_ready": MODEL_PATH.exists(),
        "model_version": "xgboost-eta-v1",
    }


@app.post("/predict-eta")
def predict_eta(request: ETARequest):
    return {
        "predicted_eta_minutes": predict([request])[0],
        "model_version": "xgboost-eta-v1",
    }


@app.post("/predict-etas")
def predict_etas(request: BatchETARequest):
    return {
        "predictions": predict(request.deliveries),
        "model_version": "xgboost-eta-v1",
    }


@app.post("/optimize-route")
def optimize_route(request: RouteRequest):

    locations = [
        (request.depot_latitude, request.depot_longitude)
    ] + [
        (stop.latitude, stop.longitude)
        for stop in request.stops
    ]

    matrix = [
        [
            haversine_meters(*source, *target)
            for target in locations
        ]
        for source in locations
    ]

    manager = pywrapcp.RoutingIndexManager(
        len(locations),
        len(request.vehicle_capacities),
        0,
    )

    routing = pywrapcp.RoutingModel(manager)

    def distance_callback(from_index, to_index):
        return matrix[
            manager.IndexToNode(from_index)
        ][
            manager.IndexToNode(to_index)
        ]

    transit_callback = routing.RegisterTransitCallback(
        distance_callback
    )

    routing.SetArcCostEvaluatorOfAllVehicles(
        transit_callback
    )

    def demand_callback(from_index):
        node = manager.IndexToNode(from_index)

        if node == 0:
            return 0

        return request.stops[node - 1].demand

    demand_callback_index = routing.RegisterUnaryTransitCallback(
        demand_callback
    )

    routing.AddDimensionWithVehicleCapacity(
        demand_callback_index,
        0,
        request.vehicle_capacities,
        True,
        "Capacity",
    )

    search_parameters = (
        pywrapcp.DefaultRoutingSearchParameters()
    )

    search_parameters.first_solution_strategy = (
        routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
    )

    search_parameters.local_search_metaheuristic = (
        routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH
    )

    search_parameters.time_limit.FromSeconds(2)

    solution = routing.SolveWithParameters(
        search_parameters
    )

    if not solution:
        raise HTTPException(
            status_code=422,
            detail="No feasible route was found.",
        )

    routes = []
    total_distance = 0

    for vehicle in range(len(request.vehicle_capacities)):

        index = routing.Start(vehicle)
        route = []
        distance = 0

        while not routing.IsEnd(index):

            node = manager.IndexToNode(index)

            if node != 0:
                route.append(request.stops[node - 1].id)

            previous = index
            index = solution.Value(
                routing.NextVar(index)
            )

            distance += routing.GetArcCostForVehicle(
                previous,
                index,
                vehicle,
            )

        total_distance += distance

        if route:
            routes.append(
                {
                    "vehicle": vehicle + 1,
                    "stop_ids": route,
                    "distance_km": round(
                        distance / 1000,
                        2,
                    ),
                }
            )

    return {
        "routes": routes,
        "total_distance_km": round(
            total_distance / 1000,
            2,
        ),
        "solver": "google-or-tools-vrp",
    }
@app.post("/resolve-address")
def resolve_address(request: AddressRequest):

    try:
        # Step 1 - Parse address using Gemini
        gemini_result = parse_indian_address(request.address)

        try:
            parsed = json.loads(gemini_result)
        except Exception:
            return {
                "error": "Gemini returned invalid JSON",
                "raw_response": gemini_result,
            }

        # Step 2 - Verify landmark using OpenStreetMap
        landmark = parsed.get("landmark", "")
        osm = search_landmark(landmark) if landmark else None

        # Step 3 - Verify pincode
        pincode = parsed.get("pincode", "")
        pin = verify_pincode(pincode) if pincode else None

        # Step 4 - Build evidence
        evidence = []

        if landmark:
            evidence.append(f"Landmark detected: {landmark}")

        if osm:
            evidence.append("Landmark verified using OpenStreetMap")

        if pin:
            evidence.append("Pincode verified from India Post dataset")

        latitude = None
        longitude = None

        if osm:
            latitude = osm.get("latitude")
            longitude = osm.get("longitude")
        elif pin:
            latitude = pin.get("latitude")
            longitude = pin.get("longitude")

        return {
            "original_address": request.address,
            "language": parsed.get("language", ""),
            "corrected_address": parsed.get(
                "corrected_address",
                request.address,
            ),
            "landmark": landmark,
            "locality": parsed.get("locality", ""),
            "city": parsed.get("city", ""),
            "state": parsed.get("state", ""),
            "pincode": pincode,
            "latitude": latitude,
            "longitude": longitude,
            "confidence": parsed.get("confidence", 90),
            "evidence": evidence,
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )