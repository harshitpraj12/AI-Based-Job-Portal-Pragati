import { motion } from 'framer-motion';
import { Palette, Shield, Trash2 } from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function RecruiterSettingsPage() {
  const { isDark } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure? This will delete your account and all data.')) return;
    try {
      await userService.deleteUser(user.id);
      logout();
      navigate('/');
      toast.success('Account deleted');
    } catch {
      toast.error('Failed to delete account');
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Settings</h1>
        <p className="text-[var(--text-muted)] mt-1">Manage your preferences</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-color)] shadow-[var(--shadow-sm)]">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2"><Palette size={16} className="text-[var(--accent)]" /> Appearance</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--text-primary)]">Theme</p>
            <p className="text-xs text-[var(--text-muted)]">{isDark ? 'Dark' : 'Light'} mode</p>
          </div>
          <ThemeToggle />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-color)] shadow-[var(--shadow-sm)]">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2"><Shield size={16} className="text-[var(--accent)]" /> Account</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-[var(--text-muted)]">Email</span><span className="font-medium text-[var(--text-primary)]">{user?.email}</span></div>
          <div className="flex justify-between"><span className="text-[var(--text-muted)]">Role</span><span className="font-medium text-[var(--text-primary)]">Recruiter</span></div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] p-6 border border-[var(--danger)]/20 shadow-[var(--shadow-sm)]">
        <h3 className="text-sm font-semibold text-[var(--danger)] mb-4 flex items-center gap-2"><Trash2 size={16} /> Danger Zone</h3>
        <p className="text-sm text-[var(--text-muted)] mb-4">Permanently delete your account.</p>
        <button onClick={handleDeleteAccount} className="px-4 py-2 text-sm font-medium bg-[var(--danger)] text-white rounded-[var(--radius-md)] hover:opacity-90 transition-opacity cursor-pointer">Delete Account</button>
      </motion.div>
    </div>
  );
}
