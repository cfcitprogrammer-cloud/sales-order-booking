import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { useNavigate } from "react-router-dom";
import SkeletonLoading from "./SkeletonLoading";
import { convertTo12HourFormat } from "./utils/time";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("store_name");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadOrders() {
      const pageSize = 10;
      const offset = (page - 1) * pageSize;

      let query = supabase
        .from("customer_data")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(offset, offset + pageSize - 1);

      if (searchQuery.trim() !== "") {
        if (searchField === "id") {
          query = query.eq(searchField, searchQuery);
        } else {
          query = query.ilike(`${searchField}::text`, `%${searchQuery}%`);
        }
      }

      const { data, error, count } = await query;

      if (error) {
        console.error(error);
        setErrorMsg("Unable to fetch orders.");
      } else {
        setOrders(data);
        setTotalPages(Math.ceil(count / pageSize));
      }

      setLoading(false);
    }

    loadOrders();
  }, [searchQuery, searchField, page]);

  if (loading) return <SkeletonLoading />;
  if (errorMsg) return <div className="p-4 text-red-500">{errorMsg}</div>;

  return (
    <section className="p-4">
      <div>
        <h1 className="text-3xl font-bold mb-6">All Orders (Master DB)</h1>

        {/* Search and Filter Section */}
        <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div className="flex space-x-4 mb-4 sm:mb-0">
            <input
              type="text"
              className="input input-bordered w-full sm:w-auto"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="select select-bordered"
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
            >
              <option value="store_name">Store Name</option>
              <option value="customer_name">Customer Name</option>
              <option value="id">Order ID</option>
              <option value="location">Location</option>
            </select>
          </div>
        </div>

        {orders.length === 0 ? (
          <div>No orders found.</div>
        ) : (
          <>
            {/* Table View for Large Screens */}
            <div className="hidden lg:block">
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Store Name</th>
                      <th>Location</th>
                      <th>Customer Name</th>
                      <th>Contact Person</th>
                      <th>Delivery Date</th>
                      <th>Receiving Time</th>
                      <th>Created At</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.store_name}</td>
                        <td>{order.location}</td>
                        <td>{order.customer_name}</td>
                        <td>{order.contact_person}</td>
                        {/* Display Contact Person */}
                        <td>
                          {new Date(order.delivery_date).toLocaleDateString()}
                        </td>
                        {/* Display Delivery Date */}
                        <td>{convertTo12HourFormat(order.receiving_time)}</td>
                        <td>{new Date(order.created_at).toLocaleString()}</td>
                        <td>
                          <span
                            className={`badge ${
                              order.status === "PENDING"
                                ? "badge-warning"
                                : order.status === "APPROVED"
                                ? "badge-success"
                                : "badge-neutral"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => navigate(`/master/db/${order.id}`)}
                            className="btn btn-primary"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* List View for Small Screens */}
            <div className="lg:hidden">
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
                  else if (p.option === "case")
                    return acc + p.qty * p.casePrice;
                  return acc;
                }, 0);

                return (
                  <div
                    key={order.id}
                    className="border p-4 rounded-lg shadow-sm bg-white text-black mb-4"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-lg font-semibold">
                        Order ID: {order.id}
                      </h2>
                      <span
                        className={`badge ${
                          order.status === "PENDING"
                            ? "badge-warning"
                            : order.status === "APPROVED"
                            ? "badge-success"
                            : "badge-neutral"
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
                      <strong>Contact Person:</strong> {order.contact_person}{" "}
                      {/* Display Contact Person */}
                    </p>
                    <p>
                      <strong>Delivery Date:</strong>{" "}
                      {order.delivery_date
                        ? new Date(order.delivery_date).toLocaleDateString()
                        : "N/A"}{" "}
                      {/* Display Delivery Date */}
                    </p>
                    <p>
                      <strong>Receiving Time:</strong>{" "}
                      {convertTo12HourFormat(order.receiving_time)}
                    </p>
                    <p>
                      <strong>Remarks: </strong>
                      {order.remarks || "None"}
                    </p>
                    {order.attachment && (
                      <img src={order.attachment} alt="img" />
                    )}

                    {/* Table of Product Items */}
                    <div className="overflow-x-auto mt-4">
                      <table className="table table-zebra w-full">
                        <thead>
                          <tr>
                            <th>Product Name</th>
                            <th>Option</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((product, index) => {
                            const totalPrice =
                              product.option === "pack"
                                ? product.qty * product.packPrice
                                : product.option === "case"
                                ? product.qty * product.casePrice
                                : 0;

                            return (
                              <tr key={index}>
                                <td>{product.item}</td>
                                <td>{product.option}</td>
                                <td>{product.qty}</td>
                                <td>
                                  {product.option === "pack"
                                    ? product.packPrice
                                    : product.casePrice}
                                </td>
                                <td>{totalPrice.toFixed(2)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Display Grand Total */}
                    <div className="mt-4 text-right font-semibold">
                      <p>Total: ₱{grandTotal.toFixed(2)}</p>
                    </div>

                    <div className="mt-2 text-right">
                      <button
                        onClick={() => navigate(`/master/db/${order.id}`)}
                        className="btn btn-primary"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Pagination Controls */}
        <div className="mt-4">
          <div className="join">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="join-item btn"
              disabled={page === 1}
            >
              Previous
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`join-item btn ${
                  page === index + 1 ? "btn-active" : ""
                }`}
                onClick={() => setPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              className="join-item btn"
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
