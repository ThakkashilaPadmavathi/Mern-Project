// src/utils/axios.js
import axios from "axios";

// Create the Axios instance
const api = axios.create({
  baseURL: "https://mern-project-gssm.onrender.com/api", // replace with your backend URL
  withCredentials: true,
});

// Add a request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // or sessionStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
