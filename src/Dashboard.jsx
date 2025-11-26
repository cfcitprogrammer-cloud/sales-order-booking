import {
  Box,
  ChartSpline,
  HelpCircle,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRight,
  PanelRightOpen,
  ReceiptText,
} from "lucide-react";
import { useState } from "react";
import Products from "./Products";
import Checkout from "./Checkout";
import { Link, Routes, Route, Navigate } from "react-router-dom";
import Done from "./Done";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function toggleAside() {
    setIsSidebarOpen(!isSidebarOpen);
  }

  return (
    <main className="grid grid-cols-12 h-screen relative">
      {/* Sidebar for mobile and desktop */}
      <aside
        className={`col-span-2 z-50 bg-gray-100 h-full flex flex-col lg:relative lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out fixed inset-0 lg:static lg:h-auto`}
      >
        <header className="p-4 flex justify-between items-center gap-2 border-b border-gray-300">
          <div className="flex items-center gap-2">
            <Package size={18} />
            <h1 className="font-semibold">Sales Order Booking</h1>
          </div>

          <button
            onClick={toggleAside}
            className="btn btn-sm btn-primary lg:hidden"
          >
            <PanelLeftClose />
          </button>
        </header>

        <div>
          <h2 className="px-4 py-2 text-sm font-semibold text-slate-500">
            Main
          </h2>

          <Link
            to="/products"
            className="btn btn-ghost w-full justify-start items-center rounded-none font-normal"
          >
            <Box size={16} className="mr-2" />
            Products
          </Link>
          <Link
            to="/orders"
            className="btn btn-ghost w-full justify-start rounded-none font-normal"
          >
            <ReceiptText size={16} className="mr-2" />
            Orders
          </Link>
          <Link
            to="/analytics"
            className="btn btn-ghost w-full justify-start rounded-none font-normal"
          >
            <ChartSpline size={16} className="mr-2" />
            Analytics
          </Link>
        </div>

        <footer className="mt-auto">
          <a
            href="#"
            className="btn btn-ghost w-full justify-start items-center rounded-none font-normal"
          >
            <HelpCircle size={16} className="mr-2" />
            Get Help
          </a>
        </footer>
      </aside>

      {/* Main content area */}
      <section className="col-span-12 lg:col-span-10 bg-white h-full max-h-full overflow-y-scroll">
        <nav className="flex items-center justify-between p-2 lg:hidden">
          <button
            onClick={toggleAside}
            className="btn btn-primary btn-sm lg:hidden"
          >
            <PanelLeftOpen />
          </button>

          <h1 className="font-semibold text-sm">Sales Order Booking</h1>
        </nav>
        {/* Content here */}
        <Routes>
          <Route path="/products" element={<Products />} />
          <Route path="/products/checkout" element={<Checkout />} />
          <Route path="/products/done" element={<Done />} />

          {/* Catch-all route for invalid paths */}
          <Route path="*" element={<Navigate to="/products" replace />} />
        </Routes>
      </section>
    </main>
  );
}
