import api from './api';

export const companyService = {
  getAllCompanies: () => api.get('/companies'),
  createCompany: (data) => api.post('/companies', data),
  updateCompany: (id, data) => api.put(`/companies/${id}`, data),
};
