import { useEffect, useState } from "react";
import { Package, RefreshCw, PlusCircle, Activity, User, Settings as SettingsIcon, LogOut, CheckCircle, Sliders } from "lucide-react";
import "./App.css";

const API = "http://localhost:8081/api/orders";

function App() {
  // Authentication & Navigation State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("orderflow_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard' | 'profile' | 'settings'

  // Form State for Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Profile State
  const [profileName, setProfileName] = useState(user?.name || "Admin User");
  const [profileSaved, setProfileSaved] = useState(false);

  // Settings State
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("orderflow_settings");
    return saved ? JSON.parse(saved) : { emailNotifications: true, autoRefresh: false };
  });

  // Orders State
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    productName: "Laptop",
    quantity: 1,
    amount: 55000,
  });

  // Login Handler
  function handleLogin(e) {
    e.preventDefault();
    if (loginEmail && loginPassword) {
      const userData = {
        name: "Admin User",
        email: loginEmail,
        role: "Microservices Administrator"
      };
      setUser(userData);
      localStorage.setItem("orderflow_user", JSON.stringify(userData));
      setProfileName(userData.name);
    }
  }

  // Logout Handler
  function handleLogout() {
    setUser(null);
    localStorage.removeItem("orderflow_user");
    setActiveTab("dashboard");
  }

  // Save Profile Handler
  function handleSaveProfile(e) {
    e.preventDefault();
    const updated = { ...user, name: profileName };
    setUser(updated);
    localStorage.setItem("orderflow_user", JSON.stringify(updated));
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  }

  // Save Settings Handler
  function handleToggleSetting(key) {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    localStorage.setItem("orderflow_settings", JSON.stringify(updated));
  }

  // API Call: Fetch Orders
  async function loadOrders() {
    setLoading(true);
    try {
      const response = await fetch(API);
      if (!response.ok) throw new Error("Could not fetch orders");
      setOrders(await response.json());
      setMessage("");
    } catch (error) {
      setMessage("Backend connect avvaledu. Order service port 8081 lo run avutundo check cheyyi.");
    } finally {
      setLoading(false);
    }
  }

  // API Call: Create Order
  async function createOrder(event) {
    event.preventDefault();
    setMessage("");

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: form.productName,
          quantity: Number(form.quantity),
          amount: Number(form.amount),
        }),
      });

      if (!response.ok) throw new Error("Order creation failed");

      setMessage("Order created successfully!");
      await loadOrders();
    } catch (error) {
      setMessage("Order create avvaledu. Backend logs check cheyyi.");
    }
  }

  // API Call: Update Status
  async function updateStatus(id, status) {
    try {
      const response = await fetch(
        `${API}/${id}/status?status=${encodeURIComponent(status)}`,
        { method: "PUT" }
      );

      if (!response.ok) throw new Error("Status update failed");

      setMessage(`Order #${id} status updated to ${status}`);
      await loadOrders();
    } catch (error) {
      setMessage("Status update failed. API endpoint check cheyyi.");
    }
  }

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  // Optional: Auto Refresh timer based on Settings
  useEffect(() => {
    let interval = null;
    if (user && settings.autoRefresh && activeTab === "dashboard") {
      interval = setInterval(() => {
        loadOrders();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [user, settings.autoRefresh, activeTab]);

  // View 1: Login Screen (Shown when logged out)
  if (!user) {
    return (
      <main className="app" style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <section className="panel" style={{ width: "360px", maxWidth: "90%", padding: "30px", borderRadius: "12px" }}>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <Package size={38} color="#2563eb" style={{ margin: "0 auto 8px" }} />
            <h2 style={{ margin: 0 }}>OrderFlow Login</h2>
            <p style={{ fontSize: "14px", color: "#64748b", marginTop: "4px" }}>Microservices Dashboard Access</p>
          </div>
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "14px", fontWeight: "600" }}>
              Email Address
              <input
                required
                type="email"
                placeholder="admin@orderflow.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "14px", fontWeight: "600" }}>
              Password
              <input
                required
                type="password"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
              />
            </label>
            <button className="primary" type="submit" style={{ padding: "12px", marginTop: "10px", fontWeight: "600" }}>
              Sign In to Pipeline
            </button>
          </form>
        </section>
      </main>
    );
  }

  const totalAmount = orders.reduce(
    (sum, order) => sum + Number(order.amount || 0),
    0
  );

  return (
    <main className="app">
      {/* Top Navbar */}
      <header className="topbar">
        <div className="brand" onClick={() => setActiveTab("dashboard")} style={{ cursor: "pointer" }}>
          <Package size={30} />
          <div>
            <h1>OrderFlow</h1>
            <p>Microservices Management Dashboard</p>
          </div>
        </div>

        {/* Tab Switcher & Logout */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <button
            className="refresh"
            style={{ background: activeTab === "dashboard" ? "#2563eb" : "transparent", color: activeTab === "dashboard" ? "#fff" : "inherit" }}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </button>
          <button
            className="refresh"
            style={{ background: activeTab === "profile" ? "#2563eb" : "transparent", color: activeTab === "profile" ? "#fff" : "inherit" }}
            onClick={() => setActiveTab("profile")}
          >
            <User size={15} /> Profile
          </button>
          <button
            className="refresh"
            style={{ background: activeTab === "settings" ? "#2563eb" : "transparent", color: activeTab === "settings" ? "#fff" : "inherit" }}
            onClick={() => setActiveTab("settings")}
          >
            <SettingsIcon size={15} /> Settings
          </button>
          <button
            className="refresh"
            style={{ background: "#ef4444", color: "#fff", borderColor: "#ef4444" }}
            onClick={handleLogout}
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      </header>

      {/* View 2: Dashboard Content */}
      {activeTab === "dashboard" && (
        <>
          <section className="welcome">
            <div>
              <p className="eyebrow">ORDER PIPELINE</p>
              <h2>Order Management</h2>
              <p>Track orders and monitor their current status.</p>
            </div>
            <Activity size={45} />
          </section>

          {message && <div className="message">{message}</div>}

          <section className="stats">
            <article className="stat-card">
              <span>Total Orders</span>
              <strong>{orders.length}</strong>
            </article>
            <article className="stat-card">
              <span>Created Orders</span>
              <strong>{orders.filter((o) => o.status === "CREATED").length}</strong>
            </article>
            <article className="stat-card">
              <span>Total Order Value</span>
              <strong>₹{totalAmount.toLocaleString("en-IN")}</strong>
            </article>
          </section>

          <section className="panel">
            <h3><PlusCircle size={20} /> Create New Order</h3>
            <form className="order-form" onSubmit={createOrder}>
              <label>
                Product Name
                <input
                  required
                  value={form.productName}
                  onChange={(e) => setForm({ ...form, productName: e.target.value })}
                />
              </label>
              <label>
                Quantity
                <input
                  required
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                />
              </label>
              <label>
                Amount (₹)
                <input
                  required
                  type="number"
                  min="1"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                />
              </label>
              <button className="primary" type="submit">Create Order</button>
            </form>
          </section>

          <section className="panel">
            <div className="table-heading">
              <div>
                <h3>Recent Orders</h3>
                <p>Orders received from your Spring Boot API</p>
              </div>
              <button className="refresh" onClick={loadOrders}>
                <RefreshCw size={15} /> Reload
              </button>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.productName}</td>
                      <td>{order.quantity}</td>
                      <td>₹{Number(order.amount).toLocaleString("en-IN")}</td>
                      <td>
                        <span className={`status ${String(order.status).toLowerCase()}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                        >
                          <option value={order.status}>{order.status}</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {!loading && orders.length === 0 && (
                    <tr>
                      <td colSpan="6">No orders found. Create your first order.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {/* View 3: Profile Content */}
      {activeTab === "profile" && (
        <section className="panel" style={{ maxWidth: "650px", margin: "20px auto", padding: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <User size={24} color="#2563eb" />
            <h3 style={{ margin: 0 }}>User Profile Details</h3>
          </div>
          <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontWeight: "600" }}>
              Full Name
              <input
                required
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontWeight: "600" }}>
              Email Address
              <input
                disabled
                type="text"
                value={user.email}
                style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #e2e8f0", background: "#f8fafc", color: "#64748b" }}
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontWeight: "600" }}>
              Access Role
              <input
                disabled
                type="text"
                value={user.role}
                style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #e2e8f0", background: "#f8fafc", color: "#64748b" }}
              />
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "10px" }}>
              <button className="primary" type="submit" style={{ width: "fit-content" }}>
                Update Profile
              </button>
              {profileSaved && (
                <span style={{ color: "#16a34a", display: "flex", alignItems: "center", gap: "4px", fontSize: "14px" }}>
                  <CheckCircle size={16} /> Saved to LocalStorage!
                </span>
              )}
            </div>
          </form>
        </section>
      )}

      {/* View 4: Settings Content */}
      {activeTab === "settings" && (
        <section className="panel" style={{ maxWidth: "650px", margin: "20px auto", padding: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <Sliders size={24} color="#2563eb" />
            <h3 style={{ margin: 0 }}>System Configuration</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", fontSize: "15px" }}>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={() => handleToggleSetting("emailNotifications")}
                style={{ width: "18px", height: "18px", cursor: "pointer" }}
              />
              <div>
                <strong>Kafka Notification Triggers</strong>
                <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#64748b" }}>Dispatch instant notification events whenever an order status is modified.</p>
              </div>
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", fontSize: "15px" }}>
              <input
                type="checkbox"
                checked={settings.autoRefresh}
                onChange={() => handleToggleSetting("autoRefresh")}
                style={{ width: "18px", height: "18px", cursor: "pointer" }}
              />
              <div>
                <strong>Auto Polling / Refresh</strong>
                <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#64748b" }}>Automatically refresh order metrics and table every 5 seconds.</p>
              </div>
            </label>
          </div>
        </section>
      )}

      <footer>OrderFlow · Spring Boot + React + Kafka</footer>
    </main>
  );
}

export default App;