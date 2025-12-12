"use client";

import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import { Check, Ellipsis, Eye, Hourglass, X } from "lucide-react";
import ApproveModal from "./ApproveModal";
import { Link } from "react-router-dom";

export default function ApproveOrder() {
  const [searchQuery, setQuery] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrders, setSelectedOrders] = useState(new Set());
  const [modalMessage, setModalMessage] = useState("");
  const [modalAction, setModalAction] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const loadOrders = async (status = "") => {
    const pageSize = 10;
    const offset = (page - 1) * pageSize;

    setLoading(true);
    let query = supabase
      .from("customer_data_dev")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (status) query = query.eq("status", status);
    if (searchQuery.trim())
      query = query.ilike("store_name", `%${searchQuery}%`);

    const { data, error, count } = await query;

    if (error) {
      setErrorMsg("Unable to fetch orders.");
    } else {
      setOrders(data);
      setTotalPages(Math.ceil(count / pageSize));
    }

    setLoading(false);
  };

  useEffect(() => {
    loadOrders(filterStatus);
  }, [page, filterStatus]);

  useEffect(() => {
    if (searchQuery.length <= 0) {
      loadOrders(filterStatus);
    }
  }, [searchQuery]);

  const handleSelectAllChange = (event) => {
    setSelectedOrders(
      event.target.checked
        ? new Set(orders.map((order) => order.id))
        : new Set()
    );
  };

  const handleSelectChange = (event, orderId) => {
    const updatedSelectedOrders = new Set(selectedOrders);
    event.target.checked
      ? updatedSelectedOrders.add(orderId)
      : updatedSelectedOrders.delete(orderId);
    setSelectedOrders(updatedSelectedOrders);
  };

  const massActionSelected = async (action) => {
    if (selectedOrders.size <= 0)
      return alert("Please select at least one order.");

    try {
      const { error } = await supabase
        .from("customer_data_dev")
        .update({ status: action })
        .in("id", Array.from(selectedOrders));

      if (error) throw error;

      loadOrders(filterStatus);
      setSelectedOrders(new Set());
    } catch (error) {
      alert(`Error updating status: ${error.message}`);
    }
  };

  const handleDropdownAction = (action, id) => {
    const messages = {
      APPROVED: "Are you sure you want to approve the selected orders?",
      PENDING: "Are you sure you want to mark the selected orders as pending?",
      CANCELLED: "Are you sure you want to cancel the selected orders?",
    };

    setModalAction(action);
    setSelectedOrders(new Set([id]));
    setModalMessage(messages[action] || "Are you sure you want to proceed?");
    document.getElementById("my_modal").showModal();
  };

  const handleActionConfirm = async () => {
    if (!modalAction) return;
    await massActionSelected(modalAction);
    document.getElementById("my_modal").close();
  };

  const isAllSelected =
    orders.length > 0 && orders.length === selectedOrders.size;

  if (errorMsg) return <div className="p-4 text-red-500">{errorMsg}</div>;

  return (
    <section className="p-4 flex flex-col">
      <ApproveModal message={modalMessage} onConfirm={handleActionConfirm} />
      <header>
        <h1 className="text-2xl font-semibold">Approve Order</h1>
        <p className="text-gray-600 text-sm">
          Manage statuses of a single or mass orders.
        </p>

        <div className="divider"></div>

        <div className="flex justify-between items-start gap-4">
          <div className="space-y-2">
            <div className="join w-[500px]">
              <input
                type="text"
                className="input input-xs join-item focus:outline-0"
                placeholder="Search Store"
                value={searchQuery}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                className="btn btn-primary btn-xs join-item"
                onClick={(e) => loadOrders(filterStatus)}
              >
                Search
              </button>
            </div>

            <form className="filter">
              <input
                className="btn btn-circle btn-xs"
                type="reset"
                value="×"
                onClick={() => {
                  setFilterStatus("");
                  setQuery(""); // Clear search query when resetting filter
                  setPage(1); // Reset to the first page when resetting filter
                }}
              />
              {["APPROVED", "PENDING", "CANCELLED"].map((status) => (
                <input
                  key={status}
                  className={`btn btn-xs rounded-full ${
                    status == filterStatus ? "btn-primary" : "btn-outline"
                  }`}
                  type="radio"
                  name="frameworks"
                  aria-label={`Show ${status}`}
                  onClick={() => {
                    setFilterStatus(status);
                    setPage(1); // Reset page when changing filter
                  }}
                />
              ))}
            </form>
          </div>

          <div className="join">
            {["APPROVED", "PENDING", "CANCELLED"].map((action) => (
              <button
                key={action}
                className="btn btn-xs btn-outline btn-primary join-item"
                onClick={() => massActionSelected(action)}
                disabled={selectedOrders.size === 0}
              >
                Set {action}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="w-full flex justify-center">
            <div className="loading loading-spinner"></div>
          </div>
        ) : (
          <table className="table table-xs my-4">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={isAllSelected}
                    onChange={handleSelectAllChange}
                  />
                </th>
                <th>ID</th>
                <th>STORE</th>
                <th>LOCATION</th>
                <th>CUSTOMER NAME</th>
                <th>CONTACT PERSON</th>
                <th>DELIVERY DATE</th>
                <th>RECEIVING TIME</th>
                <th>STATUS</th>
                <th>CREATED AT</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="11" className="text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-base-300">
                    <td>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={selectedOrders.has(order.id)}
                        onChange={(e) => handleSelectChange(e, order.id)}
                      />
                    </td>
                    <th>{order.id}</th>
                    <td>{order.store_name}</td>
                    <td>{order.location}</td>
                    <td>{order.customer_name}</td>
                    <td>{order.contact_person}</td>
                    <td>{order.delivery_date}</td>
                    <td>{order.receiving_time}</td>
                    <td>
                      <p
                        className={`font-semibold ${
                          order.status === "APPROVED"
                            ? "text-success"
                            : order.status === "CANCELLED"
                            ? "text-danger"
                            : "text-warning"
                        }`}
                      >
                        {order.status}
                      </p>
                    </td>
                    <td>
                      {new Date(order.created_at).toISOString().split("T")[0]}
                    </td>
                    <td>
                      <div className="dropdown dropdown-left">
                        <div
                          tabIndex={0}
                          role="button"
                          className="btn btn-xs btn-ghost"
                        >
                          <Ellipsis size={14} />
                        </div>
                        <ul className="dropdown-content menu-sm menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                          {["APPROVED", "PENDING", "CANCELLED"].map(
                            (action) => (
                              <li key={action}>
                                <button
                                  className={`text-${action.toLowerCase()}`}
                                  onClick={() =>
                                    handleDropdownAction(action, order.id)
                                  }
                                >
                                  {action === "APPROVED" && <Check size={14} />}
                                  {action === "PENDING" && (
                                    <Hourglass size={14} />
                                  )}
                                  {action === "CANCELLED" && <X size={14} />}
                                  Set to {action}
                                </button>
                              </li>
                            )
                          )}

                          <li>
                            <Link
                              to={`/master/db/${order.id}`}
                              className="btn-sm"
                            >
                              <Eye size={14} /> See more
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-4">
        <div className="join">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="join-item btn btn-xs"
            disabled={page === 1}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`join-item btn btn-xs ${
                page === index + 1 ? "btn-active" : ""
              }`}
              onClick={() => setPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            className="join-item btn btn-xs"
            disabled={page === totalPages || totalPages === 0}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
