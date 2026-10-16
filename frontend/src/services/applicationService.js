import api from './api';

export const applicationService = {
  applyJob: (jobId) => api.post('/applications/apply', { jobId }),
  getMyApplications: () => api.get('/applications/my-applications'),
  getAllApplications: () => api.get('/applications/job/all-job'),
  getApplicantsByJob: (jobId) => api.get(`/applications/jobs/${jobId}`),
  getApplicationById: (id) => api.get(`/applications/job/${id}`),
  updateStatus: (id, status) => api.put(`/applications/job/${id}/status`, { status }),
};
