import axios from "axios";

const API = axios.create({
    baseURL: "https://astrologyai-backend-2.onrender.com"
});

export default API;