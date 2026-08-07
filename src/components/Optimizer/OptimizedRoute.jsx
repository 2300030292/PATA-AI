import React from "react";

const OptimizedRoute = ({ orders }) => {
  return (
    <div className="mt-8 bg-white rounded-xl shadow-lg p-6">

      <h2 className="text-2xl font-bold text-blue-700 mb-5">
        📍 AI Address Verification Results
      </h2>

      <div className="space-y-4">

        {orders.map((order) => (

          <div
            key={order.id}
            className="border rounded-lg p-5 hover:bg-gray-50"
          >

            <h3 className="font-bold text-lg text-gray-800 mb-2">
              Address #{order.id}
            </h3>

            <p>
              <strong>Original Address</strong>
            </p>

            <p className="text-gray-600 mb-3">
              {order.originalAddress}
            </p>

            <p>
              <strong>Corrected Address</strong>
            </p>

            <p className="text-green-700 mb-3">
              {order.correctedAddress}
            </p>

            <div className="grid md:grid-cols-4 gap-4 mt-4">

              <div>
                <p className="text-sm text-gray-500">
                  Landmark
                </p>

                <p className="font-semibold">
                  {order.landmark}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Pincode
                </p>

                <p className="font-semibold">
                  {order.pincode}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Confidence
                </p>

                <p className="font-bold text-green-600">
                  {order.confidence}%
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Status
                </p>

                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  {order.status}
                </span>
              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default OptimizedRoute;