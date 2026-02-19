// ProductCard.jsx
import { memo, useState } from "react";
import { Plus } from "lucide-react";

function ProductCard({
  product,
  qty,
  option,
  handleQtyChange,
  handleOptionChange,
  handleAdd,
  role,
}) {
  const [imgError, setImgError] = useState(false);
  const selectedOption = option[product.uid] || "bdl";

  return (
    <div className="card card-sm bg-base-100 w-64 shadow-sm">
      <figure className="w-full h-64 bg-gray-100 flex items-center justify-center overflow-hidden">
        {!imgError ? (
          <img
            src={`https://drive.google.com/thumbnail?id=${product.id}&sz=w400`}
            alt={product.item}
            className="w-full h-full object-contain"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="text-gray-400 text-sm text-center px-2">
            No Image Available
          </div>
        )}
      </figure>

      <div className="card-body">
        <h2 className="card-title">{product.item}</h2>

        <p className="text-sm text-gray-600">
          Bdl {product.bdl} pc/s | Size: {product.packsize}
        </p>
        <p className="text-sm">Bdl Price: ₱{product.packPrize}</p>
        <p className="text-sm">Case Price: ₱{product.casePrice}</p>

        <div className="mt-2 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span>Buy:</span>
            <select
              className="select select-sm"
              value={selectedOption}
              onChange={(e) => handleOptionChange(product.uid, e.target.value)}
            >
              <option value="bdl">Bundle</option>
              <option value="case">Case</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span>QTY:</span>
            <input
              type="number"
              min="1"
              className="input input-sm w-20"
              value={qty[product.uid] || ""}
              onChange={(e) => handleQtyChange(product.uid, e.target.value)}
            />
          </div>
        </div>

        <div className="card-actions justify-end">
          <button
            className={`btn btn-primary btn-sm w-full ${
              ["accounting", "admin"].includes(role) ? "btn-disabled" : ""
            }`}
            onClick={() => handleAdd(product)}
            disabled={["accounting", "admin"].includes(role)}
          >
            <Plus size={16} /> Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(ProductCard);
