import useCustomerStore from "./stores/customerStore";
import useCartStore from "./stores/cartStore";
import { supabase } from "./supabase";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const customerInfo = useCustomerStore((state) => state.customerInfo);
  const clearCustomer = useCustomerStore((state) => state.clearCustomerInfo);

  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);

  const navigate = useNavigate();

  // -------------------------------------------------
  // GOOGLE FORM SUBMIT FUNCTION
  // -------------------------------------------------
  async function submitGoogleForm(orderId) {
    const formURL =
      "https://docs.google.com/forms/d/e/1FAIpQLSd-j52TasgiUIA3eFpFvibQn0LlbTHVgv-kQlOkTkZ1mGxTGg/formResponse";

    const form = new FormData();
    form.append("entry.1223351316", orderId); // Order ID field in Google Form

    await fetch(formURL, {
      method: "POST",
      mode: "no-cors", // required due to Google Forms CORS restrictions
      body: form,
    });

    console.log("Google Form submitted with Order ID:", orderId);
  }

  // -------------------------------------------------
  // CONFIRM ORDER (SUPABASE + GOOGLE FORM + REDIRECT)
  // -------------------------------------------------
  async function handleConfirm() {
    const customerInfoData = useCustomerStore.getState().customerInfo;

    // Insert into Supabase
    const { data, error } = await supabase
      .from("customer_data")
      .insert([
        {
          store_name: customerInfoData.storeName,
          location: customerInfoData.location,
          customer_name: customerInfoData.customerName,
          contact_person: customerInfoData.contactPerson,
          delivery_date: customerInfoData.deliveryDate,
          remarks: customerInfoData.remarks,
          orders: JSON.stringify(cart),
        },
      ])
      .select(); // ensures we get the inserted row back

    if (error) {
      console.error("Error inserting data:", error);
      alert("Something went wrong.");
      return;
    }

    // Get inserted ID
    const insertedId = data[0].id;
    console.log("Inserted ID:", insertedId);

    // 1️⃣ Submit the ID to Google Form
    await submitGoogleForm(insertedId);

    // 2️⃣ Clear Zustand stores
    clearCart();
    clearCustomer();

    // 3️⃣ Navigate to success page
    navigate("/done");
  }

  return (
    <section className="p-4">
      <div className="max-w-[1000px] mx-auto">
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
            <strong>Remarks:</strong> {customerInfo.remarks}
          </div>
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
                  <span>{item.item}</span>
                  <span>Qty: {item.qty}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CONFIRM ORDER */}
        <button onClick={handleConfirm} className="btn btn-primary w-full">
          Confirm Order
        </button>
      </div>
    </section>
  );
}
