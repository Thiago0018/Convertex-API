import axios from 'axios';

// Força a decisão em tempo de execução no navegador
/*const isLocalhost = typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const API_URL = isLocalhost
    ? 'http://localhost:5187/api'
    : 'https://convertex-api.onrender.com/api';

console.log('[CONVERTEX] Conectando API em:', API_URL);*/

export const api = axios.create({
    baseURL: 'https://convertex-api.onrender.com/api'//API_URL
});
