import { Link } from "react-router-dom";

import useCustomerStore from "./stores/customerStore";
import useCartStore from "./stores/cartStore";
import { useEffect } from "react";

export default function Welcome() {
  const clearCustomer = useCustomerStore((state) => state.clearCustomerInfo);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    clearCart();
    clearCustomer();
  }, []);

  return (
    <section className="p-4">
      <div className="max-w-[1000px] mx-auto bg-primary text-white p-60 text-center rounded-lg">
        <h1 className="text-4xl font-semibold">Sales Order Booking System</h1>
        <p>Press the button below to get started.</p>
        <Link to={"/customer-info"} className="btn btn-secondary my-4">
          Get Started
        </Link>
      </div>
    </section>
  );
}
