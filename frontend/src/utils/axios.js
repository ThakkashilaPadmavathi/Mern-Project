// frontend/src/utils/axios.js
import axios from "axios";

/**
 * One central Axios instance for the whole app.
 * NOTE: backend URL already includes `/api` prefix,
 * so front‑end calls are just "/auth/..." or "/note/..."
 */
const api = axios.create({
  baseURL: "https://mern-project-gssm.onrender.com/api",
  withCredentials: true,
});

export default api;