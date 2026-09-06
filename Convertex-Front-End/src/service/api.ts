import axios from 'axios';

// O Render é o padrão. Para usar a API local, defina VITE_API_URL em .env.local.
const API_URL = import.meta.env.VITE_API_URL || 'https://convertex-api.onrender.com/api';

console.log('[CONVERTEX] Conectando API em:', API_URL);

export const api = axios.create({
    baseURL: API_URL,
    timeout: 15000,
});
