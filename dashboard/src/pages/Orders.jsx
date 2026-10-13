import { useEffect, useState } from "react";
import { orderApi } from "../api/services";
import StatusTimeline from "../components/StatusTimeline";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [productId, setProductId] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  const loadOrders = () =>
    orderApi
      .get("/api/orders")
      .then((res) => {
        setOrders(res.data);
        setMessage("");
      })
      .catch(() => setMessage("Order service (8081) not reachable. Showing local data only."));

  useEffect(() => {
    loadOrders();
  }, []);

  const createOrder = async (e) => {
    e.preventDefault();
    const payload = { productId: Number(productId), quantity: Number(quantity) };
    try {
      await orderApi.post("/api/orders", payload);
      await loadOrders();
    } catch {
      setOrders((prev) => [{ id: "local-" + Date.now(), ...payload, status: "CREATED" }, ...prev]);
      setMessage("Order service not reachable. Order saved locally (demo only).");
    }
  };

  return (
    <div className="page">
      <h2>Orders</h2>
      {message && <p className="note">{message}</p>}

      <form className="card" onSubmit={createOrder}>
        <h3>Create Order</h3>
        Product ID
        <input type="number" min="1" value={productId} onChange={(e) => setProductId(e.target.value)} />
        Quantity
        <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        <button type="submit">Place Order</button>
      </form>

      {orders.map((o) => (
        <div className="card" key={o.id}>
          <b>Order #{o.id}</b> - Product {o.productId} x {o.quantity}
          <StatusTimeline status={o.status} />
        </div>
      ))}
    </div>
  );
}
