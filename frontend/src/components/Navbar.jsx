import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import NotificationDropdown from './NotificationDropdown';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  const navLinks = [
    { label: 'Jobs', path: '/jobs' },
    { label: 'Companies', path: '/companies' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 border-b border-[var(--border-color)] bg-[var(--bg-card)]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-[var(--radius-md)] bg-[var(--accent)] group-hover:shadow-lg transition-shadow duration-300">
              <Briefcase size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-[var(--text-primary)]">
              Job<span className="text-[var(--accent)]">Portal</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                className={`px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-200 ${
                  isActive(path)
                    ? 'text-[var(--accent)] bg-[var(--accent-subtle)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-2">
            <ThemeToggle />
            {isAuthenticated && <NotificationDropdown />}
            {isAuthenticated ? (
              <Link
                to={user?.role === 'RECRUITER' ? '/recruiter/dashboard' : '/candidate/dashboard'}
                className="px-4 py-2 bg-[var(--accent)] text-white text-sm font-medium rounded-[var(--radius-md)] hover:bg-[var(--accent-hover)] transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-[var(--radius-md)] hover:bg-[var(--bg-card-hover)] transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-[var(--accent)] text-white text-sm font-medium rounded-[var(--radius-md)] hover:bg-[var(--accent-hover)] transition-colors shadow-[var(--shadow-sm)]"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-[var(--radius-md)] text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] cursor-pointer"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(({ label, path }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-colors ${
                    isActive(path)
                      ? 'text-[var(--accent)] bg-[var(--accent-subtle)]'
                      : 'text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)]'
                  }`}
                >
                  {label}
                </Link>
              ))}
              <div className="pt-2 space-y-1 border-t border-[var(--border-color)]">
                {isAuthenticated ? (
                  <Link
                    to={user?.role === 'RECRUITER' ? '/recruiter/dashboard' : '/candidate/dashboard'}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-2.5 bg-[var(--accent)] text-white text-sm font-medium rounded-[var(--radius-md)] text-center"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] rounded-[var(--radius-md)]">Login</Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 bg-[var(--accent)] text-white text-sm font-medium rounded-[var(--radius-md)] text-center">Register</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
