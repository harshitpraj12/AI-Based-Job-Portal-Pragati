import api from './api';

export const jobService = {
  getAllJobs: () => api.get('/jobs'),
  getJobById: (id) => api.get(`/jobs/${id}`),
  searchJobs: (params) => api.get('/jobs/search', { params }),
  createJob: (data) => api.post('/jobs', data),
  updateJob: (id, data) => api.put(`/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/jobs/delete/${id}`),
};
