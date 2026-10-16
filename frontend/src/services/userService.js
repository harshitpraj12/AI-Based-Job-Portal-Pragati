import api from './api';

export const userService = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.patch('/user/update', data),
  deleteUser: (id) => api.delete(`/user/delete/${id}`),
};
