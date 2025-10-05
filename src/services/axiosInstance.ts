import axios from "axios";
import { storageService } from "./storage/storageService";

const token = storageService.getItem("AUTH_TOKEN")

const headers: any = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
}

const axiosInstance = axios.create({
    baseURL: "https://server-community-issues-tracker.vercel.app",
    headers: headers
})

export default axiosInstance