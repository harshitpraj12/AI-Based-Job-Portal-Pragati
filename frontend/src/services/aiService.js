import api from './api';

export const aiService = {
  getResumeFeedback: () => api.get('/ai/resume-feedback'),
  getInterviewQuestions: (jobId) => api.get(`/ai/interview-questions/${jobId}`),
  getRecommendedJobs: () => api.get('/ai/recommend-jobs'),
  analyzeCandidateForJob: (candidateId, jobId) => api.get(`/ai/resume-analyse/${candidateId}/${jobId}`),
};
