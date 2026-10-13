import { useEffect, useState } from "react";
import axios from "axios";

const SERVICES = [
  { name: "Order Service", url: "http://localhost:8081", killable: false },
  { name: "Payment Service", url: "http://localhost:8082", killable: true },
  { name: "Inventory Service", url: "http://localhost:8083", killable: true },
];

export default function Chaos() {
  const [health, setHealth] = useState({});
  const [log, setLog] = useState([]);

  const check = async () => {
    const result = {};
    for (const s of SERVICES) {
      try {
        await axios.get(s.url + "/actuator/health", { timeout: 2000 });
        result[s.name] = "UP";
      } catch {
        result[s.name] = "DOWN";
      }
    }
    setHealth(result);
  };

  useEffect(() => {
    check();
    const t = setInterval(check, 5000);
    return () => clearInterval(t);
  }, []);

  const addLog = (text) => setLog((prev) => [new Date().toLocaleTimeString() + " - " + text, ...prev]);

  const kill = async (s) => {
    try {
      await axios.post(s.url + "/actuator/shutdown", null, { timeout: 3000 });
      addLog(s.name + " shutdown requested");
    } catch {
      addLog("Could not reach " + s.name + " (already down or shutdown endpoint not enabled)");
    }
    setTimeout(check, 1500);
  };

  return (
    <div className="page">
      <h2>Chaos Panel</h2>
      <div className="card">
        <h3>Service Health</h3>
        <ul>
          {SERVICES.map((s) => (
            <li key={s.name}>
              {s.name} (port {s.url.slice(-4)}):{" "}
              <span className={health[s.name] === "UP" ? "up" : "down"}>{health[s.name] || "..."}</span>
            </li>
          ))}
        </ul>
        <button onClick={check}>Refresh</button>
      </div>
      <div className="card">
        <h3>Kill a service</h3>
        {SERVICES.filter((s) => s.killable).map((s) => (
          <button key={s.name} className="danger" onClick={() => kill(s)}>
            Kill {s.name}
          </button>
        ))}
      </div>
      <div className="card">
        <h3>Log</h3>
        <ul>
          {log.map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
