import api from './api';

const login = (credentials) => api.post('/users/login', credentials);
const register = (userData) => api.post('/users/register', userData);

export default { login, register };
