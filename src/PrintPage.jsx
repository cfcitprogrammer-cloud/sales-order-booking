import { useEffect, useState, useRef } from "react";
import { supabase } from "./supabase";
import { useParams } from "react-router-dom";
import { convertReceiptTime, convertTo12HourFormat } from "./utils/time";
import { useReactToPrint } from "react-to-print";

export default function PrintPage() {
  const [order, setOrder] = useState({});
  const [orderItems, setOrderItems] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState("");

  const { id } = useParams();

  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  useEffect(() => {
    async function loadOrder() {
      const { data, error } = await supabase
        .from("customer_with_user")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        setErrorMsg("Unable to fetch order.");
      } else {
        console.log(data);
        setOrder(data);
        setOrderItems(JSON.parse(data.orders));
      }

      setLoading(false);
    }

    loadOrder();
  }, []);

  return (
    <div className="h-screen flex justify-center items-center bg-slate-300 p-4">
      {loading ? (
        "Loading..."
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white p-6 space-y-4" ref={contentRef}>
            <header className="text-center">
              <h1 className="text-lg font-semibold">
                Sales Order Booking System
              </h1>
              <p className="text-gray-400 text-xs">
                {convertReceiptTime(order.created_at)}
              </p>
            </header>

            <div className="grid grid-cols-2 gap-1 text-sm">
              <strong>Agent</strong>
              <p className="text-gray-600 text-right">
                {order.raw_user_meta_data?.name}
              </p>
              <div className="divider col-span-full m-0"></div>
              <strong>Store</strong>
              <p className="text-gray-600 text-right">{order.store_name}</p>
              <strong>Customer</strong>
              <p className="text-gray-600 text-right">{order.customer_name}</p>
              <strong>Contact Person</strong>
              <p className="text-gray-600 text-right">{order.contact_person}</p>
              <div className="divider col-span-full m-0"></div>
              <strong>Location</strong>
              <p className="text-gray-600 text-right">{order.location}</p>
              <strong>Delivery Date</strong>
              <p className="text-gray-600 text-right">{order.delivery_date}</p>
              <strong>Receiving Time</strong>
              <p className="text-gray-600 text-right">
                {convertTo12HourFormat(order.receiving_time)}
              </p>
              <div className="divider col-span-full m-0"></div>

              <div className="col-span-2">
                <div className="overflow-x-auto">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th className="pl-0">Item</th>
                        <th className="text-right pr-0">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderItems.map((item, index) => (
                        <tr key={index}>
                          <td className="pl-0">
                            <h1>{item.item}</h1>
                            <p>
                              {item.option === "case"
                                ? item.casePrice.toFixed(2)
                                : item.packPrice.toFixed(2)}{" "}
                              x {item.qty} ({item.option})
                            </p>
                          </td>
                          <td className="text-right pr-0">
                            {item.option === "case"
                              ? (item.casePrice * item.qty).toFixed(2)
                              : (item.packPrice * item.qty).toFixed(2)}
                          </td>
                        </tr>
                      ))}

                      {/* Calculate Total */}
                      {(() => {
                        const total = orderItems.reduce((acc, item) => {
                          return (
                            acc +
                            (item.option === "case"
                              ? item.casePrice * item.qty
                              : item.packPrice * item.qty)
                          );
                        }, 0);

                        return (
                          <tr>
                            <td>
                              <strong>TOTAL:</strong>
                            </td>
                            <td className="text-right pr-0">
                              <strong>{total.toFixed(2)}</strong>
                            </td>
                          </tr>
                        );
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="text-xs">
              <strong>Remarks</strong>
              <p className="text-gray-600">
                {order?.remarks?.length > 0 ? order?.remarks : "N/A"}
              </p>
            </div>

            <footer>
              <p className="italic text-gray-400 text-xs text-center">
                This is a system generated file
              </p>
            </footer>
          </div>

          <div className="bg-white h-full p-4">
            <h1 className="font-semibold mb-4">Operations</h1>

            <button className="btn btn-primary w-full" onClick={reactToPrintFn}>
              Print
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
