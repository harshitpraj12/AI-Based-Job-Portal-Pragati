import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Users } from 'lucide-react';
import EmptyState from '../../components/EmptyState';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import { companyService } from '../../services/companyService';
import toast from 'react-hot-toast';

export default function RecruiterJobsPage() {
  const [searchParams] = useSearchParams();
  const companyIdFilter = searchParams.get('companyId');
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchJobsAndApps = async () => {
    setLoading(true);
    try {
      const [jobsRes, appsRes, companiesRes] = await Promise.all([
        jobService.getAllJobs().catch((err) => {
          console.error('Error fetching jobs:', err);
          return { data: [] };
        }),
        applicationService.getAllApplications().catch((err) => {
          console.error('Error fetching applications:', err);
          return { data: [] };
        }),
        companyService.getAllCompanies().catch((err) => {
          console.error('Error fetching companies:', err);
          return { data: [] };
        })
      ]);

      // Normalize data in case the service returns arrays directly or inside .data
      const rawCompanies = Array.isArray(companiesRes)
        ? companiesRes
        : companiesRes?.data || [];
      const rawJobs = Array.isArray(jobsRes)
        ? jobsRes
        : jobsRes?.data || [];
      const rawApps = Array.isArray(appsRes)
        ? appsRes
        : appsRes?.data || [];

      const myCompanyIds = new Set(rawCompanies.map((c) => c?.id).filter(Boolean));

      // If recruiter has companies, filter by them; otherwise fallback to all jobs or empty list
      const myJobs = myCompanyIds.size > 0
        ? rawJobs.filter((j) => myCompanyIds.has(j?.companyId))
        : rawJobs;

      setJobs(myJobs);
      setApplications(rawApps);
    } catch (err) {
      console.error('Failed to load recruiter data:', err);
      // Strictly pass string values to toast to avoid "Objects are not valid as a React child"
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to load job listings';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobsAndApps();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job posting?')) return;
    try {
      await jobService.deleteJob(id);
      toast.success('Job deleted');
      fetchJobsAndApps();
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to delete';
      toast.error(errorMsg);
    }
  };

  const filteredJobs = companyIdFilter
    ? jobs.filter((job) => String(job?.companyId) === companyIdFilter)
    : jobs;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Job Postings</h1>
          <p className="text-[var(--text-muted)] mt-1">Manage your active job listings</p>
        </div>
        <Link
          to="/recruiter/jobs/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--accent)] text-white text-sm font-medium rounded-[var(--radius-md)] hover:bg-[var(--accent-hover)] transition-colors shadow-[var(--shadow-sm)]"
        >
          <Plus size={18} /> Post Job
        </Link>
      </div>

      {loading ? (
        <LoadingSkeleton type="table" count={5} />
      ) : filteredJobs.length === 0 ? (
        <EmptyState
          title="No jobs posted"
          description="Create your first job listing to start receiving applications."
          action={() => navigate('/recruiter/jobs/new')}
          actionLabel="Post a Job"
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
                  <th className="text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider px-6 py-3">Location</th>
                  <th className="text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider px-6 py-3">Salary</th>
                  <th className="text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider px-6 py-3">Applicants</th>
                  <th className="text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job) => (
                  <tr
                    key={job?.id}
                    className="border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--bg-card-hover)] transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-[var(--text-primary)]">
                      {job?.title || 'Untitled Role'}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-muted)]">
                      {job?.companyName || '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-muted)]">
                      {job?.location || '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-muted)]">
                      {job?.salary || '—'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[var(--radius-full)] text-xs font-semibold bg-[var(--accent-subtle)] text-[var(--accent)]">
                        <Users size={12} />
                        {applications.filter((a) => a?.job?.id === job?.id).length}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => navigate(`/recruiter/applications/${job?.id}`)}
                          className="p-2 rounded-[var(--radius-md)] text-[var(--text-muted)] hover:bg-[var(--accent-subtle)] hover:text-[var(--accent)] transition-colors cursor-pointer"
                          title="View Applications"
                        >
                          <Users size={16} />
                        </button>
                        <button
                          onClick={() => navigate(`/recruiter/jobs/${job?.id}/edit`)}
                          className="p-2 rounded-[var(--radius-md)] text-[var(--text-muted)] hover:bg-[var(--info-light)] hover:text-[var(--info)] transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(job?.id)}
                          className="p-2 rounded-[var(--radius-md)] text-[var(--text-muted)] hover:bg-[var(--danger-light)] hover:text-[var(--danger)] transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
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