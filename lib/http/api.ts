import axios from "axios";

/** Cliente HTTP para las rutas internas `/api/*`. Uso: `api.post("/contact", data)`. */
export const api = axios.create({
  baseURL: "/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
