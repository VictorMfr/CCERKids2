import axios from 'axios';

const api = axios.create({
    baseURL: 'https://ccer-kids-api.vercel.app'
});

export default api;