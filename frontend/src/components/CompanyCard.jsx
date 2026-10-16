import { motion } from 'framer-motion';
import { MapPin, Globe, Building2 } from 'lucide-react';
import { getInitials } from '../utils/helpers';

export default function CompanyCard({ company, onEdit, onViewJobs, showActions = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-color)] hover:shadow-[var(--shadow-md)] transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        {/* Company Avatar */}
        <div className="w-14 h-14 rounded-[var(--radius-md)] bg-[var(--accent-subtle)] flex items-center justify-center text-[var(--accent)] font-bold text-lg shrink-0">
          {getInitials(company.companyName)}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-[var(--text-primary)] line-clamp-1">
            {company.companyName}
          </h3>

          <div className="flex flex-wrap gap-3 mt-1.5 text-sm text-[var(--text-muted)]">
            {company.location && (
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {company.location}
              </span>
            )}
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-[var(--accent)] transition-colors"
              >
                <Globe size={14} />
                Website
              </a>
            )}
          </div>

          {company.description && (
            <p className="text-sm text-[var(--text-muted)] mt-2 line-clamp-2">
              {company.description}
            </p>
          )}

          {showActions && (
            <div className="flex items-center gap-2 mt-4">
              {onEdit && (
                <button
                  onClick={() => onEdit(company)}
                  className="px-3 py-1.5 text-xs font-medium rounded-[var(--radius-md)] border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer"
                >
                  Edit
                </button>
              )}
              {onViewJobs && (
                <button
                  onClick={() => onViewJobs(company.id)}
                  className="px-3 py-1.5 text-xs font-medium rounded-[var(--radius-md)] bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors cursor-pointer"
                >
                  View Jobs
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
