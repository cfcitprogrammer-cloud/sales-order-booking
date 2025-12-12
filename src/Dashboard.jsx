"use client";

import {
  Box,
  ChartSpline,
  HelpCircle,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  ReceiptText,
  Stamp,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Link,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Products from "./Products";
import Checkout from "./Checkout";
import Done from "./Done";
import Orders from "./Orders";
import OrderDetails from "./OrderDetails";
import Login from "./Login";
import { supabase } from "./supabase";
import Analytics from "./Analytics";
import Register from "./Register";
import useAuthStore from "./stores/authStore";

import PrivateRoute from "./PrivateRoute";
import ApproveOrder from "./ApproveOrders";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { user, signOut, role } = useAuthStore();

  // Toggle sidebar
  function toggleAside() {
    setIsSidebarOpen(!isSidebarOpen);
    console.log(user.app_metadata);
  }

  // Close sidebar when a link is clicked
  function handleLinkClick() {
    if (isSidebarOpen) {
      toggleAside();
    }
  }

  async function logOut() {
    await signOut();
    navigate("/login");
  }

  // Determine if the current route is the login page
  const isLoginPage =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <main
      className={`grid grid-cols-12 h-screen relative ${
        isLoginPage ? "bg-white" : ""
      }`}
    >
      {/* Sidebar for mobile and desktop */}
      {!isLoginPage && (
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
              onClick={handleLinkClick} // Close sidebar when clicked
              className="btn btn-ghost w-full justify-start items-center rounded-none font-normal"
            >
              <Box size={16} className="mr-2" />
              Products
            </Link>
            <Link
              to="/orders"
              onClick={handleLinkClick} // Close sidebar when clicked
              className="btn btn-ghost w-full justify-start rounded-none font-normal"
            >
              <ReceiptText size={16} className="mr-2" />
              Orders
            </Link>

            <Link
              to="/analytics"
              onClick={handleLinkClick} // Close sidebar when clicked
              className="btn btn-ghost w-full justify-start rounded-none font-normal"
            >
              <ChartSpline size={16} className="mr-2" />
              Analytics
            </Link>
            <Link
              to="/approve-orders"
              onClick={handleLinkClick} // Close sidebar when clicked
              className="btn btn-ghost w-full justify-start rounded-none font-normal"
            >
              <Stamp size={16} className="mr-2" />
              Approve Orders
            </Link>
          </div>

          <footer className="mt-auto">
            <div className="divider"></div>
            <div className="px-4 pb-4">
              <div className="rounded space-y-4">
                <div>
                  <h1 className="font-semibold font-md">
                    {user?.user_metadata?.name}
                  </h1>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>

                <button
                  className="btn btn-sm btn-secondary w-full"
                  onClick={logOut}
                >
                  Log Out
                </button>
              </div>
            </div>
          </footer>
        </aside>
      )}

      {/* Main content area */}
      <section
        className={`col-span-12 bg-white h-full max-h-full overflow-y-scroll ${
          isLoginPage ? "p-6" : "lg:col-span-10"
        }`}
      >
        {/* Navigation bar only for non-login routes */}
        {!isLoginPage && (
          <nav className="flex items-center justify-between p-2 lg:hidden">
            <button
              onClick={toggleAside}
              className="btn btn-primary btn-sm lg:hidden"
            >
              <PanelLeftOpen />
            </button>

            <h1 className="font-semibold text-sm">Sales Order Booking</h1>
          </nav>
        )}

        {/* Content here */}
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route element={<PrivateRoute />}>
            {["dev", "admin", "accounting", "sales"].includes(role) && (
              <>
                <Route path="/products" element={<Products />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/master/db/:id" element={<OrderDetails />} />
              </>
            )}

            {["dev", "sales"].includes(role) && (
              <>
                <Route path="/products/checkout" element={<Checkout />} />
                <Route path="/products/done" element={<Done />} />
              </>
            )}

            {["dev", "admin", "accounting"].includes(role) && (
              <>
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/approve-orders" element={<ApproveOrder />} />
              </>
            )}
          </Route>

          {/* Catch-all route for invalid paths */}
          <Route path="*" element={<Navigate to="/products" replace />} />
        </Routes>
      </section>
    </main>
  );
}
