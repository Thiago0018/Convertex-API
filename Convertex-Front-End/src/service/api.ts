import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://convertex-api.onrender.com/api';

console.log('[CONVERTEX] Conectando API em:', API_URL);

export const api = axios.create({
    baseURL: API_URL,
    timeout: 30000,
});
