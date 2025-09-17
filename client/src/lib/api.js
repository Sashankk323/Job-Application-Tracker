import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5050/api", // your Express server
  withCredentials: true,                // send cookies
});
