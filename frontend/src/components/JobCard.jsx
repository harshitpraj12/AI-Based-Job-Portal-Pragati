import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Clock, Bookmark, ArrowRight } from 'lucide-react';
import { parseSkills, formatExperience } from '../utils/helpers';

export default function JobCard({ job, showApply = true, onApply, onSave, linkPrefix = '' }) {
  const skills = parseSkills(job.skillsRequires || job.skillRequirement);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="group bg-[var(--bg-card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-color)] hover:border-[var(--accent)]/30 hover:shadow-[var(--shadow-md)] transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <Link
            to={`${linkPrefix}/jobs/${job.id}`}
            className="text-lg font-semibold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors line-clamp-1"
          >
            {job.title}
          </Link>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">{job.companyName || 'Company'}</p>
        </div>
        {onSave && (
          <button
            onClick={() => onSave(job.id)}
            className="p-2 rounded-[var(--radius-md)] text-[var(--text-placeholder)] hover:text-[var(--accent)] hover:bg-[var(--accent-subtle)] transition-all cursor-pointer"
          >
            <Bookmark size={18} />
          </button>
        )}
      </div>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-[var(--text-muted)]">
        {job.location && (
          <span className="flex items-center gap-1">
            <MapPin size={14} className="text-[var(--text-placeholder)]" />
            {job.location}
          </span>
        )}
        {job.salary && (
          <span className="flex items-center gap-1">
            <DollarSign size={14} className="text-[var(--text-placeholder)]" />
            {job.salary}
          </span>
        )}
        {job.experience !== null && job.experience !== undefined && (
          <span className="flex items-center gap-1">
            <Clock size={14} className="text-[var(--text-placeholder)]" />
            {formatExperience(job.experience)}
          </span>
        )}
      </div>

      {/* Skills */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {skills.slice(0, 5).map((skill) => (
            <span
              key={skill}
              className="px-2.5 py-1 text-xs font-medium rounded-[var(--radius-full)] bg-[var(--accent-subtle)] text-[var(--accent)]"
            >
              {skill}
            </span>
          ))}
          {skills.length > 5 && (
            <span className="px-2.5 py-1 text-xs font-medium rounded-[var(--radius-full)] bg-[var(--bg-card-hover)] text-[var(--text-muted)]">
              +{skills.length - 5} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)]">
        <Link
          to={`${linkPrefix}/jobs/${job.id}`}
          className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors flex items-center gap-1"
        >
          View Details <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
        {showApply && onApply && (
          <button
            onClick={() => onApply(job)}
            className="px-4 py-2 bg-[var(--accent)] text-white text-sm font-medium rounded-[var(--radius-md)] hover:bg-[var(--accent-hover)] transition-colors shadow-[var(--shadow-sm)] cursor-pointer"
          >
            Apply Now
          </button>
        )}
      </div>
    </motion.div>
  );
}
