import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Briefcase, FileText, UserCheck } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import StatCard from '../../components/StatCard';
import { companyService } from '../../services/companyService';
import { applicationService } from '../../services/applicationService';
import { jobService } from '../../services/jobService';
import { recruiterChartData, recentActivities } from '../../data/dummyData';

export default function RecruiterDashboard() {
  const [companies, setCompanies] = useState([]);
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    companyService.getAllCompanies().then(res => setCompanies(res.data || [])).catch(() => {});
    applicationService.getAllApplications().then(res => setApplications(res.data || [])).catch(() => {});
    jobService.getAllJobs().then(res => setJobs(res.data || [])).catch(() => {});
  }, []);

  const hiredCount = applications.filter(a => a.status === 'HIRED').length;

  const getApplicationsTrend = () => {
    if (applications.length === 0) {
      return recruiterChartData.applicationsTrend;
    }
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const counts = {};
    const currentMonth = new Date().getMonth();
    // Initialize past 6 months with 0
    for (let i = 5; i >= 0; i--) {
      const mIdx = (currentMonth - i + 12) % 12;
      counts[months[mIdx]] = 0;
    }
    applications.forEach(app => {
      if (app.appliedAt) {
        const date = new Date(app.appliedAt);
        const mName = months[date.getMonth()];
        if (counts[mName] !== undefined) {
          counts[mName]++;
        }
      }
    });
    return Object.keys(counts).map(month => ({
      month,
      applications: counts[month]
    }));
  };

  const getJobsByCompany = () => {
    if (jobs.length === 0) {
      return recruiterChartData.jobsPostedTrend;
    }
    const counts = {};
    jobs.forEach(job => {
      const name = job.companyName || 'Unknown';
      counts[name] = (counts[name] || 0) + 1;
    });
    return Object.keys(counts).map(name => ({
      name: name.length > 10 ? name.substring(0, 10) + '..' : name,
      jobs: counts[name]
    })).slice(0, 6);
  };

  const getRecentActivities = () => {
    if (applications.length === 0) {
      return recentActivities;
    }
    return applications
      .slice(0, 5)
      .map((app, index) => ({
        id: app.id || index,
        action: 'New application received',
        detail: `${app.candidate?.name || 'A candidate'} applied for ${app.job?.title || 'a job'}`,
        time: app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'Just now'
      }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Recruiter Dashboard</h1>
        <p className="text-[var(--text-muted)] mt-1">Overview of your recruitment pipeline</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Building2} label="Companies" value={companies.length} color="info" delay={0} />
        <StatCard icon={Briefcase} label="Jobs Posted" value={jobs.length} color="accent" delay={0.1} />
        <StatCard icon={FileText} label="Applications" value={applications.length} color="warning" delay={0.2} />
        <StatCard icon={UserCheck} label="Hired" value={hiredCount} color="success" delay={0.3} />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Applications Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-color)] shadow-[var(--shadow-sm)]"
        >
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Applications Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={getApplicationsTrend()}>
              <XAxis dataKey="month" stroke="var(--text-placeholder)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-placeholder)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13px',
                }}
              />
              <Line type="monotone" dataKey="applications" stroke="var(--accent)" strokeWidth={2} dot={{ r: 4, fill: 'var(--accent)' }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Jobs by Company */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-color)] shadow-[var(--shadow-sm)]"
        >
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Jobs Posted by Company</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={getJobsByCompany()}>
              <XAxis dataKey="name" stroke="var(--text-placeholder)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-placeholder)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13px',
                }}
              />
              <Bar dataKey="jobs" fill="var(--accent)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] border border-[var(--border-color)] shadow-[var(--shadow-sm)] overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-[var(--border-color)]">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Recent Activity</h3>
        </div>
        <div className="divide-y divide-[var(--border-color)]">
          {getRecentActivities().map((act) => (
            <div key={act.id} className="px-6 py-4 hover:bg-[var(--bg-card-hover)] transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{act.action}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{act.detail}</p>
                </div>
                <span className="text-xs text-[var(--text-placeholder)] shrink-0 ml-4">{act.time}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
