"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabase";
import { Check, Ellipsis, Eye, Hourglass, X } from "lucide-react";
import ApproveModal from "./ApproveModal";
import { Link } from "react-router-dom";
import { convertTo12HourFormat } from "./utils/time";

export default function ApproveOrder() {
  const [queryState, setQueryState] = useState({
    searchQuery: "",
    filterStatus: "",
    page: 1,
  });
  const [ordersData, setOrdersData] = useState({
    orders: [],
    totalPages: 1,
    loading: true,
    errorMsg: "",
  });
  const [selectedOrders, setSelectedOrders] = useState(new Set());
  const [modalMessage, setModalMessage] = useState("");
  const [modalAction, setModalAction] = useState("");

  const pageSize = 10;

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(
    queryState.searchQuery,
  );

  useEffect(() => {
    const handler = setTimeout(
      () => setDebouncedSearch(queryState.searchQuery),
      300,
    );
    return () => clearTimeout(handler);
  }, [queryState.searchQuery]);

  const loadOrders = useCallback(async () => {
    const offset = (queryState.page - 1) * pageSize;
    setOrdersData((prev) => ({ ...prev, loading: true }));

    let query = supabase
      .from("customer_with_user")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (queryState.filterStatus)
      query = query.eq("status", queryState.filterStatus);
    if (debouncedSearch.trim())
      query = query.ilike("store_name", `%${debouncedSearch}%`);

    const { data, error, count } = await query;

    if (error) {
      setOrdersData({
        orders: [],
        totalPages: 1,
        loading: false,
        errorMsg: "Unable to fetch orders.",
      });
    } else {
      console.log(data);
      setOrdersData({
        orders: data,
        totalPages: Math.ceil(count / pageSize) || 1,
        loading: false,
        errorMsg: "",
      });
    }
  }, [queryState.page, queryState.filterStatus, debouncedSearch]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleSelectAllChange = (event) => {
    setSelectedOrders(
      event.target.checked
        ? new Set(ordersData.orders.map((order) => order.id))
        : new Set(),
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

    const approvedOrders = Array.from(selectedOrders);

    setOrdersData((prev) => ({ ...prev, loading: true }));

    try {
      // Update the status in Supabase for only approved orders
      const { error } = await supabase
        .from("customer_data")
        .update({ status: action })
        .in("id", selectedOrders);

      if (error) throw error;

      if (approvedOrders.length != 0 && action.toUpperCase() == "APPROVED") {
        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbz65FZhY4OFYC_xeFYv3Dyj5jXieKGMZiw_wdI2qKOoj2lZuGBEwVeNh0VVybtEAoU4/exec",
          {
            method: "POST",
            headers: {
              "Content-Type": "text/plain",
            },
            body: JSON.stringify({
              orderIds: approvedOrders, // Send only approved orders to doPost
            }),
          },
        );

        const result = await response.json();
        if (result.error) {
          throw new Error(result.error);
        }
      }

      // Send approved order IDs to doPost for email notifications
      setSelectedOrders(new Set());
      loadOrders();
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
    ordersData.orders.length > 0 &&
    ordersData.orders.length === selectedOrders.size;

  if (ordersData.errorMsg)
    return <div className="p-4 text-red-500">{ordersData.errorMsg}</div>;

  return (
    <section className="p-4 flex flex-col h-full">
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
                value={queryState.searchQuery}
                onChange={(e) =>
                  setQueryState((prev) => ({
                    ...prev,
                    searchQuery: e.target.value,
                    page: 1,
                  }))
                }
              />
              <button
                className="btn btn-primary btn-xs join-item"
                onClick={() => loadOrders()}
              >
                Search
              </button>
            </div>

            <form className="filter">
              <input
                className="btn btn-circle btn-xs"
                type="reset"
                value="×"
                onClick={() =>
                  setQueryState({ searchQuery: "", filterStatus: "", page: 1 })
                }
              />
              {["APPROVED", "PENDING", "CANCELLED"].map((status) => (
                <input
                  key={status}
                  className={`btn btn-xs rounded-full ${
                    status === queryState.filterStatus
                      ? "btn-primary"
                      : "btn-outline"
                  }`}
                  type="radio"
                  name="frameworks"
                  aria-label={`Show ${status}`}
                  onClick={() =>
                    setQueryState((prev) => ({
                      ...prev,
                      filterStatus: status,
                      page: 1,
                    }))
                  }
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

      <div className="overflow-x-auto flex-1">
        {ordersData.loading ? (
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
                <th>AGENT</th>
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
              {ordersData.orders.length === 0 ? (
                <tr>
                  <td colSpan="11" className="text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                ordersData.orders.map((order) => (
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
                    <td>{order.raw_user_meta_data?.name}</td>
                    <td>{order.location}</td>
                    <td>{order.customer_name}</td>
                    <td>{order.contact_person}</td>
                    <td>{order.delivery_date}</td>
                    <td>{convertTo12HourFormat(order.receiving_time)}</td>
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
                            ),
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
            onClick={() =>
              setQueryState((prev) => ({
                ...prev,
                page: Math.max(prev.page - 1, 1),
              }))
            }
            className="join-item btn btn-xs"
            disabled={queryState.page === 1}
          >
            Previous
          </button>

          {Array.from({ length: ordersData.totalPages }, (_, i) => (
            <button
              key={i}
              className={`join-item btn btn-xs ${
                queryState.page === i + 1 ? "btn-active" : ""
              }`}
              onClick={() =>
                setQueryState((prev) => ({ ...prev, page: i + 1 }))
              }
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setQueryState((prev) => ({
                ...prev,
                page: Math.min(prev.page + 1, ordersData.totalPages),
              }))
            }
            className="join-item btn btn-xs"
            disabled={
              queryState.page === ordersData.totalPages ||
              ordersData.totalPages === 0
            }
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
