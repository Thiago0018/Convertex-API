// src/services/api.js
import axios from 'axios';

const API_URL = import.meta.env.MODE === 'development'
    ? 'https://convertex-api.onrender.com/api'
    : 'http://localhost:5187/api';

export const api = axios.create({
    baseURL: API_URL
});
