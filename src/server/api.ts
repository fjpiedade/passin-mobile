import axios from "axios"

//exp://192.168.1.64:8081

export const api = axios.create({
    baseURL: "http://192.168.1.64:3333",
}) 