import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./Welcome";
import CustomerInfo from "./CustomerInfo";
import ChooseProduct from "./ChooseProduct";
import Checkout from "./Checkout";
import Done from "./Done";
import MasterDB from "./MasterDB";
import OrderDetail from "./OrderDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/customer-info" element={<CustomerInfo />} />
        <Route path="/choose-product" element={<ChooseProduct />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/done" element={<Done />} />
        <Route path="/master/db" element={<MasterDB />} />
        <Route path="/master/db/:id" element={<OrderDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
