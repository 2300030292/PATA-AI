import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Leaflet icon fix
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Verified Location Icon
const verifiedIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
});

const DeliveryMap = ({ resolvedAddress }) => {
  // Default location (Hyderabad)
  const latitude = resolvedAddress?.latitude || 17.385;
  const longitude = resolvedAddress?.longitude || 78.4867;

  return (
    <div className="rounded-xl overflow-hidden shadow-lg h-[450px]">

      <MapContainer
        center={[latitude, longitude]}
        zoom={16}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker
          position={[latitude, longitude]}
          icon={verifiedIcon}
        >

          <Popup>

            <h3 className="font-bold text-blue-600">
              📍 Verified Delivery Location
            </h3>

            <hr />

            <p>
              <strong>Original:</strong>
              <br />
              {resolvedAddress?.original_address}
            </p>

            <p>
              <strong>Corrected:</strong>
              <br />
              {resolvedAddress?.corrected_address}
            </p>

            <p>
              <strong>Landmark:</strong>{" "}
            {resolvedAddress?.landmark}
            </p>

            <p>
              <strong>Pincode:</strong>{" "}
             {resolvedAddress?.pincode}
            </p>

            <p>
              <strong>Confidence:</strong>{" "}
              {resolvedAddress?.confidence}%
            </p>

          </Popup>

        </Marker>

      </MapContainer>

    </div>
  );
};

export default DeliveryMap;