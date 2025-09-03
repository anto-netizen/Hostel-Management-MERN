import api from './api';

const getAll = () => api.get('/hostels');
const getById = (id) => api.get(`/hostels/${id}`);
const create = (data) => api.post('/hostels', data);
const update = (id, data) => api.put(`/hostels/${id}`, data);
const remove = (id) => api.delete(`/hostels/${id}`);

export default { getAll, getById, create, update, remove };
