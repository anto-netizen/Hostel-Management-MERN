import api from "./api";

const getAll = () => api.get("/rooms");
const create = (data) => api.post("/rooms", data);
const update = (id, data) => api.put(`/rooms/${id}`, data);
const remove = (id) => api.delete(`/rooms/${id}`);

// Add this line at the bottom
export default {
  getAll,
  create,
  update,
  remove,
};
