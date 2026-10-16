export const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'Software Engineer at Google',
    quote: 'This platform helped me land my dream job at Google. The AI-powered resume screening gave me insights I never had before.',
    avatar: null,
  },
  {
    id: 2,
    name: 'Rahul Verma',
    role: 'Product Manager at Microsoft',
    quote: 'The interview preparation tool was a game-changer. I felt confident and prepared for every round.',
    avatar: null,
  },
  {
    id: 3,
    name: 'Sneha Patel',
    role: 'Data Scientist at Amazon',
    quote: 'I got 3 offers within 2 weeks of using this portal. The job recommendations were spot-on for my skills.',
    avatar: null,
  },
];

export const stats = [
  { label: 'Active Jobs', value: '12,500+', icon: 'Briefcase' },
  { label: 'Companies', value: '3,200+', icon: 'Building2' },
  { label: 'Candidates', value: '85,000+', icon: 'Users' },
  { label: 'Placements', value: '15,000+', icon: 'Award' },
];

export const topCompanies = [
  { id: 1, name: 'Google', location: 'Bangalore, India', description: 'Organizing the world\'s information', website: 'https://google.com' },
  { id: 2, name: 'Microsoft', location: 'Hyderabad, India', description: 'Empowering every person and organization', website: 'https://microsoft.com' },
  { id: 3, name: 'Amazon', location: 'Bangalore, India', description: 'Earth\'s most customer-centric company', website: 'https://amazon.com' },
  { id: 4, name: 'Meta', location: 'Gurgaon, India', description: 'Building the future of connection', website: 'https://meta.com' },
  { id: 5, name: 'Apple', location: 'Hyderabad, India', description: 'Think Different', website: 'https://apple.com' },
  { id: 6, name: 'Netflix', location: 'Mumbai, India', description: 'Entertainment for the world', website: 'https://netflix.com' },
];

export const candidateChartData = {
  applicationsPerMonth: [
    { month: 'Jan', applications: 4 },
    { month: 'Feb', applications: 7 },
    { month: 'Mar', applications: 5 },
    { month: 'Apr', applications: 12 },
    { month: 'May', applications: 9 },
    { month: 'Jun', applications: 15 },
  ],
  statusDistribution: [
    { name: 'Applied', value: 12, color: '#3B82F6' },
    { name: 'Shortlisted', value: 5, color: '#F59E0B' },
    { name: 'Rejected', value: 3, color: '#EF4444' },
    { name: 'Hired', value: 2, color: '#10B981' },
  ],
};

export const recruiterChartData = {
  applicationsTrend: [
    { month: 'Jan', applications: 25 },
    { month: 'Feb', applications: 42 },
    { month: 'Mar', applications: 38 },
    { month: 'Apr', applications: 55 },
    { month: 'May', applications: 67 },
    { month: 'Jun', applications: 80 },
  ],
  jobsPostedTrend: [
    { month: 'Jan', jobs: 3 },
    { month: 'Feb', jobs: 5 },
    { month: 'Mar', jobs: 4 },
    { month: 'Apr', jobs: 8 },
    { month: 'May', jobs: 6 },
    { month: 'Jun', jobs: 10 },
  ],
};

export const recentActivities = [
  { id: 1, action: 'New application received', detail: 'John Doe applied for Senior React Developer', time: '2 hours ago', type: 'application' },
  { id: 2, action: 'Candidate shortlisted', detail: 'Jane Smith shortlisted for Product Manager', time: '4 hours ago', type: 'status' },
  { id: 3, action: 'New job posted', detail: 'Data Engineer at TechCorp is now live', time: '6 hours ago', type: 'job' },
  { id: 4, action: 'Candidate hired', detail: 'Mike Wilson hired as Backend Developer', time: '1 day ago', type: 'hired' },
  { id: 5, action: 'Company registered', detail: 'StartupXYZ has been added', time: '2 days ago', type: 'company' },
];
