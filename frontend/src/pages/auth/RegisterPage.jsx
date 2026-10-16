import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, Briefcase, ArrowRight, UserCircle, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CANDIDATE');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password, role);
      toast.success('Account created! Please log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[var(--accent)] opacity-[0.03] blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-purple-500 opacity-[0.03] blur-[80px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="glass rounded-[var(--radius-xl)] p-8 shadow-[var(--shadow-xl)] border border-[var(--border-color)]">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-[var(--radius-lg)] bg-[var(--accent)] mb-4">
              <Briefcase size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Create Account</h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">Join our community today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection */}
            <div>
              <label className="text-sm font-medium text-[var(--text-primary)] mb-2 block">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'CANDIDATE', label: 'Candidate', icon: UserCircle, desc: 'Looking for jobs' },
                  { value: 'RECRUITER', label: 'Recruiter', icon: Building2, desc: 'Hiring talent' },
                ].map(({ value, label, icon: Icon, desc }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRole(value)}
                    className={`p-4 rounded-[var(--radius-md)] border-2 transition-all text-left cursor-pointer ${
                      role === value
                        ? 'border-[var(--accent)] bg-[var(--accent-subtle)]'
                        : 'border-[var(--border-color)] hover:border-[var(--text-placeholder)]'
                    }`}
                  >
                    <Icon size={22} className={role === value ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'} />
                    <p className={`text-sm font-semibold mt-2 ${role === value ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}>{label}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="text-sm font-medium text-[var(--text-primary)] mb-1.5 block">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-placeholder)]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-[var(--text-primary)] mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-placeholder)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-[var(--text-primary)] mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-placeholder)]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-11 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-placeholder)] hover:text-[var(--text-muted)] transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[var(--accent)] text-white font-semibold rounded-[var(--radius-md)] hover:bg-[var(--accent-hover)] transition-all shadow-[var(--shadow-sm)] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[var(--text-muted)]">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-[var(--accent)] hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
