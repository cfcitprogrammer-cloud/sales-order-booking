import { Coins, ReceiptText, RotateCw, Users } from "lucide-react";
import AnalyticsTable from "./AnalyticsTable";
import QuickSummaryTable from "./QuickSummaryTable";
import "cally";

export default function Analytics() {
  return (
    <section className="p-4 space-y-4">
      <header className="flex justify-between">
        <div>
          <input type="date" className="input input-sm" />
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
              <div className="stat-value">31K</div>
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
              <div className="stat-value">12</div>
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
