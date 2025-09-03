import api from './api';

const getAll = () => api.get('/rooms');
const getById = (id) => api.get(`/rooms/${id}`);
const create = (data) => api.post('/rooms', data);
const update = (id, data) => api.put(`/rooms/${id}`, data);
const remove = (id) => api.delete(`/rooms/${id}`);

export default { getAll, getById, create, update, remove };
