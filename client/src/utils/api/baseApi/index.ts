import axios from "axios";

const BASE_API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL,
};

export const baseApi = axios.create(BASE_API_CONFIG);
