import axios from "axios";

const API = axios.create({
  baseURL: "https://taskmanagerassignment-production.up.railway.app/api"
});

export default API;