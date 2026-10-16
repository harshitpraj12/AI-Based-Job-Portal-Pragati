import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import { applicationService } from '../../services/applicationService';
import { formatDate } from '../../utils/helpers';
import { FileText } from 'lucide-react';

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    applicationService.getMyApplications()
      .then(res => setApplications(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'ALL' ? applications : applications.filter(a => a.status === filter);

  const statusFilters = ['ALL', 'APPLIED', 'SHORTLISTED', 'REJECTED', 'HIRED'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">My Applications</h1>
        <p className="text-[var(--text-muted)] mt-1">Track all your job applications in one place</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 text-sm font-medium rounded-[var(--radius-full)] transition-all cursor-pointer ${
              filter === s
                ? 'bg-[var(--accent)] text-white shadow-[var(--shadow-sm)]'
                : 'bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-color)] hover:bg-[var(--bg-card-hover)]'
            }`}
          >
            {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
            {s === 'ALL' && ` (${applications.length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-2">
          <LoadingSkeleton type="table" count={5} />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No applications found"
          description={filter === 'ALL' ? "You haven't applied to any jobs yet." : `No ${filter.toLowerCase()} applications.`}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] border border-[var(--border-color)] shadow-[var(--shadow-sm)] overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border-color)]">
                  <th className="text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider px-6 py-3">Job Title</th>
                  <th className="text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider px-6 py-3">Company</th>
                  <th className="text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider px-6 py-3">Applied Date</th>
                  <th className="text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((app) => (
                  <tr key={app.id} className="border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--bg-card-hover)] transition-colors">
                    <td className="px-6 py-4">
                      <Link to={`/candidate/jobs/${app.job?.id}`} className="text-sm font-medium text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">
                        {app.job?.title || 'N/A'}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-muted)]">{app.job?.company?.companyName || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-[var(--text-muted)]">{formatDate(app.appliedAt)}</td>
                    <td className="px-6 py-4"><StatusBadge status={app.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
