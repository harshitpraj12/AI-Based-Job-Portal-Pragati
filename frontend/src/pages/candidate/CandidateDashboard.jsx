import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Bookmark, Calendar, UserCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import { applicationService } from '../../services/applicationService';
import { candidateChartData } from '../../data/dummyData';
import { formatDate } from '../../utils/helpers';

export default function CandidateDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applicationService.getMyApplications()
      .then(res => setApplications(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statusCounts = {
    total: applications.length,
    shortlisted: applications.filter(a => a.status === 'SHORTLISTED').length,
    hired: applications.filter(a => a.status === 'HIRED').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Dashboard</h1>
        <p className="text-[var(--text-muted)] mt-1">Welcome back! Here's your job search overview.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FileText} label="Applications" value={statusCounts.total} color="info" delay={0} />
        <StatCard icon={Bookmark} label="Saved Jobs" value={0} color="warning" delay={0.1} />
        <StatCard icon={Calendar} label="Interviews" value={statusCounts.shortlisted} color="accent" delay={0.2} />
        <StatCard icon={UserCheck} label="Profile Score" value="85%" color="success" delay={0.3} />
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
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Applications Over Time</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={candidateChartData.applicationsPerMonth}>
              <defs>
                <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
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
              <Area type="monotone" dataKey="applications" stroke="var(--accent)" fill="url(#colorApps)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-color)] shadow-[var(--shadow-sm)]"
        >
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Application Status</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={candidateChartData.statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {candidateChartData.statusDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '13px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {candidateChartData.statusDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                {item.name} ({item.value})
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Applications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] border border-[var(--border-color)] shadow-[var(--shadow-sm)] overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)]">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Recent Applications</h3>
          <Link to="/candidate/applications" className="text-xs text-[var(--accent)] hover:underline flex items-center gap-1">
            View All <ArrowRight size={12} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-color)]">
                <th className="text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider px-6 py-3">Job</th>
                <th className="text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider px-6 py-3">Company</th>
                <th className="text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider px-6 py-3">Applied</th>
                <th className="text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.slice(0, 5).map((app) => (
                <tr key={app.id} className="border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--bg-card-hover)] transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-[var(--text-primary)]">{app.job?.title || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-[var(--text-muted)]">{app.job?.company?.companyName || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-[var(--text-muted)]">{formatDate(app.appliedAt)}</td>
                  <td className="px-6 py-4"><StatusBadge status={app.status} /></td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-[var(--text-muted)]">
                    No applications yet. Start browsing jobs!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
