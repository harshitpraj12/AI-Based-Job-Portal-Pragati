export const formatDate = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatCurrency = (amount) => {
  if (!amount) return 'Not disclosed';
  return amount;
};

export const formatExperience = (years) => {
  if (years === null || years === undefined) return 'Any';
  if (years === 0) return 'Fresher';
  if (years === 1) return '1 Year';
  return `${years} Years`;
};

export const getStatusColor = (status) => {
  const colors = {
    APPLIED: { bg: 'bg-info-light', text: 'text-info', label: 'Applied' },
    SHORTLISTED: { bg: 'bg-warning-light', text: 'text-warning', label: 'Shortlisted' },
    REJECTED: { bg: 'bg-danger-light', text: 'text-danger', label: 'Rejected' },
    HIRED: { bg: 'bg-success-light', text: 'text-success', label: 'Hired' },
  };
  return colors[status] || colors.APPLIED;
};

export const parseSkills = (skillsString) => {
  if (!skillsString) return [];
  return skillsString.split(',').map(s => s.trim()).filter(Boolean);
};

export const truncate = (str, len = 120) => {
  if (!str) return '';
  return str.length > len ? str.substring(0, len) + '...' : str;
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
};
