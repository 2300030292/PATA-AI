import React from "react";

const OrderTable = ({ orders }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-lg p-6">

      <h2 className="text-2xl font-bold text-blue-700 mb-4">
        📍 Resolved Address Details
      </h2>

      <table className="min-w-full border border-gray-300">

        <thead className="bg-blue-100">

          <tr>
            <th className="p-3 border">ID</th>
            <th className="p-3 border">Original Address</th>
            <th className="p-3 border">Corrected Address</th>
            <th className="p-3 border">Landmark</th>
            <th className="p-3 border">Pincode</th>
            <th className="p-3 border">Confidence</th>
            <th className="p-3 border">Status</th>
          </tr>

        </thead>

        <tbody>

          {orders.map((order) => (

            <tr key={order.id} className="hover:bg-gray-50">

              <td className="p-3 border">{order.id}</td>

              <td className="p-3 border">
                {order.originalAddress}
              </td>

              <td className="p-3 border">
                {order.correctedAddress}
              </td>

              <td className="p-3 border">
                {order.landmark}
              </td>

              <td className="p-3 border">
                {order.pincode}
              </td>

              <td className="p-3 border">

                <span
                  className={`font-bold ${
                    order.confidence >= 95
                      ? "text-green-600"
                      : order.confidence >= 85
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {order.confidence}%
                </span>

              </td>

              <td className="p-3 border">

                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  {order.status}
                </span>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default OrderTable;