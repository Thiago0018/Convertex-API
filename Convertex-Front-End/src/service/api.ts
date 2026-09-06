import axios from 'axios';

// Permite sobrescrever a API por ambiente sem alterar o código publicado.
const isLocalhost = typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const API_URL = import.meta.env.VITE_API_URL || (isLocalhost
    ? 'http://localhost:5187/api'
    : 'https://convertex-api.onrender.com/api');

console.log('[CONVERTEX] Conectando API em:', API_URL);

export const api = axios.create({
    baseURL: API_URL
});
