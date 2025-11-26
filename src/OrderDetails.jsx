import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "./supabase";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function loadOrder() {
      const { data, error } = await supabase
        .from("customer_data")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        setErrorMsg("Unable to fetch order.");
      } else {
        setOrder(data);
      }

      setLoading(false);
    }

    loadOrder();
  }, [id]);

  if (loading) return <div className="p-4 text-center">Loading order…</div>;
  if (errorMsg) return <div className="p-4 text-red-500">{errorMsg}</div>;
  if (!order) return <div className="p-4">Order not found.</div>;

  // Parse products safely
  let products = [];
  try {
    if (order.orders) {
      products = JSON.parse(order.orders);
      if (typeof products === "string") products = JSON.parse(products);
    }
  } catch (e) {
    console.error("Failed to parse products:", e);
    products = [];
  }

  // Calculate grand total
  const grandTotal = products.reduce((acc, p) => {
    if (p.option === "pack") return acc + p.qty * p.packPrice;
    else if (p.option === "case") return acc + p.qty * p.casePrice;
    return acc;
  }, 0);

  return (
    <section className="p-4">
      <div className="max-w-[1000px] mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold mb-4">Order Details</h1>

        {/* Order Info */}
        <div className="border p-4 rounded shadow-sm bg-white text-black mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">Order ID: {order.id}</h2>
            <span
              className={`px-2 py-1 rounded text-white font-semibold ${
                order.status === "PENDING"
                  ? "bg-yellow-500"
                  : order.status === "APPROVED"
                  ? "bg-green-500"
                  : "bg-gray-500"
              }`}
            >
              {order.status}
            </span>
          </div>

          <p className="text-sm text-gray-500 mb-2">
            Created At:{" "}
            {order.created_at
              ? new Date(order.created_at).toLocaleString()
              : "N/A"}
          </p>

          <div className="space-y-1">
            <p>
              <strong>Store:</strong> {order.store_name}
            </p>
            <p>
              <strong>Location:</strong> {order.location}
            </p>
            <p>
              <strong>Customer:</strong> {order.customer_name}
            </p>
            <p>
              <strong>Contact Person:</strong> {order.contact_person}
            </p>
            <p>
              <strong>Delivery Date:</strong> {order.delivery_date}
            </p>
            <p>
              <strong>Receiving Time:</strong>{" "}
              {order.receiving_time
                ? new Date(
                    `2025-12-05T${order.receiving_time}Z`
                  ).toLocaleString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                : "N/A"}
            </p>
            <p>
              <strong>Remarks:</strong> {order.remarks}
            </p>
          </div>
        </div>

        {/* Products List */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Products</h3>

          {products.length === 0 ? (
            <p>No products listed.</p>
          ) : (
            <div className="border rounded bg-white text-black p-2">
              {/* Header row */}
              <div className="flex justify-between font-semibold border-b border-gray-300 pb-1 mb-1 text-gray-700">
                <div className="flex-1">Item</div>
                <div className="w-20 text-center">Option</div>
                <div className="w-20 text-center">Qty</div>
                <div className="w-24 text-right">Total</div>
              </div>

              {/* Product rows */}
              <div className="divide-y divide-gray-200">
                {products.map((p, idx) => {
                  const total =
                    p.option === "pack"
                      ? p.qty * p.packPrice
                      : p.qty * p.casePrice;
                  const bgClass = idx % 2 === 0 ? "bg-gray-50" : "bg-white"; // alternating row color
                  return (
                    <div
                      key={idx}
                      className={`flex justify-between py-1 ${bgClass}`}
                    >
                      <div className="flex-1">{p.item}</div>
                      <div className="w-20 text-center">{p.option}</div>
                      <div className="w-20 text-center">{p.qty}</div>
                      <div className="w-24 text-right">₱{total.toFixed(2)}</div>
                    </div>
                  );
                })}
              </div>

              {/* Grand Total */}
              <div className="mt-2 text-right font-bold text-lg">
                Grand Total: ₱{grandTotal.toFixed(2)}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
