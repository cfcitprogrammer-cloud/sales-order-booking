import { useState } from "react";
import useCartStore from "./stores/cartStore"; // Import the zustand store
import products from "./data/products-new.json"; // Your product list
import { Link } from "react-router-dom";

export default function ChooseProduct() {
  const addToCart = useCartStore((state) => state.addToCart);
  const cart = useCartStore((state) => state.cart); // Get the current cart
  const [qty, setQty] = useState({});
  const [option, setOption] = useState({}); // "pack" or "case" per product

  // Generate a unique ID for each product
  const productList = products.map((p, i) => ({
    ...p,
    uid: `${i}-${p.item.replace(/\s+/g, "-")}`,
  }));

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
    const quantity = selectedOption === "pack" ? qty[product.uid] || 1 : 1;

    addToCart({
      id: product.uid,
      item: product.item,
      option: selectedOption, // "pack" or "case"
      qty: Number(quantity),
      packPrice: product.packPrize,
      casePrice: product.casePrice,
      packSize: product.packsize,
      packing: product.packing,
    });
  };

  return (
    <section className="p-4">
      <div className="grid grid-cols-4 gap-4 max-w-[1000px] mx-auto">
        <div className="col-span-4">
          <Link to="/checkout" className="btn btn-secondary my-4">
            Proceed to Checkout
          </Link>
        </div>

        {productList.map((product) => {
          const selectedOption = option[product.uid] || "pack";

          return (
            <div key={product.uid} className="p-2 border rounded">
              <iframe
                src={`https://drive.google.com/file/d/${product.id}/preview`}
                className="w-full"
                allow="autoplay"
              ></iframe>
              <h1 className="font-semibold mt-2">{product.item}</h1>

              <p className="text-sm text-gray-600">
                Pack: {product.packing} pcs | Size: {product.packsize}
              </p>
              <p className="text-sm">Pack Price: ₱{product.packPrize}</p>
              <p className="text-sm">Case Price: ₱{product.casePrice}</p>

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

                {selectedOption === "pack" && (
                  <div className="flex items-center gap-2">
                    <span>QTY:</span>
                    <input
                      type="number"
                      min="1"
                      className="input input-sm w-20"
                      value={qty[product.uid] || 1}
                      onChange={(e) =>
                        handleQtyChange(product.uid, e.target.value)
                      }
                    />
                  </div>
                )}

                <button
                  className="btn btn-primary btn-sm mt-2"
                  onClick={() => handleAdd(product)}
                >
                  ADD
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
