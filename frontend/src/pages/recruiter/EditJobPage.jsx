import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, X } from 'lucide-react';
import { jobService } from '../../services/jobService';
import { companyService } from '../../services/companyService';
import { parseSkills } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function EditJobPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState({
    title: '', description: '', location: '', salary: '', experience: '', companyId: '',
  });

  useEffect(() => {
    Promise.all([
      jobService.getJobById(id),
      companyService.getAllCompanies(),
    ]).then(([jobRes, compRes]) => {
      const job = jobRes.data;
      setForm({
        title: job.title || '',
        description: job.description || '',
        location: job.location || '',
        salary: job.salary || '',
        experience: job.experience ?? '',
        companyId: '',
      });
      setSkills(parseSkills(job.skillsRequires || job.skillRequirement));
      setCompanies(compRes.data || []);
    }).catch(() => toast.error('Failed to load job'));
  }, [id]);

  const addSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await jobService.updateJob(id, {
        ...form,
        experience: form.experience ? parseInt(form.experience) : null,
        companyId: form.companyId ? parseInt(form.companyId) : undefined,
        skillsRequires: skills.join(', '),
      });
      toast.success('Job updated!');
      navigate('/recruiter/jobs');
    } catch {
      toast.error('Failed to update job');
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
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Edit Job</h1>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-[var(--bg-card)] rounded-[var(--radius-xl)] p-8 border border-[var(--border-color)] shadow-[var(--shadow-sm)] space-y-5"
      >
        <div>
          <label className="text-sm font-medium text-[var(--text-primary)] mb-1.5 block">Job Title</label>
          <input type="text" value={form.title} onChange={(e) => update('title', e.target.value)} className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-[var(--text-primary)] mb-1.5 block">Location</label>
            <input type="text" value={form.location} onChange={(e) => update('location', e.target.value)} className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors" />
          </div>
          <div>
            <label className="text-sm font-medium text-[var(--text-primary)] mb-1.5 block">Salary</label>
            <input type="text" value={form.salary} onChange={(e) => update('salary', e.target.value)} className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-[var(--text-primary)] mb-1.5 block">Experience (years)</label>
          <input type="number" value={form.experience} onChange={(e) => update('experience', e.target.value)} min="0" className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors" />
        </div>

        <div>
          <label className="text-sm font-medium text-[var(--text-primary)] mb-1.5 block">Description</label>
          <textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={5} className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors resize-none" />
        </div>

        <div>
          <label className="text-sm font-medium text-[var(--text-primary)] mb-1.5 block">Skills</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {skills.map(s => (
              <span key={s} className="inline-flex items-center gap-1 px-3 py-1 text-sm rounded-[var(--radius-full)] bg-[var(--accent-subtle)] text-[var(--accent)]">
                {s} <button type="button" onClick={() => setSkills(skills.filter(x => x !== s))} className="cursor-pointer"><X size={14} /></button>
              </span>
            ))}
          </div>
          <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={addSkill} placeholder="Type skill + Enter" className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors" />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => navigate(-1)} className="px-5 py-2.5 text-sm font-medium border border-[var(--border-color)] rounded-[var(--radius-md)] text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer">Cancel</button>
          <button type="submit" disabled={loading} className="px-5 py-2.5 text-sm font-medium bg-[var(--accent)] text-white rounded-[var(--radius-md)] hover:bg-[var(--accent-hover)] disabled:opacity-60 transition-colors cursor-pointer">{loading ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </motion.form>
    </div>
  );
}
