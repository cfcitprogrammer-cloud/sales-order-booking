"use client";

import { useEffect, useState } from "react";

export default function QuickSummaryTable({
  orders,
  setTotalAgents,
  setOrderStats,
}) {
  // Function to calculate the order stats for a specific order (cart list)
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
    let a = 0;
    let p = 0;
    let c = 0;

    orders.forEach((order) => {
      const agentId = order.raw_user_meta_data?.sub; // Unique identifier for the agent

      if (!agentsMap[agentId]) {
        agentsMap[agentId] = {
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
        p += 1;
      } else if (order.status == "APPROVED") {
        agentsMap[agentId].totalEarnings += calculateTotalEarnings(order);
        a += 1;
      } else {
        c += 1;
      }

      agentsMap[agentId].totalOrders += 1;
      agentsMap[agentId].expectedEarnings += calculateTotalEarnings(order);

      setOrderStats(a, p, c);
    });

    // Convert the aggregated data to an array of agents
    return Object.values(agentsMap);
  };

  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const aggregatedData = aggregateAgentData(orders);
    setAgents(aggregatedData); // Update the agents state with aggregated data
    setTotalAgents(Object.keys(aggregatedData).length);
  }, [orders]);

  return (
    <div className="shadow p-4 rounded-xl">
      <div>
        <h1 className="text-sm font-semibold">Quick Summary</h1>
        <p className="text-gray-600 text-sm">
          Total orders made by each sales agent
        </p>
      </div>
      <div className="divider"></div>
      {orders.length <= 0 ? (
        <p className="text-center text-sm text-gray-600">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-xs">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Pending Orders</th>
                <th>Total Orders Made</th>
                <th>Total Earnings Made</th>
                <th>Expected Earnings</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent, index) => (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <td>{agent.name}</td>
                  <td>{agent.totalPendingOrders}</td>
                  <td>{agent.totalOrders}</td>
                  <td>₱{agent.totalEarnings.toFixed(2)}</td>
                  <td>₱{agent.expectedEarnings.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
