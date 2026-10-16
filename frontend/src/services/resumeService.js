import api from './api';

export const resumeService = {
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/resumes/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  downloadResume: (candidateId) => api.get(`/resumes/download/${candidateId}`, { responseType: 'blob' }),
  previewResume: (candidateId) => api.get(`/resumes/preview/${candidateId}`, { responseType: 'blob' }),
  getMyResume: () => api.get('/resumes/my-resume'),
  downloadMyResume: () => api.get('/resumes/my-resume/download', { responseType: 'blob' }),
  previewMyResume: () => api.get('/resumes/my-resume/preview', { responseType: 'blob' }),
  deleteMyResume: () => api.delete('/resumes/my-resume'),
};
