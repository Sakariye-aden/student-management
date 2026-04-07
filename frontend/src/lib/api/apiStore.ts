import axios from "axios";

const API_URL = "http://localhost:3000/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
  withCredentials: true, // ✅ ensures cookies are sent with every request

})


// Request or response interceptor to add the token

export default api