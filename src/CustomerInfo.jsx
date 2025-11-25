import useCustomerStore from "./stores/customerStore";
import { useNavigate } from "react-router-dom";

export default function CustomerInfo() {
  const { customerInfo, setCustomerInfo } = useCustomerStore();
  const navigate = useNavigate();

  // Check all fields are filled (attachment included)
  const allFilled =
    customerInfo.storeName &&
    customerInfo.location &&
    customerInfo.customerName &&
    customerInfo.contactPerson &&
    customerInfo.deliveryDate &&
    customerInfo.receivingTime;
  // customerInfo.remarks;
  // customerInfo.attachment; // NEW

  // Handle file upload
  const handleAttachment = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCustomerInfo("attachment", file);
    }
  };

  return (
    <section className="p-4">
      <div className="my-4 max-w-[1000px] mx-auto">
        <h1 className="text-2xl font-semibold mb-4">
          Enter Customer Information
        </h1>

        <legend className="fieldset-legend">STORE NAME</legend>
        <input
          type="text"
          className="input w-full"
          placeholder="Type here"
          value={customerInfo.storeName}
          onChange={(e) => setCustomerInfo("storeName", e.target.value)}
        />

        <legend className="fieldset-legend">LOCATION</legend>
        <input
          type="text"
          className="input w-full"
          placeholder="Type here"
          value={customerInfo.location}
          onChange={(e) => setCustomerInfo("location", e.target.value)}
        />

        <legend className="fieldset-legend">CUSTOMER NAME</legend>
        <input
          type="text"
          className="input w-full"
          placeholder="Type here"
          value={customerInfo.customerName}
          onChange={(e) => setCustomerInfo("customerName", e.target.value)}
        />

        <legend className="fieldset-legend">CONTACT PERSON</legend>
        <input
          type="text"
          className="input w-full"
          placeholder="Type here"
          value={customerInfo.contactPerson}
          onChange={(e) => setCustomerInfo("contactPerson", e.target.value)}
        />

        <legend className="fieldset-legend">DELIVERY DATE</legend>
        <input
          type="date"
          className="input w-full"
          value={customerInfo.deliveryDate}
          onChange={(e) => setCustomerInfo("deliveryDate", e.target.value)}
        />

        <legend className="fieldset-legend">RECEIVING TIME</legend>
        <input
          type="time"
          className="input w-full"
          placeholder="Type here"
          value={customerInfo.receivingTime}
          onChange={(e) => setCustomerInfo("receivingTime", e.target.value)}
        />

        <legend className="fieldset-legend">REMARKS</legend>
        <textarea
          className="textarea w-full"
          placeholder="Details / Notes"
          value={customerInfo.remarks}
          onChange={(e) => setCustomerInfo("remarks", e.target.value)}
        />

        {/* NEW ATTACHMENT FIELD */}
        <legend className="fieldset-legend">ATTACHMENT (Picture)</legend>
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

        <button
          className="btn btn-secondary my-4 w-full"
          disabled={!allFilled}
          onClick={() => {
            if (allFilled) navigate("/choose-product");
          }}
        >
          Proceed to Choose Product
        </button>
      </div>
    </section>
  );
}
