import axios from 'axios';

// Configuração única e centralizada da sua API
export const api = axios.create({
    baseURL: 'https://convertex-api.onrender.com', // Altere para a URL do seu back-end
    timeout: 10000,
});
