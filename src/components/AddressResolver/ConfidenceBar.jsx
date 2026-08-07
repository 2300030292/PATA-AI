import React from "react";

const ConfidenceBar = ({ confidence }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 border">

      <h2 className="text-2xl font-bold mb-4">
        🎯 AI Confidence Score
      </h2>

      <div className="w-full bg-gray-200 rounded-full h-6">

        <div
          className="bg-green-600 h-6 rounded-full text-white text-center text-sm"
          style={{ width: `${confidence}%` }}
        >
          {confidence}%
        </div>

      </div>

    </div>
  );
};

export default ConfidenceBar;