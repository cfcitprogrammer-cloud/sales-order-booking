import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "./supabase";
import { convertTo12HourFormat } from "./utils/time";
import useAuthStore from "./stores/authStore";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);
  const [showApprovePrompt, setShowApprovePrompt] = useState(false);

  const { role } = useAuthStore();

  useEffect(() => {
    async function loadOrder() {
      const { data, error } = await supabase
        .from("customer_with_user")
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
    if (p.option === "bdl") return acc + p.qty * p.packPrice;
    else if (p.option === "case") return acc + p.qty * p.casePrice;
    return acc;
  }, 0);

  // Cancel order function
  async function handleCancelOrder() {
    const { error } = await supabase
      .from("customer_data")
      .update({ status: "CANCELLED" })
      .eq("id", id);

    if (error) {
      console.error("Error canceling order:", error);
      setErrorMsg("Failed to cancel order.");
    } else {
      setOrder((prevOrder) => ({ ...prevOrder, status: "CANCELLED" }));
      setShowCancelPrompt(false);
    }
  }

  // Approve order function
  // Approve order function
  async function handleApproveOrder() {
    try {
      // Update the status of the order in Supabase
      const { error } = await supabase
        .from("customer_data")
        .update({ status: "APPROVED" })
        .eq("id", id);

      if (error) {
        console.error("Error approving order:", error);
        setErrorMsg("Failed to approve order.");
      } else {
        // Update local state to reflect the approved status
        setOrder((prevOrder) => ({ ...prevOrder, status: "APPROVED" }));
        setShowApprovePrompt(false);

        // Send the order ID to doPost for email notifications
        await fetch(
          "https://script.google.com/macros/s/AKfycbxze7oca6jrdNMQyySwgljQAhrFG-4PM7ZlsomiZv1m1vV2K_xACblJWMI_LmPl-PJX/exec", // Your Google Apps Script URL
          {
            method: "POST",
            headers: {
              "Content-Type": "text/plain",
            },
            body: JSON.stringify({
              orderIds: [id], // Send the single order ID to doPost for logistics email
            }),
          },
        );

        console.log("Logistics team notified about approved order.");
      }
    } catch (error) {
      console.error("Error approving order:", error);
      setErrorMsg("Failed to approve order.");
    }
  }

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

        <header className="mb-4 flex flex-wrap justify-between items-center gap-2">
          <h1 className="text-3xl font-bold mb-4">Order Details</h1>

          <button
            className="btn btn-primary"
            onClick={() => navigate(`/print/${order.id}`)}
          >
            Print
          </button>
        </header>

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
              <strong>Agent:</strong> {order.raw_user_meta_data?.name}
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
              {convertTo12HourFormat(order.receiving_time)}
            </p>
            <p>
              <strong>Remarks:</strong> {order.remarks}
            </p>
            {order.attachment && <img src={order.attachment} alt="img" />}
          </div>
        </div>

        <div className="space-x-4">
          {/* Cancel Order Button */}
          {order.status === "PENDING" && ["sales", "dev"].includes(role) && (
            <button
              onClick={() => setShowCancelPrompt(true)}
              className="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Cancel Order
            </button>
          )}

          {order.status === "PENDING" &&
            ["accounting", "dev"].includes(role) && (
              <button
                onClick={() => setShowApprovePrompt(true)}
                className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
              >
                Approve Order
              </button>
            )}
        </div>

        {/* Confirmation Prompts */}
        {showCancelPrompt && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg text-center">
              <h3 className="text-lg font-semibold mb-4">
                Are you sure you want to cancel this order?
              </h3>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowCancelPrompt(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  No
                </button>
                <button
                  onClick={handleCancelOrder}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}

        {showApprovePrompt && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg text-center">
              <h3 className="text-lg font-semibold mb-4">
                Are you sure you want to approve this order?
              </h3>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowApprovePrompt(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  No
                </button>
                <button
                  onClick={handleApproveOrder}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products List */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Products</h3>

          {products.length === 0 ? (
            <p>No products listed.</p>
          ) : (
            <div className="border rounded bg-white text-black p-2">
              {/* Header row */}
              <div className="overflow-x-auto">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Option</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p, idx) => {
                      const total =
                        p.option === "bdl"
                          ? p.qty * p.packPrice
                          : p.qty * p.casePrice;
                      return (
                        <tr key={idx}>
                          <td className="flex-1">{p.item}</td>
                          <td>{p.option}</td>
                          <td>{p.qty}</td>
                          <td>
                            {p.option === "bdl" ? p.packPrice : p.casePrice}
                          </td>

                          <td>₱{total.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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
