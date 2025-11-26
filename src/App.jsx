import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";

function App() {
  return (
    <BrowserRouter basename="/sales-order-booking">
      <Dashboard />
    </BrowserRouter>
  );
}

export default App;
