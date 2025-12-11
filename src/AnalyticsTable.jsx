"use client";

import { useState, useEffect } from "react";

export default function AnalyticsTable({ orders }) {
  const calculateTotalEarnings = (order) => {
    const cart = JSON.parse(order.orders); // Parse the cart items from the order
    const totalEarnings = cart.reduce((total, item) => {
      const price =
        item.option === "bdl" ? Number(item.packPrice) : Number(item.casePrice);
      return total + price * item.qty;
    }, 0);

    return totalEarnings;
  };

  // Function to aggregate orders by unique agents
  const aggregateAgentData = (orders) => {
    const agentsMap = {};

    orders.forEach((order) => {
      const agentId = order.raw_user_meta_data?.sub; // Unique identifier for the agent

      if (!agentsMap[agentId]) {
        agentsMap[agentId] = {
          id: order.user_id,
          name: order.raw_user_meta_data?.name || "N/A",
          totalPendingOrders: 0,
          totalOrders: 0,
          totalEarnings: 0,
          expectedEarnings: 0,
        };
      }

      // Aggregate the stats for the agent
      if (order.status == "PENDING") {
        agentsMap[agentId].totalPendingOrders += 1;
      }

      if (order.status == "APPROVED") {
        agentsMap[agentId].totalEarnings += calculateTotalEarnings(order);
      }

      agentsMap[agentId].id = order.user_id;
      agentsMap[agentId].totalOrders += 1;
      agentsMap[agentId].expectedEarnings += calculateTotalEarnings(order);
    });

    // Convert the aggregated data to an array of agents
    return Object.values(agentsMap);
  };

  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState("");

  useEffect(() => {
    const aggregatedData = aggregateAgentData(orders);
    setAgents(aggregatedData); // Update the agents state with aggregated data
  }, [orders]);

  return (
    <div className="shadow rounded-xl p-4">
      <header>
        <h2 className="text-sm font-semibold">Orders Made</h2>
        <p className="text-sm text-gray-500">All orders made during the day</p>
      </header>

      <div className="divider"></div>

      <select
        value={selectedAgent}
        onChange={(e) => setSelectedAgent(e.target.value)}
        className="select select-sm mb-4"
      >
        <option value={""} disabled={true}>
          Select Sales Agent
        </option>
        {agents.map((agent, index) => (
          <option key={index} value={agent.id}>
            {agent.name}
          </option>
        ))}
      </select>
      <div>
        {orders
          .filter((order) => order.user_id === selectedAgent) // Check if agent's user_id matches selectedAgent
          .map(
            (
              order,
              index // Use .map() to loop through the filtered agents
            ) => {
              const parsedProducts = JSON.parse(order.orders);
              const grandTotal = parsedProducts.reduce((acc, p) => {
                if (p.option === "bdl") return acc + p.qty * p.packPrice;
                else if (p.option === "case") return acc + p.qty * p.casePrice;
                return acc;
              }, 0);

              return (
                <div key={index}>
                  <div>
                    {parsedProducts.length === 0 ? (
                      <p>No products listed.</p>
                    ) : (
                      <div className="border rounded bg-white text-black p-2 mb-4">
                        <h1>
                          <span className="font-semibold">Store: </span>
                          {order.store_name}
                        </h1>
                        <p>
                          <span className="font-semibold">Status: </span>
                          <span
                            class={`badge badge-sm ${
                              order.status === "PENDING"
                                ? "badge-warning"
                                : order.status === "APPROVED"
                                ? "badge-success"
                                : "badge-neutral"
                            }`}
                          >
                            {order.status}
                          </span>
                        </p>
                        <br />

                        <div className="overflow-x-auto">
                          <table className="table table-xs">
                            <thead>
                              <tr>
                                <th>Item</th>
                                <th>Option</th>
                                <th>Qty</th>
                                <th>Price</th>
                                <th className="text-right">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {parsedProducts.map((p, idx) => {
                                const total =
                                  p.option === "bdl"
                                    ? p.qty * p.packPrice
                                    : p.qty * p.casePrice;
                                return (
                                  <tr key={idx} className="hover:bg-base-300">
                                    <td className="w-full">{p.item}</td>
                                    <td>{p.option}</td>
                                    <td>{p.qty}</td>
                                    <td>
                                      {p.option === "bdl"
                                        ? p.packPrice
                                        : p.casePrice}
                                    </td>

                                    <td className="text-right">
                                      ₱{total.toFixed(2)}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                            <tfoot>
                              <tr>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th>Grand Total: ₱{grandTotal.toFixed(2)}</th>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            }
          )}
      </div>
    </div>
  );
}
