import api from './api';

export const emailService = {
  sendEmail: (to, subject, message) => api.post('/email/send', { to, subject, message }),
};
