// CustomerInfoModal.tsx
import { useState } from "react";
import useCustomerStore from "./stores/customerStore"; // Assuming you have a Zustand store for customer info
import { useNavigate } from "react-router-dom";

export default function CustomerInfoModal({ isOpen, onClose }) {
  const { customerInfo, setCustomerInfo } = useCustomerStore();
  const navigate = useNavigate();

  // Check if all fields are filled
  const allFilled =
    customerInfo.storeName &&
    customerInfo.location &&
    customerInfo.customerName &&
    customerInfo.contactPerson &&
    customerInfo.deliveryDate &&
    customerInfo.receivingTime;

  // Handle file upload
  const handleAttachment = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCustomerInfo("attachment", file);
    }
  };

  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <header>
          <h1 className="text-2xl font-semibold">Customer Information</h1>
          <p>Please enter the necessary customer data.</p>
        </header>

        <form>
          <legend>STORE NAME</legend>
          <input
            type="text"
            className="input w-full"
            placeholder="Type here"
            value={customerInfo.storeName}
            onChange={(e) => setCustomerInfo("storeName", e.target.value)}
          />

          <legend>LOCATION</legend>
          <input
            type="text"
            className="input w-full"
            placeholder="Type here"
            value={customerInfo.location}
            onChange={(e) => setCustomerInfo("location", e.target.value)}
          />

          <legend>CUSTOMER NAME</legend>
          <input
            type="text"
            className="input w-full"
            placeholder="Type here"
            value={customerInfo.customerName}
            onChange={(e) => setCustomerInfo("customerName", e.target.value)}
          />

          <legend>CONTACT PERSON</legend>
          <input
            type="text"
            className="input w-full"
            placeholder="Type here"
            value={customerInfo.contactPerson}
            onChange={(e) => setCustomerInfo("contactPerson", e.target.value)}
          />

          <legend>DELIVERY DATE</legend>
          <input
            type="date"
            className="input w-full"
            value={customerInfo.deliveryDate}
            onChange={(e) => setCustomerInfo("deliveryDate", e.target.value)}
          />

          <legend>RECEIVING TIME</legend>
          <input
            type="time"
            className="input w-full"
            placeholder="Type here"
            value={customerInfo.receivingTime}
            onChange={(e) => setCustomerInfo("receivingTime", e.target.value)}
          />

          <legend>REMARKS</legend>
          <textarea
            className="textarea w-full"
            placeholder="Details / Notes"
            value={customerInfo.remarks}
            onChange={(e) => setCustomerInfo("remarks", e.target.value)}
          />

          {/* Attachment field */}
          <legend>ATTACHMENT (Picture)</legend>
          <input
            type="file"
            accept="image/*"
            className="file-input w-full"
            onChange={handleAttachment}
          />

          {/* Preview image if exists */}
          {customerInfo.attachment && (
            <div className="mt-3">
              <p className="font-medium mb-1">Preview:</p>
              <img
                src={URL.createObjectURL(customerInfo.attachment)}
                className="rounded border max-w-xs"
                alt="Attachment preview"
              />
            </div>
          )}
        </form>

        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Close
          </button>
          <button
            className="btn btn-secondary"
            disabled={!allFilled}
            onClick={() => {
              if (allFilled) {
                onClose(); // Close the modal
                navigate("/products/checkout"); // Navigate to checkout page
              }
            }}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
