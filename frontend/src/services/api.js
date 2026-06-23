import axios from "axios";
const api = axios.create({ baseURL: "/api", headers: { "Content-Type": "application/json" }, timeout: 60000 });
export const analyzeCode = async (code, language) => { const { data } = await api.post("/analyze", { code, language }); return data; };
export const checkHealth = async () => { const { data } = await api.get("/health"); return data; };
