import axios from "axios";

// axios instance for making requests
const axiosInstance = axios.create();

// request interceptor for adding token

export default axiosInstance;
