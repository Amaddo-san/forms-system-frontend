import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:8081", // ✅ Set the base backend URL here
});

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers = config.headers || {}; // ✅ Fix: ensure headers is not undefined
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default instance;
