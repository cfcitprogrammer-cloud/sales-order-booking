import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { useNavigate } from "react-router-dom";
import SkeletonLoading from "./SkeletonLoading";
import { convertTo12HourFormat } from "./utils/time";
import { usePaginationStore } from "./stores/paginate";
import { Check } from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("store_name");

  const navigate = useNavigate();

  // Zustand pagination state
  const { page, totalPages, setPage, setTotalPages } = usePaginationStore();

  async function setDeliveredAt(orderId) {
    setLoading(true);

    if (!orderId) return;

    const { data, error } = await supabase
      .from("customer_data")
      .update({
        delivered_at: new Date().toISOString(), // or delivered_at if that's the column name
      })
      .eq("id", orderId);

    setLoading(false);

    if (error) {
      alert("Error updating delivered time:", error);
    } else {
      alert("Updated Order");
    }
  }

  async function loadOrders(value = "") {
    const pageSize = 10;
    const offset = (page - 1) * pageSize;

    setLoading(true);

    let query = supabase
      .from("customer_with_user")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (searchQuery.trim() !== "") {
      if (searchField === "id") {
        query = query.eq(searchField, searchQuery);
      } else {
        query = query.ilike(
          `${searchField}::text`,
          `%${value === "" ? searchQuery : value}%`,
        );
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

  useEffect(() => {
    loadOrders();
  }, [searchField, page]);

  function search(value) {
    setSearchQuery(value);
    setPage(1); // reset to first page on new search
    loadOrders(value);
  }

  if (loading) return <SkeletonLoading />;
  if (errorMsg) return <div className="p-4 text-red-500">{errorMsg}</div>;

  return (
    <section className="p-4">
      <div>
        <h1 className="text-3xl font-bold mb-6">All Orders (Master DB)</h1>

        {/* Search Section */}
        <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div className="flex space-x-4 mb-4 sm:mb-0">
            <input
              type="text"
              className="input input-bordered w-full sm:w-auto"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) =>
                e.target.value === ""
                  ? search(e.target.value)
                  : setSearchQuery(e.target.value)
              }
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
            <button
              className="btn btn-primary"
              onClick={() => search(searchQuery)}
            >
              Search
            </button>
          </div>
        </div>

        {/* Orders Table / List */}
        {orders.length === 0 ? (
          <div>No orders found.</div>
        ) : (
          <>
            {/* Table for large screens */}
            <div className="hidden lg:block">
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full table-sm">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Store Name</th>
                      <th>Agent</th>
                      <th>Location</th>
                      <th>Delivery Date</th>
                      <th>Receiving Time</th>
                      <th>Delivered At</th>
                      <th>Status</th>
                      <th>Action</th>
                      <th>
                        <Check />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.store_name}</td>
                        <td>{order.raw_user_meta_data?.name}</td>
                        <td>{order.location}</td>
                        <td>
                          {new Date(order.delivery_date).toLocaleDateString()}
                        </td>
                        <td>{convertTo12HourFormat(order.receiving_time)}</td>
                        <td>
                          {" "}
                          {order.delivered_at
                            ? new Date(order.delivered_at).toLocaleString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )
                            : "Not delivered yet"}
                        </td>
                        <td>
                          <span
                            className={`badge badge-sm ${
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
                            className="btn btn-primary btn-xs"
                          >
                            View
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn btn-secondary btn-xs"
                            onClick={() => setDeliveredAt(order.id)}
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* List for small screens */}
            <div className="lg:hidden">
              {/* ...keep your existing list view code here... */}
            </div>
          </>
        )}

        {/* Pagination */}
        <div className="mt-4">
          <div className="join">
            <button
              onClick={() => setPage(Math.max(page - 1, 1))}
              className="join-item btn"
              disabled={page === 1}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`join-item btn ${page === index + 1 ? "btn-active" : ""}`}
                onClick={() => setPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => setPage(Math.min(page + 1, totalPages))}
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
