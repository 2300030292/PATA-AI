import React, { useState } from "react";
import Dashboard from "./components/Dashboard/Dashboard";
import AddressResolver from "./components/AddressResolver/AddressResolver";

const App = () => {
  const [view, setView] = useState("resolver");

  return (
    <div>
      {/* Header */}
      <div className="bg-blue-700 text-white py-8 text-center shadow-lg">
        <h1 className="text-4xl font-bold">
          📍 Pata – AI Location Intelligence
        </h1>

        <p className="mt-2 text-lg">
          Smart Address Parsing • Landmark Verification • Geocoding
        </p>
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-4 py-6 flex-wrap">
        <button
          className={`px-5 py-2 rounded-lg font-medium transition ${
            view === "resolver"
              ? "bg-purple-600 text-white"
              : "bg-white border border-purple-600 text-purple-600"
          }`}
          onClick={() => setView("resolver")}
        >
          🤖 AI Resolver
        </button>

        <button
          className={`px-5 py-2 rounded-lg font-medium transition ${
            view === "dashboard"
              ? "bg-blue-600 text-white"
              : "bg-white border border-blue-600 text-blue-600"
          }`}
          onClick={() => setView("dashboard")}
        >
          🏠 Dashboard
        </button>
      </div>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 pb-10">
        {view === "resolver" && <AddressResolver />}
        {view === "dashboard" && <Dashboard />}
      </div>
    </div>
  );
};

export default App;