import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, DollarSign, Clock, Building2, Globe, Bookmark, ArrowLeft, Share2, CheckCircle } from 'lucide-react';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import { useAuth } from '../../context/AuthContext';
import { parseSkills, formatExperience } from '../../utils/helpers';
import { getInitials } from '../../utils/helpers';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import EasyApplyModal from '../../components/EasyApplyModal';
import toast from 'react-hot-toast';

export default function JobDetailsPage() {
  const { id } = useParams();
  const { isAuthenticated, isCandidate } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEasyApply, setShowEasyApply] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    setLoading(true);
    jobService.getJobById(id)
      .then(res => setJob(res.data))
      .catch(() => toast.error('Failed to load job details'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = () => {
    if (!isAuthenticated) {
      toast.error('Please login to apply');
      return;
    }
    setShowEasyApply(true);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <LoadingSkeleton type="card" count={1} />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <p className="text-lg text-[var(--text-muted)]">Job not found.</p>
        <Link to="/jobs" className="text-[var(--accent)] mt-4 inline-block hover:underline">
          ← Back to Jobs
        </Link>
      </div>
    );
  }

  const skills = parseSkills(job.skillsRequires || job.skillRequirement);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Link */}
      <Link to="/jobs" className="inline-flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors mb-6">
        <ArrowLeft size={16} /> Back to Jobs
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ─── Main Content ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Header Card */}
          <div className="bg-[var(--bg-card)] rounded-[var(--radius-xl)] p-8 border border-[var(--border-color)] shadow-[var(--shadow-sm)]">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">{job.title}</h1>
                <p className="text-lg text-[var(--text-muted)] mt-1">{job.companyName}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-[var(--radius-md)] border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer">
                  <Bookmark size={18} />
                </button>
                <button className="p-2 rounded-[var(--radius-md)] border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer">
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-[var(--text-muted)]">
              {job.location && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-full)] bg-[var(--bg-card-hover)]">
                  <MapPin size={14} /> {job.location}
                </span>
              )}
              {job.salary && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-full)] bg-[var(--bg-card-hover)]">
                  <DollarSign size={14} /> {job.salary}
                </span>
              )}
              {job.experience !== null && job.experience !== undefined && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-full)] bg-[var(--bg-card-hover)]">
                  <Clock size={14} /> {formatExperience(job.experience)}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-[var(--bg-card)] rounded-[var(--radius-xl)] p-8 border border-[var(--border-color)] shadow-[var(--shadow-sm)]">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Job Description</h2>
            <div className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
              {job.description || 'No description provided.'}
            </div>
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="bg-[var(--bg-card)] rounded-[var(--radius-xl)] p-8 border border-[var(--border-color)] shadow-[var(--shadow-sm)]">
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 text-sm font-medium rounded-[var(--radius-full)] bg-[var(--accent-subtle)] text-[var(--accent)]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* ─── Sidebar ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-5"
        >
          {/* Apply Card */}
          <div className="bg-[var(--bg-card)] rounded-[var(--radius-xl)] p-6 border border-[var(--border-color)] shadow-[var(--shadow-sm)] sticky top-24">
            {applied ? (
              <div className="text-center py-4">
                <CheckCircle size={40} className="text-[var(--success)] mx-auto mb-3" />
                <p className="font-semibold text-[var(--text-primary)]">Application Submitted!</p>
                <p className="text-sm text-[var(--text-muted)] mt-1">You'll hear back soon.</p>
              </div>
            ) : (
              <>
                {isCandidate ? (
                  <button
                    onClick={handleApply}
                    className="w-full py-3 bg-[var(--accent)] text-white font-semibold rounded-[var(--radius-md)] hover:bg-[var(--accent-hover)] transition-all shadow-[var(--shadow-sm)] hover:shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={17} /> Easy Apply
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="block w-full py-3 bg-[var(--accent)] text-white font-semibold rounded-[var(--radius-md)] hover:bg-[var(--accent-hover)] transition-colors shadow-[var(--shadow-sm)] text-center"
                  >
                    Login to Apply
                  </Link>
                )}
                <button className="w-full mt-3 py-3 border border-[var(--border-color)] text-[var(--text-primary)] font-medium rounded-[var(--radius-md)] hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer">
                  Save Job
                </button>
              </>
            )}
          </div>

          {/* Company Card */}
          <div className="bg-[var(--bg-card)] rounded-[var(--radius-xl)] p-6 border border-[var(--border-color)] shadow-[var(--shadow-sm)]">
            <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-4">Company</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-[var(--radius-md)] bg-[var(--accent-subtle)] flex items-center justify-center text-[var(--accent)] font-bold">
                {getInitials(job.companyName)}
              </div>
              <div>
                <p className="font-semibold text-[var(--text-primary)]">{job.companyName}</p>
                {job.location && (
                  <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                    <MapPin size={12} /> {job.location}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="bg-[var(--bg-card)] rounded-[var(--radius-xl)] p-6 border border-[var(--border-color)] shadow-[var(--shadow-sm)]">
            <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-4">Job Details</h3>
            <div className="space-y-3">
              {job.salary && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-muted)]">Salary</span>
                  <span className="font-medium text-[var(--text-primary)]">{job.salary}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-muted)]">Experience</span>
                <span className="font-medium text-[var(--text-primary)]">{formatExperience(job.experience)}</span>
              </div>
              {job.location && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-muted)]">Location</span>
                  <span className="font-medium text-[var(--text-primary)]">{job.location}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <EasyApplyModal
        isOpen={showEasyApply}
        job={job}
        onClose={() => setShowEasyApply(false)}
        onSuccess={() => setApplied(true)}
      />
    </div>
  );
}
