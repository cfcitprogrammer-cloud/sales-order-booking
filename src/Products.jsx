// Products.tsx
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import useCartStore from "./stores/cartStore"; // Import the zustand store
import useCustomerStore from "./stores/customerStore";
import products from "./data/products-new.json"; // Your product list
import { useNavigate } from "react-router-dom";
import CustomerInfoModal from "./CustomerInfoModal"; // Import the modal for customer info

export default function Products() {
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const cart = useCartStore((state) => state.cart);

  const [qty, setQty] = useState({});
  const [option, setOption] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [openCartModal, setOpenCartModal] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false); // State to manage customer info modal

  // Filter products based on search query
  const filteredProducts = products.filter((product) =>
    product.item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleQtyChange = (uid, value) => {
    setQty((prev) => ({
      ...prev,
      [uid]: value,
    }));
  };

  const handleOptionChange = (uid, value) => {
    setOption((prev) => ({
      ...prev,
      [uid]: value,
    }));
  };

  const handleAdd = (product) => {
    const selectedOption = option[product.uid] || "pack";
    const quantity = qty[product.uid] ? qty[product.uid] : 1;

    addToCart({
      id: product.uid,
      item: product.item,
      option: selectedOption,
      qty: Number(quantity),
      packPrice: product.packPrize,
      casePrice: product.casePrice,
      packSize: product.packsize,
      packing: product.packing,
    });

    alert("Added to cart!");
  };

  const clearCustomer = useCustomerStore((state) => state.clearCustomerInfo);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    clearCart();
    clearCustomer();
  }, []);

  return (
    <section className="px-4">
      <div className="max-w-screen-xl mx-auto space-y-4">
        <div className="sticky top-0 bg-white py-4 z-4 border-b border-gray-200 space-y-4">
          <div
            tabIndex={0}
            className={`collapse collapse-sm collapse-arrow bg-base-100 border-base-300 border`}
          >
            <div className="collapse-title font-semibold">
              <h1 className="text-2xl font-semibold">Products</h1>
            </div>
            <div className="collapse-content text-sm">
              <div>
                <input
                  type="text"
                  className="input input-sm w-full"
                  placeholder="Search Product Title"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} // Update search query
                />

                {/* View Cart Button */}
                <div className="mt-4 flex flex-wrap gap-4 justify-start">
                  <button
                    className="btn btn-secondary w-full sm:w-auto"
                    onClick={() => setIsCustomerModalOpen(true)} // Open the customer modal on click
                  >
                    Proceed to Checkout
                  </button>
                  <button
                    className="btn btn-accent w-full sm:w-auto"
                    onClick={() => setOpenCartModal(true)} // Open cart modal
                  >
                    View Cart ({cart.length})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              const selectedOption = option[product.uid] || "pack";

              return (
                <div
                  key={product.uid}
                  className="card card-sm bg-base-100 w-64 shadow-sm"
                >
                  <figure>
                    <iframe
                      src={`https://drive.google.com/file/d/${product.id}/preview`}
                      className="w-full h-64"
                      allow="autoplay"
                    ></iframe>
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title">{product.item}</h2>
                    <p className="text-sm text-gray-600">
                      Pack: {product.packing} pcs | Size: {product.packsize}
                    </p>
                    <p className="text-sm">Pack Price: ₱{product.packPrize}</p>
                    <p className="text-sm">Case Price: ₱{product.casePrice}</p>

                    {/* Select option and quantity inputs */}
                    <div className="mt-2 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span>Buy:</span>
                        <select
                          className="select select-sm"
                          value={selectedOption}
                          onChange={(e) =>
                            handleOptionChange(product.uid, e.target.value)
                          }
                        >
                          <option value="pack">Pack</option>
                          <option value="case">Case</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <span>QTY:</span>
                        <input
                          type="number"
                          min="1"
                          defaultValue={"1"}
                          className="input input-sm w-20"
                          value={qty[product.uid]}
                          onChange={(e) =>
                            handleQtyChange(product.uid, e.target.value)
                          }
                        />
                      </div>
                    </div>

                    {/* Add to Cart button */}
                    <div className="card-actions justify-end">
                      <button
                        className="btn btn-primary btn-sm w-full"
                        onClick={() => handleAdd(product)}
                      >
                        <Plus /> Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
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

        {/* CUSTOMER INFO MODAL */}
        <CustomerInfoModal
          isOpen={isCustomerModalOpen} // Pass the modal open state
          onClose={() => setIsCustomerModalOpen(false)} // Close modal on close
        />
      </div>
    </section>
  );
}
