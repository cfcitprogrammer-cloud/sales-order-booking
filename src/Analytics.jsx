"use client";

import { Coins, HandCoins, ReceiptText, RotateCw, Users } from "lucide-react";
import AnalyticsTable from "./AnalyticsTable";
import QuickSummaryTable from "./QuickSummaryTable";
import "cally";
import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import useAuthStore from "./stores/authStore";
import { useNavigate } from "react-router-dom";

export default function Analytics() {
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [orders, setOrders] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalExpectedEarnings, setTotalExpectedEarnings] = useState(0);
  const [totalAgents, setTotalAgents] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [activeOrders, setActiveOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [cancelledOrders, setCancelledOrders] = useState(0);

  const { user } = useAuthStore();
  const navigate = useNavigate();

  function updateDate(value) {
    setLoading(true);
    setDate(value);
    setLoading(false);
  }

  async function fetchOrders() {
    const startOfDay = `${date}T00:00:00`;
    const endOfDay = `${date}T23:59:59`;

    try {
      const { data, error } = await supabase
        .from("customer_data_with_users") // Query the view we just created
        .select("*") // Select all columns from the view (includes data from both tables)
        .order("created_at", { ascending: false })
        .gte("created_at", startOfDay) // Greater than or equal to the start of the day
        .lte("created_at", endOfDay);

      console.log(data);

      if (error) {
        alert(error.message);
      } else {
        setTotalOrders(data.length);
        setTotalEarnings(getTotalEarnings(data));
        setTotalExpectedEarnings(getTotalExpectedEarnings(data));
        setOrders(data);
      }
    } catch (error) {
      alert(error.message);
    }
  }

  function getTotalEarnings(orders) {
    if (orders.length > 0) {
      let grandTotal = 0;

      orders.forEach((item) => {
        if (item.status === "APPROVED") {
          const odrs = JSON.parse(item.orders);

          const total = odrs.reduce((total, item) => {
            const price =
              item.option === "bdl"
                ? Number(item.packPrice)
                : Number(item.casePrice);
            return total + price * item.qty;
          }, 0);

          grandTotal += total;
        }
      });

      return grandTotal.toLocaleString(); // Format the total to be a localized string
    }

    return 0;
  }

  function getTotalExpectedEarnings(orders) {
    if (orders.length > 0) {
      let grandTotal = 0;

      orders.forEach((item) => {
        const odrs = JSON.parse(item.orders);

        const total = odrs.reduce((total, item) => {
          const price =
            item.option === "bdl"
              ? Number(item.packPrice)
              : Number(item.casePrice);
          return total + price * item.qty;
        }, 0);

        grandTotal += total;
      });

      return grandTotal.toLocaleString();
    }

    return 0;
  }

  function setOrderStats(approved = 0, pending = 0, cancelled = 0) {
    setActiveOrders(approved);
    setPendingOrders(pending);
    setCancelledOrders(cancelled);
  }

  useEffect(() => {
    fetchOrders();
  }, [date]);

  return (
    <section className="p-4 space-y-4">
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <span class="loading loading-spinner text-primary"></span>
        </div>
      ) : (
        <>
          {" "}
          <header className="flex justify-between">
            <div>
              <input
                type="date"
                className="input input-sm"
                value={date}
                onChange={(e) => updateDate(e.target.value)}
              />
            </div>

            <div>
              <button
                className="btn btn-sm btn-ghost btn-primary"
                onClick={(e) => navigate(0)}
              >
                <RotateCw size={16} /> Refresh Data
              </button>
            </div>
          </header>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <div className="stats stats-vertical md:stats-horizontal shadow">
                <div className="stat">
                  <div className="stat-figure text-secondary">
                    <HandCoins size={32} />
                  </div>
                  <div className="stat-title">Total Expected Earnings</div>
                  <div className="stat-value">₱{totalExpectedEarnings}</div>
                  <div className="stat-desc">Total earnings of all orders</div>
                </div>
              </div>

              <div className="stats stats-vertical md:stats-horizontal shadow">
                <div className="stat">
                  <div className="stat-figure text-secondary">
                    <Coins size={32} />
                  </div>
                  <div className="stat-title">Total Confirmed Earnings</div>
                  <div className="stat-value">₱{totalEarnings}</div>
                  <div className="stat-desc">
                    Total earnings of approved orders
                  </div>
                </div>
              </div>

              <div className="stats stats-vertical md:stats-horizontal shadow">
                <div className="stat">
                  <div className="stat-figure text-secondary">
                    <Users size={32} />
                  </div>
                  <div className="stat-title">Total Active Agents</div>
                  <div className="stat-value">{totalAgents}</div>
                  <div className="stat-desc">As of this date</div>
                </div>
              </div>

              <div className="stats stats-vertical md:stats-horizontal shadow">
                <div className="stat">
                  <div className="stat-figure text-secondary">
                    <ReceiptText size={32} />
                  </div>
                  <div className="stat-title">Total Orders</div>
                  <div className="stat-value">{totalOrders}</div>
                  <div className="stat-desc">
                    <div className="flex gap-2 items-center">
                      <div
                        aria-label="success"
                        className="status status-success"
                      ></div>
                      {activeOrders}
                      <div
                        aria-label="success"
                        className="status status-warning"
                      ></div>
                      {pendingOrders}
                      <div
                        aria-label="success"
                        className="status status-neutral"
                      ></div>
                      {cancelledOrders}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <QuickSummaryTable
              orders={orders}
              setTotalAgents={setTotalAgents}
              setOrderStats={setOrderStats}
            />
          </div>
          <div>
            <AnalyticsTable orders={orders} />
          </div>
        </>
      )}
    </section>
  );
}
