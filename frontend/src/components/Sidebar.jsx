import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ items }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen z-30 bg-[var(--bg-sidebar)] border-r border-[var(--border-color)] flex flex-col"
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-16 border-b border-[var(--border-color)] shrink-0">
        <div className="p-2 rounded-[var(--radius-md)] bg-[var(--accent)] shrink-0">
          <Briefcase size={18} className="text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="text-lg font-bold text-[var(--text-primary)] whitespace-nowrap overflow-hidden"
            >
              Job<span className="text-[var(--accent)]">Portal</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {items.map(({ label, path, icon: Icon }) => {
          const isActive = location.pathname === path || location.pathname.startsWith(path + '/');
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'text-[var(--accent)] bg-[var(--accent-subtle)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]'
              }`}
              title={collapsed ? label : undefined}
            >
              <Icon size={20} className="shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="px-3 py-4 border-t border-[var(--border-color)] space-y-1">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-[var(--radius-md)] text-sm font-medium text-[var(--danger)] hover:bg-[var(--danger-light)] transition-colors cursor-pointer"
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={20} className="shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="whitespace-nowrap"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-20 -right-3 p-1.5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-full shadow-[var(--shadow-sm)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer z-10"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </motion.aside>
  );
}
