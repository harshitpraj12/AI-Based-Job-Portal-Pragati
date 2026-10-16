import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getInitials } from '../utils/helpers';
import ThemeToggle from './ThemeToggle';

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const basePath = user?.role === 'RECRUITER' ? '/recruiter' : '/candidate';

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-1.5 rounded-[var(--radius-md)] hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-xs font-bold">
          {getInitials(user?.name)}
        </div>
        <span className="hidden sm:block text-sm font-medium text-[var(--text-primary)]">
          {user?.name?.split(' ')[0]}
        </span>
        <ChevronDown size={14} className={`text-[var(--text-muted)] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 5 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-56 z-50 bg-[var(--bg-card)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] border border-[var(--border-color)] overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-[var(--border-color)]">
                <p className="text-sm font-semibold text-[var(--text-primary)]">{user?.name}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{user?.email}</p>
              </div>
              <div className="py-1">
                <Link
                  to={`${basePath}/profile`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <User size={16} /> Profile
                </Link>
                <Link
                  to={`${basePath}/settings`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <Settings size={16} /> Settings
                </Link>
              </div>
              <div className="border-t border-[var(--border-color)] py-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-[var(--danger)] hover:bg-[var(--danger-light)] transition-colors cursor-pointer"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
