import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Building2 } from 'lucide-react';
import { companyService } from '../../services/companyService';
import toast from 'react-hot-toast';

export default function CreateCompanyPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    companyName: '', website: '', location: '', description: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.companyName) { toast.error('Company name is required'); return; }
    setLoading(true);
    try {
      await companyService.createCompany(form);
      toast.success('Company created!');
      navigate('/recruiter/companies');
    } catch (err) {
      toast.error(err.response?.data || 'Failed to create company');
    } finally {
      setLoading(false);
    }
  };

  const update = (field, value) => setForm({ ...form, [field]: value });

  return (
    <div className="max-w-2xl space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors cursor-pointer">
        <ArrowLeft size={16} /> Back
      </button>

      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Building2 size={24} className="text-[var(--accent)]" /> Register Company
        </h1>
        <p className="text-[var(--text-muted)] mt-1">Add your company details</p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-[var(--bg-card)] rounded-[var(--radius-xl)] p-8 border border-[var(--border-color)] shadow-[var(--shadow-sm)] space-y-5"
      >
        {[
          { field: 'companyName', label: 'Company Name', placeholder: 'Acme Inc.', required: true },
          { field: 'website', label: 'Website', placeholder: 'https://acme.com' },
          { field: 'location', label: 'Location', placeholder: 'Bangalore, India' },
        ].map(({ field, label, placeholder, required }) => (
          <div key={field}>
            <label className="text-sm font-medium text-[var(--text-primary)] mb-1.5 block">
              {label} {required && <span className="text-[var(--danger)]">*</span>}
            </label>
            <input
              type="text"
              value={form[field]}
              onChange={(e) => update(field, e.target.value)}
              placeholder={placeholder}
              className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
            />
          </div>
        ))}

        <div>
          <label className="text-sm font-medium text-[var(--text-primary)] mb-1.5 block">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="Tell us about your company..."
            rows={4}
            className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => navigate(-1)} className="px-5 py-2.5 text-sm font-medium border border-[var(--border-color)] rounded-[var(--radius-md)] text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-5 py-2.5 text-sm font-medium bg-[var(--accent)] text-white rounded-[var(--radius-md)] hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-60 cursor-pointer">
            {loading ? 'Creating...' : 'Create Company'}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
