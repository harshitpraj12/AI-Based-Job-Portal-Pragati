import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Filter, X, Wifi } from 'lucide-react';
import JobCard from '../../components/JobCard';
import EasyApplyModal from '../../components/EasyApplyModal';
import SearchBar from '../../components/SearchBar';
import Pagination from '../../components/Pagination';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import EmptyState from '../../components/EmptyState';
import { jobService } from '../../services/jobService';
import { useAuth } from '../../context/AuthContext';
import { applicationService } from '../../services/applicationService';
import toast from 'react-hot-toast';

export default function BrowseJobsPage() {
  const [searchParams] = useSearchParams();
  const { isAuthenticated, isCandidate } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [experience, setExperience] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [easyApplyJob, setEasyApplyJob] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      if (keyword || location) {
        const res = await jobService.searchJobs({ keyword, location, page, size: 9 });
        setJobs(res.data?.content || []);
        setTotalPages(res.data?.totalPages || 0);
      } else {
        const res = await jobService.getAllJobs();
        const allJobs = res.data || [];
        setJobs(allJobs.slice(page * 9, (page + 1) * 9));
        setTotalPages(Math.ceil(allJobs.length / 9));
      }
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page]);

  const handleSearch = () => {
    setPage(0);
    fetchJobs();
  };

  const handleApply = (jobOrId) => {
    if (!isAuthenticated) {
      toast.error('Please login as a Candidate to apply');
      return;
    }
    const targetJob = typeof jobOrId === 'object' ? jobOrId : jobs.find(j => j.id === jobOrId);
    if (targetJob) {
      setEasyApplyJob(targetJob);
    }
  };

  const clearFilters = () => {
    setKeyword('');
    setLocation('');
    setExperience('');
    setPage(0);
    setTimeout(fetchJobs, 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">Browse Jobs</h1>
        <p className="text-[var(--text-muted)] mt-1">Discover your next career opportunity</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ─── Filters Sidebar ─── */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`lg:w-72 shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}
        >
          <div className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] p-5 border border-[var(--border-color)] shadow-[var(--shadow-sm)] sticky top-24 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">Filters</h3>
              <button onClick={clearFilters} className="text-xs text-[var(--accent)] hover:underline cursor-pointer">
                Clear All
              </button>
            </div>

            {/* Keyword */}
            <div>
              <label className="text-xs font-medium text-[var(--text-muted)] mb-1.5 block">Keyword</label>
              <SearchBar value={keyword} onChange={setKeyword} placeholder="Job title, skill..." />
            </div>

            {/* Location */}
            <div>
              <label className="text-xs font-medium text-[var(--text-muted)] mb-1.5 block">Location</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-placeholder)]" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City or Remote"
                  className="w-full pl-9 pr-3 py-2.5 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>
            </div>

            {/* Experience */}
            <div>
              <label className="text-xs font-medium text-[var(--text-muted)] mb-1.5 block">Experience</label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full px-3 py-2.5 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors cursor-pointer"
              >
                <option value="">Any Experience</option>
                <option value="0">Fresher</option>
                <option value="1">1+ Year</option>
                <option value="3">3+ Years</option>
                <option value="5">5+ Years</option>
                <option value="10">10+ Years</option>
              </select>
            </div>

            {/* Remote Toggle */}
            <div className="flex items-center gap-3 py-2">
              <Wifi size={16} className="text-[var(--text-muted)]" />
              <span className="text-sm text-[var(--text-primary)]">Remote Only</span>
              <input type="checkbox" className="ml-auto w-4 h-4 accent-[var(--accent)] cursor-pointer" />
            </div>

            <button
              onClick={handleSearch}
              className="w-full py-2.5 bg-[var(--accent)] text-white text-sm font-medium rounded-[var(--radius-md)] hover:bg-[var(--accent-hover)] transition-colors cursor-pointer"
            >
              Apply Filters
            </button>
          </div>
        </motion.aside>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-[var(--border-color)] rounded-[var(--radius-md)] text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer"
          >
            <Filter size={16} />
            {showFilters ? 'Hide' : 'Show'} Filters
          </button>
        </div>

        {/* ─── Job Listings ─── */}
        <div className="flex-1">
          {loading ? (
            <div className="grid md:grid-cols-2 gap-5">
              <LoadingSkeleton type="card" count={6} />
            </div>
          ) : jobs.length === 0 ? (
            <EmptyState
              title="No jobs found"
              description="Try adjusting your filters or search terms."
              action={clearFilters}
              actionLabel="Clear Filters"
            />
          ) : (
            <>
              <p className="text-sm text-[var(--text-muted)] mb-4">
                Showing {jobs.length} job{jobs.length !== 1 && 's'}
              </p>
              <div className="grid md:grid-cols-2 gap-5">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    showApply={isCandidate}
                    onApply={handleApply}
                  />
                ))}
              </div>
              <div className="mt-8 flex justify-center">
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
              </div>
            </>
          )}
        </div>
      </div>

      <EasyApplyModal
        isOpen={!!easyApplyJob}
        job={easyApplyJob}
        onClose={() => setEasyApplyJob(null)}
      />
    </div>
  );
}
