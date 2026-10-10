import axios from "axios";

const API = axios.create({
  baseURL: (
    import.meta.env.VITE_API_URL ||
    "https://astrologyai-backend-2.onrender.com"
  ).replace(/\/+$/, ""),
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;