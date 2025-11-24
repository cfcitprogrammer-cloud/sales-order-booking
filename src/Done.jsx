import { useEffect } from "react";
import { Link } from "react-router-dom"; // remove if not using React Router
import useCartStore from "./stores/cartStore";

export default function Done() {
  const cart = useCartStore((state) => state.cart);
  useEffect(() => {
    console.log(cart);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-6">
      <h1 className="text-4xl font-bold mb-4 text-green-600">
        ✔ Order Completed!
      </h1>

      <p className="text-lg mb-6">
        Thank you! The order has been successfully submitted.
      </p>

      <div className="flex gap-4">
        <Link to="/">
          <button className="btn btn-primary">Create New Order</button>
        </Link>
      </div>
    </div>
  );
}
