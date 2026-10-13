import { useEffect, useState } from "react";
import { inventoryApi } from "../api/services";

const mockProducts = [
  { id: 1, name: "Laptop", price: 55000, stock: 10 },
  { id: 2, name: "Mouse", price: 500, stock: 50 },
];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [usingMock, setUsingMock] = useState(false);

  useEffect(() => {
    inventoryApi
      .get("/api/products")
      .then((res) => setProducts(res.data))
      .catch(() => {
        setProducts(mockProducts);
        setUsingMock(true);
      });
  }, []);

  return (
    <div className="page">
      <h2>Products</h2>
      {usingMock && <p className="note">Inventory service (8083) not reachable. Showing mock data.</p>}
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name} - Rs.{p.price} (stock: {p.stock})
          </li>
        ))}
      </ul>
    </div>
  );
}
