import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'https://tattoobymanish-api.onrender.com/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

// Attach JWT on every request if present
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('tbm_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401 redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      sessionStorage.removeItem('tbm_token');
      sessionStorage.removeItem('tbm_admin');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

export default api;