import axios from "axios";
// import { auth } from '../firebase/init';
// import { useAuthStore } from "../stores/authStore";
// import { supabase } from "./supabase";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
const auth = localStorage.getItem("auth-storage");
const authData = auth ? JSON.parse(auth) : null;
// console.log(authData.state.session.access_token);
const token = authData?.state.session?.access_token;

if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}
api.defaults.headers.common["apikey"] = import.meta.env.VITE_SUPABASE_KEY;
export default api;
