import axios from "axios";

const axiosApi = axios.create({
    baseURL : process.env.NEXT_PUBLIC_TCONSOLE_API_BASE_URL,
    withCredentials : true
})

export default axiosApi