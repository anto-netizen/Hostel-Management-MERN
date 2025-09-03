import axios from 'axios';

// Create a central Axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // IMPORTANT: Adjust if your backend port is different
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add the authentication token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
