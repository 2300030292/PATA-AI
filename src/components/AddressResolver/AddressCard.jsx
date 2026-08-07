import React from "react";

const AddressCard = ({ result }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-5">
        📍 Resolved Address
      </h2>

      <div className="space-y-3">

        <div>
          <strong>Original Address:</strong>
          <br />
          {result.original_address}
        </div>

        <div>
          <strong>Detected Language:</strong>
          <br />
          {result.language || "English"}
        </div>

        <div>
          <strong>Corrected Address:</strong>
          <br />
          {result.corrected_address}
        </div>

        <div>
          <strong>Landmark:</strong>{" "}
          {result.landmark}
        </div>

        <div>
          <strong>Locality:</strong>{" "}
          {result.locality}
        </div>

        <div>
          <strong>City:</strong>{" "}
          {result.city}
        </div>

        <div>
          <strong>State:</strong>{" "}
          {result.state}
        </div>

        <div>
          <strong>Pincode:</strong>{" "}
          {result.pincode}
        </div>

        <div>
          <strong>Latitude:</strong>{" "}
          {result.latitude}
        </div>

        <div>
          <strong>Longitude:</strong>{" "}
          {result.longitude}
        </div>

        <div>
          <strong>Confidence:</strong>{" "}
          {result.confidence}%
        </div>

      </div>

    </div>
  );
};

export default AddressCard;