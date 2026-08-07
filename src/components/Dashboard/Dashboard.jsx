import React, { useState, useEffect } from "react";
import mockOrders from "../../utils/mockOrders";
import { getDelaySeverity } from "../../utils/delayUtils";
import { predictDelay } from "../../utils/delayPredictors";
import { computeRiskScore } from "../../utils/riskScorer";
import { optimizeOrderRoute, predictOrderEtas } from "../../services/aiService";
import DeliveryMap from "../Map/DeliveryMap";
import OptimizedRoute from "../Optimizer/OptimizedRoute";
import FloatingChatbot from "../Chatbot/FloatingChatbot";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [etaCountdowns, setEtaCountdowns] = useState({});
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [agentLocation, setAgentLocation] = useState(null);
  const [optimizedRoute, setOptimizedRoute] = useState([]);

  // Address Resolver State (Phase 2 & 3)
  const [rawAddress, setRawAddress] = useState("");
  const [resolving, setResolving] = useState(false);
  const [resolvedResult, setResolvedResult] = useState(null);

  // GPS Tracking
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setAgentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => console.error("GPS Error:", error.message),
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Offline Mode Listener
  useEffect(() => {
    const goOnline = () => setIsOffline(false);
    const goOffline = () => setIsOffline(true);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  // ETA Prediction & Delivery Intelligence
  useEffect(() => {
    if (isOffline) {
      const cached = localStorage.getItem("cachedOrders");
      if (cached) {
        setOrders(JSON.parse(cached));
        return;
      }
    }

    const offlineEstimate = (order) => {
      const predictedDelay = predictDelay(order.zone, order.distance, false);
      const riskScore = computeRiskScore(order.zone, predictedDelay);
      return { ...order, estimatedDelay: predictedDelay, riskScore };
    };

    const loadDeliveryIntelligence = async () => {
      try {
        const predictions = await predictOrderEtas(mockOrders, false);
        const enriched = mockOrders.map((order, index) => {
          const estimatedDelay = predictions[index];
          return { ...order, estimatedDelay, riskScore: computeRiskScore(order.zone, estimatedDelay) };
        });
        setOrders(enriched);
        localStorage.setItem("cachedOrders", JSON.stringify(enriched));
        setOptimizedRoute(await optimizeOrderRoute(enriched));
      } catch (error) {
        console.warn("Delivery Intelligence API unavailable; using offline estimates.", error);
        const enriched = mockOrders.map(offlineEstimate);
        setOrders(enriched);
        localStorage.setItem("cachedOrders", JSON.stringify(enriched));
        setOptimizedRoute([...enriched].sort((a, b) => a.distance - b.distance));
      }
    };
    loadDeliveryIntelligence();
  }, [isOffline]);

  // Real-time Countdown Update
  useEffect(() => {
    const interval = setInterval(() => {
      setEtaCountdowns((prev) => {
        const updated = {};
        orders.forEach((order) => {
          const newEta = Math.max((prev[order.id] ?? order.estimatedDelay) - 1, 0);
          updated[order.id] = newEta;
        });
        return updated;
      });
    }, 60000);
    return () => clearInterval(interval);
  }, [orders]);

  // Address Resolver Handler (/resolve-address API Integration)
  const handleResolveAddress = async (e) => {
    e.preventDefault();
    if (!rawAddress.trim()) return;
    setResolving(true);
    try {
      const response = await fetch("/resolve-address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: rawAddress }),
      });
      if (response.ok) {
        const data = await response.json();
        setResolvedResult(data);
      } else {
        setResolvedResult({ error: "Failed to resolve address. Check connection or API endpoint." });
      }
    } catch (err) {
      setResolvedResult({ error: "Network error calling /resolve-address API." });
    } finally {
      setResolving(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto w-full text-blue-900 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <img src="/logo.jpg" alt="logo" className="w-14 h-14 rounded shadow" />
        <h1 className="text-2xl md:text-3xl font-bold">📍 Pata – AI Location Intelligence for Last-Mile Delivery</h1>
      </div>

      {/* Offline Mode Banner */}
      {isOffline && (
        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 mb-4 rounded border border-yellow-300 animate-pulse">
          ⚠ You are in offline mode. Displaying cached delivery data.
        </div>
      )}

      {/* Address Resolver */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-blue-100 mb-6">
        <h2 className="text-lg md:text-xl font-semibold mb-2">⭐ Address Resolver</h2>
        <p className="text-sm text-gray-600 mb-4">Parse unstructured or ambiguous addresses into verified geolocation data.</p>
        <form onSubmit={handleResolveAddress} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={rawAddress}
            onChange={(e) => setRawAddress(e.target.value)}
            placeholder="Enter raw address (e.g., Near water tank, Indiranagar, Bengaluru...)"
            className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={resolving}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {resolving ? "Resolving..." : "Resolve Address"}
          </button>
        </form>

        {/* Enhanced Address Resolver Results UI */}
        {resolvedResult && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm">
            {resolvedResult.error ? (
              <p className="text-red-600 font-medium">{resolvedResult.error}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-800">
                <div className="col-span-1 md:col-span-2 bg-blue-50 p-2 rounded border border-blue-100">
                  <span className="font-semibold text-blue-900">Original Address: </span>
                  {resolvedResult.originalAddress || rawAddress}
                </div>

                <div>
                  <span className="font-semibold text-gray-700">Corrected Address: </span>
                  {resolvedResult.correctedAddress || "N/A"}
                </div>

                <div>
                  <span className="font-semibold text-gray-700">Confidence Score: </span>
                  <span className={`font-bold ${
                    resolvedResult.confidence >= 80 ? "text-green-600" : resolvedResult.confidence >= 50 ? "text-yellow-600" : "text-red-600"
                  }`}>
                    {resolvedResult.confidence ? `${resolvedResult.confidence}%` : "N/A"}
                  </span>
                </div>

                <div>
                  <span className="font-semibold text-gray-700">Coordinates: </span>
                  {resolvedResult.latitude && resolvedResult.longitude 
                    ? `${resolvedResult.latitude}, ${resolvedResult.longitude}` 
                    : "N/A"}
                </div>

                <div>
                  <span className="font-semibold text-gray-700">Verified Landmark: </span>
                  {resolvedResult.verifiedLandmark || "N/A"}
                </div>

                <div>
                  <span className="font-semibold text-gray-700">Verified Pincode: </span>
                  {resolvedResult.verifiedPincode || resolvedResult.pincode || "N/A"}
                </div>

                <div>
                  <span className="font-semibold text-gray-700">Parsed Components: </span>
                  <pre className="text-xs bg-white p-2 rounded border border-gray-200 mt-1 overflow-x-auto">
                    {resolvedResult.parsedComponents 
                      ? JSON.stringify(resolvedResult.parsedComponents, null, 2) 
                      : "N/A"}
                  </pre>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <span className="font-semibold text-gray-700">Evidence Trail: </span>
                  <p className="text-xs text-gray-600 mt-1 italic bg-white p-2 rounded border border-gray-200">
                    {resolvedResult.evidenceTrail || "Verified via OpenStreetMap & India Post Pincode Registry."}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Addresses Processed Counter */}
      <div className="mb-6">
        <div className="bg-gray-100 text-center p-4 rounded shadow max-w-xs">
          📍 <strong>Addresses Processed:</strong> {orders.length}
        </div>
      </div>

      {/* Map View */}
      <h2 className="text-lg md:text-xl font-semibold mb-2">🗺 Verified Delivery Location</h2>
      <DeliveryMap orders={orders} agentLocation={agentLocation} />

      {/* Route Optimization */}
      <div className="mt-6">
        <OptimizedRoute orders={optimizedRoute.length ? optimizedRoute : orders} />
      </div>

      {/* Orders Table */}
      <h2 className="text-lg md:text-xl font-semibold mt-8 mb-2">📋 Resolved Deliveries</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow text-sm md:text-base">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2">Zone</th>
              <th className="px-4 py-2">ETA</th>
              <th className="px-4 py-2">Risk</th>
              <th className="px-4 py-2">Delay</th>
              <th className="px-4 py-2">Distance</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t hover:bg-gray-50 transition">
                <td className="px-4 py-2">{order.id}</td>
                <td className="px-4 py-2">{order.customerName}</td>
                <td className="px-4 py-2">{order.zone}</td>
                <td className="px-4 py-2">{etaCountdowns[order.id] ?? order.estimatedDelay} min</td>
                <td className="px-4 py-2">{order.riskScore}</td>
                <td className="px-4 py-2">{order.estimatedDelay} min</td>
                <td className="px-4 py-2">{order.distance} km</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-semibold ${
                      getDelaySeverity(order.estimatedDelay) === "green"
                        ? "bg-green-200 text-green-800"
                        : getDelaySeverity(order.estimatedDelay) === "orange"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {getDelaySeverity(order.estimatedDelay).toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Legend */}
      <div className="mt-4 text-sm text-gray-600">
        <strong>Legend:</strong>
        <span className="ml-4 text-green-700">🟢 Low</span>
        <span className="ml-4 text-yellow-700">🟠 Moderate</span>
        <span className="ml-4 text-red-700">🔴 High</span>
      </div>

      {/* Floating Chatbot */}
      <FloatingChatbot />
    </div>
  );
};

export default Dashboard;