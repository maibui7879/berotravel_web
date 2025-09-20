import axios from "axios";

const API = axios.create({
  baseURL: "https://berotravel-backend.onrender.com/api/" || "http://localhost:5000/api/",
});

export default API;
