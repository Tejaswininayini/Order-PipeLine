import axios from "axios";

export const orderApi = axios.create({ baseURL: "http://localhost:8081", timeout: 4000 });
export const paymentApi = axios.create({ baseURL: "http://localhost:8082", timeout: 4000 });
export const inventoryApi = axios.create({ baseURL: "http://localhost:8083", timeout: 4000 });
