import { motion } from 'framer-motion';
import { User, Mail, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';

export default function RecruiterProfilePage() {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Profile</h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--bg-card)] rounded-[var(--radius-xl)] p-8 border border-[var(--border-color)] shadow-[var(--shadow-sm)]"
      >
        <div className="flex items-center gap-5 mb-6">
          <div className="w-20 h-20 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-2xl font-bold">
            {getInitials(user?.name)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">{user?.name}</h2>
            <p className="text-sm text-[var(--text-muted)] flex items-center gap-1 mt-1">
              <Building2 size={14} /> Recruiter
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-[var(--radius-md)] bg-[var(--bg-card-hover)]">
            <p className="text-xs text-[var(--text-muted)] mb-1">Full Name</p>
            <p className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-2">
              <User size={14} /> {user?.name}
            </p>
          </div>
          <div className="p-4 rounded-[var(--radius-md)] bg-[var(--bg-card-hover)]">
            <p className="text-xs text-[var(--text-muted)] mb-1">Email</p>
            <p className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-2">
              <Mail size={14} /> {user?.email}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
