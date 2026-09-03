import axios from 'axios';

// Lê a variável de ambiente injetada pelo Vite no build ou dev
const API_URL = import.meta.env.VITE_API_URL || 'https://convertex-api.onrender.com/api';

export const api = axios.create({
    baseURL: API_URL
});
