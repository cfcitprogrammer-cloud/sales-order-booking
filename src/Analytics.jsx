"use client";

import { Coins, ReceiptText, RotateCw, Users } from "lucide-react";
import AnalyticsTable from "./AnalyticsTable";
import QuickSummaryTable from "./QuickSummaryTable";
import "cally";
import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import useAuthStore from "./stores/authStore";

export default function Analytics() {
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [orders, setOrders] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalAgents, setTotalAgents] = useState(4);
  const [totalOrders, setTotalOrders] = useState(0);
  const { user } = useAuthStore();

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
        .from("customer_data_dev")
        .select("*")
        .order("created_at", { ascending: false })
        .gte("created_at", startOfDay) // Greater than or equal to the start of the day
        .lte("created_at", endOfDay);

      if (error) {
        alert(error.message);
      } else {
        setTotalOrders(data.length);
        setTotalEarnings(getTotalEarnings(data));
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

  useEffect(() => {
    fetchOrders();
  }, [date]);

  return (
    <section className="p-4 space-y-4">
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
          <button className="btn btn-sm btn-ghost btn-primary">
            <RotateCw size={16} /> Refresh Data
          </button>
        </div>
      </header>

      <div className="space-y-6">
        <div className="flex gap-4">
          <div className="stats shadow flex-1">
            <div className="stat">
              <div className="stat-figure text-secondary">
                <Coins size={32} />
              </div>
              <div className="stat-title">Total Earnings</div>
              <div className="stat-value">₱{totalEarnings}</div>
              <div className="stat-desc">As of said date</div>
            </div>
          </div>

          <div className="stats shadow flex-1">
            <div className="stat">
              <div className="stat-figure text-secondary">
                <Users size={32} />
              </div>
              <div className="stat-title">Total Sales Agents</div>
              <div className="stat-value">4</div>
              <div className="stat-desc">As of said date</div>
            </div>
          </div>

          <div className="stats shadow flex-1">
            <div className="stat">
              <div className="stat-figure text-secondary">
                <ReceiptText size={32} />
              </div>
              <div className="stat-title">Total Orders</div>
              <div className="stat-value">{totalOrders}</div>
              <div className="stat-desc">As of said date</div>
            </div>
          </div>
        </div>

        <QuickSummaryTable />
      </div>

      <div>
        <AnalyticsTable />
      </div>
    </section>
  );
}
