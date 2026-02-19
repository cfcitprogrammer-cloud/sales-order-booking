// Products.jsx
import { useState, useEffect, useMemo, useCallback } from "react";
import useCartStore from "./stores/cartStore";
import useCustomerStore from "./stores/customerStore";
import products from "./data/products-new.json";
import CustomerInfoModal from "./CustomerInfoModal";
import useAuthStore from "./stores/authStore";
import ProductCard from "./ProductCard";

export default function Products() {
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  // ✅ Only subscribe to cart length (prevents full page re-render)
  const cartLength = useCartStore((state) => state.cart.length);
  const cart = useCartStore((state) => state.cart);

  const clearCustomer = useCustomerStore((state) => state.clearCustomerInfo);

  const { role } = useAuthStore();

  const [qty, setQty] = useState({});
  const [option, setOption] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [openCartModal, setOpenCartModal] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  // ✅ Memoized filtering
  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.item.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  // ✅ Memoized handlers
  const handleQtyChange = useCallback((uid, value) => {
    setQty((prev) => ({
      ...prev,
      [uid]: Number(value),
    }));
  }, []);

  const handleOptionChange = useCallback((uid, value) => {
    setOption((prev) => ({
      ...prev,
      [uid]: value,
    }));
  }, []);

  const handleAdd = useCallback(
    (product) => {
      const selectedOption = option[product.uid] || "bdl";
      const quantity = qty[product.uid] || 1;

      addToCart({
        id: product.uid,
        item: product.item,
        option: selectedOption,
        qty: quantity,
        packPrice: product.packPrize,
        casePrice: product.casePrice,
        packSize: product.packsize,
        packing: product.bdl,
      });

      alert("Added to cart!");
    },
    [qty, option, addToCart],
  );

  useEffect(() => {
    clearCustomer();
  }, []);

  return (
    <section className="px-4">
      <div className="max-w-screen-xl mx-auto space-y-4">
        <div className="sticky top-0 bg-white py-4 z-4 border-b border-gray-200 space-y-4">
          <h1 className="text-2xl font-semibold">Products</h1>

          <input
            type="text"
            className="input input-sm w-full"
            placeholder="Search Product Title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="mt-4 flex flex-wrap gap-4 justify-start">
            <button
              className={`btn btn-secondary ${
                ["accounting", "admin"].includes(role) ? "btn-disabled" : ""
              }`}
              onClick={() => setIsCustomerModalOpen(true)}
              disabled={["accounting", "admin"].includes(role)}
            >
              Proceed to Checkout
            </button>

            <button
              className="btn btn-accent"
              onClick={() => setOpenCartModal(true)}
            >
              View Cart ({cartLength})
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.uid}
                product={product}
                qty={qty}
                option={option}
                handleQtyChange={handleQtyChange}
                handleOptionChange={handleOptionChange}
                handleAdd={handleAdd}
                role={role}
              />
            ))
          ) : (
            <p className="text-center text-gray-500">No products found.</p>
          )}
        </div>

        {/* CART MODAL */}
        {openCartModal && (
          <dialog className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">Cart Items</h3>

              {cart.length === 0 ? (
                <p className="text-gray-500">Your cart is empty.</p>
              ) : (
                <ul className="space-y-3">
                  {cart.map((item) => (
                    <li
                      key={item.cartId}
                      className="flex justify-between items-center border p-2 rounded"
                    >
                      <div>
                        <p className="font-semibold">{item.item}</p>
                        <p className="text-sm text-gray-600">
                          {item.option.toUpperCase()} × {item.qty}
                        </p>
                      </div>

                      <button
                        className="btn btn-error btn-sm"
                        onClick={() => removeFromCart(item.cartId)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="modal-action">
                <button className="btn" onClick={() => setOpenCartModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </dialog>
        )}

        <CustomerInfoModal
          isOpen={isCustomerModalOpen}
          onClose={() => setIsCustomerModalOpen(false)}
        />
      </div>
    </section>
  );
}
