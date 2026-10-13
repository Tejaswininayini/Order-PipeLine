# Order Pipeline Dashboard

React + Vite frontend for the Microservices Order Processing System.

## Pages
- Products: product list from inventory service (mock data if service is down)
- Orders: create an order and track its status timeline (CREATED, PAID, INVENTORY_RESERVED, COMPLETED, FAILED)
- Chaos: service health and buttons to kill Payment / Inventory service
- Login: placeholder

## Run
    cd dashboard
    npm install
    npm run dev

Open http://localhost:5173

## Services and ports
| Service   | Port | Endpoints used                       |
|-----------|------|--------------------------------------|
| order     | 8081 | POST /api/orders, GET /api/orders    |
| payment   | 8082 | POST /api/payments                   |
| inventory | 8083 | GET /api/products                    |

API base URLs are in src/api/services.js.

## Notes
- If a service is not reachable, pages show mock/local data with a warning.
- Backend services must allow CORS for http://localhost:5173.
- Chaos page uses /actuator/health and /actuator/shutdown (Spring Actuator must be enabled).
