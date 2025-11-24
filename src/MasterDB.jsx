import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { useNavigate } from "react-router-dom";

export default function MasterDB() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function loadOrders() {
      const { data, error } = await supabase
        .from("customer_data")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setErrorMsg("Unable to fetch orders.");
      } else {
        setOrders(data);
      }

      setLoading(false);
    }

    loadOrders();
  }, []);

  if (loading) return <div className="p-4 text-center">Loading orders…</div>;
  if (errorMsg) return <div className="p-4 text-red-500">{errorMsg}</div>;

  return (
    <section className="p-4">
      <div className="max-w-[1000px] mx-auto">
        <h1 className="text-3xl font-bold mb-6">All Orders (Master DB)</h1>

        {orders.length === 0 ? (
          <div>No orders found.</div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              let products = [];
              try {
                if (order.orders) {
                  products = JSON.parse(order.orders);
                  if (typeof products === "string")
                    products = JSON.parse(products);
                }
              } catch (e) {
                console.error("Failed to parse products:", e);
                products = [];
              }

              const grandTotal = products.reduce((acc, p) => {
                if (p.option === "pack") return acc + p.qty * p.packPrice;
                else if (p.option === "case") return acc + p.casePrice;
                return acc;
              }, 0);

              return (
                <div
                  key={order.id}
                  className="border p-4 rounded shadow-sm bg-white text-black"
                >
                  {/* Order header */}
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-semibold">
                      Order ID: {order.id}
                    </h2>
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

                  <div className="space-y-1 mb-3">
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
                      <strong>Remarks:</strong> {order.remarks}
                    </p>
                  </div>

                  {/* Products as list with header */}
                  {products.length === 0 ? (
                    <p>No products listed.</p>
                  ) : (
                    <div className="mb-4">
                      <h3 className="font-semibold mb-2">Products:</h3>

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
                              : p.casePrice;

                          return (
                            <div
                              key={idx}
                              className="flex justify-between py-1"
                            >
                              <div className="flex-1">{p.item}</div>
                              <div className="w-20 text-center">{p.option}</div>
                              <div className="w-20 text-center">{p.qty}</div>
                              <div className="w-24 text-right">
                                ₱{total.toFixed(2)}
                              </div>
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

                  {/* View Details Button */}
                  <div className="text-right">
                    <button
                      onClick={() => navigate(`${order.id}`)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
