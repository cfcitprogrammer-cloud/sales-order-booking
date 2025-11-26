import useCustomerStore from "./stores/customerStore";
import useCartStore from "./stores/cartStore";
import { supabase } from "./supabase";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Checkout() {
  const customerInfo = useCustomerStore((state) => state.customerInfo);
  const clearCustomer = useCustomerStore((state) => state.clearCustomerInfo);

  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  // -------------------------------------------------
  // UPLOAD IMAGE TO SUPABASE STORAGE
  // -------------------------------------------------
  async function uploadImage(file) {
    if (!file) return null;

    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}.${ext}`;
    const filePath = `attachments/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("sbof")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Image upload failed:", uploadError);
      return null;
    }

    const { data } = supabase.storage.from("sbof").getPublicUrl(filePath);
    return data.publicUrl;
  }

  // -------------------------------------------------
  // GOOGLE FORM SUBMIT FUNCTION
  // -------------------------------------------------
  async function submitGoogleForm(orderId) {
    const formURL =
      "https://docs.google.com/forms/d/e/1FAIpQLSd-j52TasgiUIA3eFpFvibQn0LlbTHVgv-kQlOkTkZ1mGxTGg/formResponse";

    const form = new FormData();
    form.append("entry.1223351316", orderId);

    await fetch(formURL, {
      method: "POST",
      mode: "no-cors",
      body: form,
    });
  }

  // -------------------------------------------------
  // CALCULATE GRAND TOTAL
  // -------------------------------------------------
  const grandTotal = cart.reduce((total, item) => {
    const price =
      item.option === "pack" ? Number(item.packPrice) : Number(item.casePrice);
    return total + price * item.qty;
  }, 0);

  // -------------------------------------------------
  // CONFIRM ORDER
  // -------------------------------------------------
  async function handleConfirm() {
    if (isLoading) return;
    setIsLoading(true);

    const info = useCustomerStore.getState().customerInfo;

    // Upload attachment if exists
    const imageUrl = await uploadImage(info.attachment);

    // Insert into Supabase DB
    const { data, error } = await supabase
      .from("customer_data")
      .insert([
        {
          store_name: info.storeName,
          location: info.location,
          customer_name: info.customerName,
          contact_person: info.contactPerson,
          delivery_date: info.deliveryDate,
          receiving_time: info.receivingTime,
          remarks: info.remarks,
          attachment: imageUrl,
          orders: JSON.stringify(cart),
        },
      ])
      .select();

    if (error) {
      console.error("Error inserting data:", error);
      alert("Something went wrong.");
      setIsLoading(false);
      return;
    }

    const insertedId = data[0].id;

    // Submit ID to Google Form
    await submitGoogleForm(insertedId);

    // Clear Zustand stores
    clearCart();
    clearCustomer();

    // Redirect
    navigate("/products/done");
  }

  return (
    <section className="p-4">
      <div className="max-w-[1000px] mx-auto">
        {/* BACK BUTTON */}
        <button className="btn btn-outline mb-4" onClick={() => navigate(-1)}>
          ⬅ Back
        </button>

        <h1 className="text-3xl font-bold mb-4">Checkout</h1>

        {/* CUSTOMER INFO */}
        <div className="p-4 border rounded mb-6">
          <h2 className="text-xl font-semibold mb-2">Customer Information</h2>

          <div>
            <strong>Store Name:</strong> {customerInfo.storeName}
          </div>
          <div>
            <strong>Location:</strong> {customerInfo.location}
          </div>
          <div>
            <strong>Customer Name:</strong> {customerInfo.customerName}
          </div>
          <div>
            <strong>Contact Person:</strong> {customerInfo.contactPerson}
          </div>
          <div>
            <strong>Delivery Date:</strong> {customerInfo.deliveryDate}
          </div>
          <div>
            <strong>Receiving Time:</strong> {customerInfo.receivingTime}
          </div>
          <div>
            <strong>Remarks:</strong> {customerInfo.remarks}
          </div>

          {customerInfo.attachment && (
            <div className="mt-3">
              <strong>Attachment:</strong>
              <img
                src={URL.createObjectURL(customerInfo.attachment)}
                alt="Attachment Preview"
                className="w-40 h-40 object-cover border mt-2"
              />
            </div>
          )}
        </div>

        {/* CART ITEMS */}
        <div className="p-4 border rounded mb-6">
          <h2 className="text-xl font-semibold mb-2">Products</h2>

          {cart.length === 0 ? (
            <div>No items added.</div>
          ) : (
            <div className="space-y-2">
              {cart.map((item, index) => (
                <div key={index} className="flex justify-between border-b pb-2">
                  <div>
                    {item.item} ({item.option})
                  </div>
                  <div>
                    {item.qty} × ₱
                    {item.option === "pack"
                      ? Number(item.packPrice).toFixed(2)
                      : Number(item.casePrice).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* GRAND TOTAL */}
          <div className="flex justify-between font-semibold text-lg mt-4">
            <span>Grand Total:</span>
            <span>₱{grandTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* CONFIRM ORDER */}
        <button
          onClick={handleConfirm}
          className="btn btn-primary w-full flex items-center justify-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Submitting...
            </>
          ) : (
            "Confirm Order"
          )}
        </button>

        {isLoading && (
          <p className="text-center text-gray-500 mt-2">
            Please wait while we process your order...
          </p>
        )}
      </div>
    </section>
  );
}
