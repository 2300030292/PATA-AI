import React from "react";

const EvidenceList = ({ evidence }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 border">

      <h2 className="text-2xl font-bold mb-4">
        📋 AI Verification Evidence
      </h2>

      <ul className="space-y-3">

        {evidence && evidence.map((item, index) => (
          <li
            key={index}
            className="bg-green-50 border border-green-300 rounded-lg p-3"
          >
            ✅ {item}
          </li>
        ))}

      </ul>

    </div>
  );
};

export default EvidenceList;