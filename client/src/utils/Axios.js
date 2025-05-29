import axios from 'axios';



const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === 'development' ? import.meta.env.VITE_API_URL : "/api",
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,

})



export default axiosInstance;