import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Chaos from "./pages/Chaos";

export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Products</Link>
        <Link to="/orders">Orders</Link>
        <Link to="/chaos">Chaos</Link>
        <Link to="/login">Login</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/chaos" element={<Chaos />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
