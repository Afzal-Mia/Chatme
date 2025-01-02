import axios from 'axios'
//we are using axios instead of fetch to fetch the api 
export const axiosInstance=axios.create({
    baseURL:import.meta.env.MODE==="development" ? "http://localhost:5001/api":"/api",
    withCredentials:true
})