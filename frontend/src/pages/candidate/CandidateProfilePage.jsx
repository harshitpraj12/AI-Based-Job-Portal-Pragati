import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Globe, Link as LinkIcon, GraduationCap, Briefcase, Edit2, Save, X, Plus, Trash2, Calendar, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import toast from 'react-hot-toast';

export default function CandidateProfilePage() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    mobile: '',
    address: '',
    gender: '',
    dob: '',
    socialMedia: [],
    educations: [],
    projects: [],
  });

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await userService.getProfile();
      const data = res.data;
      setProfile({
        mobile: data.mobile || '',
        address: data.address || '',
        gender: data.gender || '',
        dob: data.dob || '',
        socialMedia: data.socialMedia || [],
        educations: data.educations || [],
        projects: data.projects || [],
      });
    } catch {
      // Profile may not exist yet, use defaults
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        mobile: profile.mobile || null,
        address: profile.address || null,
        gender: profile.gender || null,
        dob: profile.dob || null,
        socialMedia: profile.socialMedia.length > 0 ? profile.socialMedia : null,
        educations: profile.educations.length > 0 ? profile.educations : null,
        projects: profile.projects.length > 0 ? profile.projects : null,
      };
      await userService.updateProfile(payload);
      toast.success('Profile updated successfully');
      setEditing(false);
      fetchProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    fetchProfile();
  };

  // Education helpers
  const addEducation = () => {
    setProfile(prev => ({
      ...prev,
      educations: [...prev.educations, { collegeName: '', degree: '', marks: '', startDate: '', endDate: '' }],
    }));
  };

  const updateEducation = (index, field, value) => {
    setProfile(prev => {
      const updated = [...prev.educations];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, educations: updated };
    });
  };

  const removeEducation = (index) => {
    setProfile(prev => ({
      ...prev,
      educations: prev.educations.filter((_, i) => i !== index),
    }));
  };

  // Projects helpers
  const addProject = () => {
    setProfile(prev => ({
      ...prev,
      projects: [...prev.projects, { name: '', details: '', url: '', startDate: '', endDate: '' }],
    }));
  };

  const updateProject = (index, field, value) => {
    setProfile(prev => {
      const updated = [...prev.projects];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, projects: updated };
    });
  };

  const removeProject = (index) => {
    setProfile(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  // Social media helpers
  const addSocialMedia = () => {
    setProfile(prev => ({
      ...prev,
      socialMedia: [...prev.socialMedia, ''],
    }));
  };

  const updateSocialMedia = (index, value) => {
    setProfile(prev => {
      const updated = [...prev.socialMedia];
      updated[index] = value;
      return { ...prev, socialMedia: updated };
    });
  };

  const removeSocialMedia = (index) => {
    setProfile(prev => ({
      ...prev,
      socialMedia: prev.socialMedia.filter((_, i) => i !== index),
    }));
  };

  // Calculate completion
  const calculateCompletion = () => {
    let filled = 0;
    let total = 6;
    if (user?.name) filled++;
    if (user?.email) filled++;
    if (profile.mobile) filled++;
    if (profile.address) filled++;
    if (profile.gender) filled++;
    if (profile.educations.length > 0) filled++;
    return Math.round((filled / total) * 100);
  };

  const profileCompletion = calculateCompletion();

  if (loading) {
    return (
      <div className="max-w-4xl flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-[var(--text-muted)]">
          <Loader2 size={24} className="animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">My Profile</h1>
          <p className="text-[var(--text-muted)] mt-1">Manage your personal information</p>
        </div>
        <div className="flex items-center gap-2">
          {editing && (
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-[var(--radius-md)] border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer"
            >
              <X size={16} /> Cancel
            </button>
          )}
          <button
            onClick={() => editing ? handleSave() : setEditing(true)}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-[var(--radius-md)] bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors cursor-pointer disabled:opacity-60"
          >
            {saving ? (
              <><Loader2 size={16} className="animate-spin" /> Saving...</>
            ) : editing ? (
              <><Save size={16} /> Save</>
            ) : (
              <><Edit2 size={16} /> Edit</>
            )}
          </button>
        </div>
      </div>

      {/* Profile Completion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-color)] shadow-[var(--shadow-sm)]"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Profile Completion</h3>
          <span className="text-sm font-bold text-[var(--accent)]">{profileCompletion}%</span>
        </div>
        <div className="w-full h-2 rounded-[var(--radius-full)] bg-[var(--bg-card-hover)] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${profileCompletion}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-[var(--radius-full)] bg-gradient-to-r from-[var(--accent)] to-[#6366F1]"
          />
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-2">Complete your profile to increase visibility to recruiters.</p>
      </motion.div>

      {/* Personal Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-color)] shadow-[var(--shadow-sm)]"
      >
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <User size={16} className="text-[var(--accent)]" /> Personal Information
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-[var(--text-muted)] block mb-1">Full Name</label>
            <p className="text-sm font-medium text-[var(--text-primary)]">{user?.name || '—'}</p>
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)] block mb-1">Email</label>
            <p className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-1">
              <Mail size={14} className="text-[var(--text-placeholder)]" /> {user?.email || '—'}
            </p>
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)] block mb-1">Phone</label>
            {editing ? (
              <input
                type="tel"
                value={profile.mobile}
                onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
                placeholder="+91 XXXXXXXXXX"
                className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
            ) : (
              <p className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-1">
                <Phone size={14} className="text-[var(--text-placeholder)]" /> {profile.mobile || 'Not set'}
              </p>
            )}
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)] block mb-1">Location</label>
            {editing ? (
              <input
                type="text"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                placeholder="City, Country"
                className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
            ) : (
              <p className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-1">
                <MapPin size={14} className="text-[var(--text-placeholder)]" /> {profile.address || 'Not set'}
              </p>
            )}
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)] block mb-1">Gender</label>
            {editing ? (
              <select
                value={profile.gender}
                onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors cursor-pointer"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <p className="text-sm font-medium text-[var(--text-primary)]">{profile.gender || 'Not set'}</p>
            )}
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)] block mb-1">Date of Birth</label>
            {editing ? (
              <input
                type="date"
                value={profile.dob}
                onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
            ) : (
              <p className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-1">
                <Calendar size={14} className="text-[var(--text-placeholder)]" /> {profile.dob || 'Not set'}
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Social Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-color)] shadow-[var(--shadow-sm)]"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <Globe size={16} className="text-[var(--accent)]" /> Social Links
          </h3>
          {editing && (
            <button
              onClick={addSocialMedia}
              className="flex items-center gap-1 text-xs font-medium text-[var(--accent)] hover:underline cursor-pointer"
            >
              <Plus size={14} /> Add Link
            </button>
          )}
        </div>
        {profile.socialMedia.length === 0 ? (
          <div className="text-sm text-[var(--text-muted)] text-center py-4">
            No social links added yet.{' '}
            {!editing && (
              <button onClick={() => { setEditing(true); addSocialMedia(); }} className="text-[var(--accent)] hover:underline cursor-pointer">
                Add one
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {profile.socialMedia.map((link, index) => (
              <div key={index} className="flex items-center gap-3">
                <LinkIcon size={16} className="text-[var(--text-muted)] shrink-0" />
                {editing ? (
                  <>
                    <input
                      type="url"
                      value={link}
                      onChange={(e) => updateSocialMedia(index, e.target.value)}
                      placeholder="https://github.com/username"
                      className="flex-1 px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                    />
                    <button
                      onClick={() => removeSocialMedia(index)}
                      className="p-2 text-[var(--text-placeholder)] hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                ) : (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-[var(--accent)] hover:underline truncate"
                  >
                    {link}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Education */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-color)] shadow-[var(--shadow-sm)]"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <GraduationCap size={16} className="text-[var(--accent)]" /> Education
          </h3>
          {editing && (
            <button
              onClick={addEducation}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-[var(--accent)] rounded-[var(--radius-md)] hover:bg-[var(--accent-hover)] transition-colors cursor-pointer"
            >
              <Plus size={14} /> Add Education
            </button>
          )}
        </div>

        {profile.educations.length === 0 ? (
          <div className="text-sm text-[var(--text-muted)] text-center py-6">
            No education added yet.{' '}
            {!editing && (
              <button
                onClick={() => { setEditing(true); addEducation(); }}
                className="text-[var(--accent)] hover:underline cursor-pointer"
              >
                Add education
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {profile.educations.map((edu, index) => (
              <div
                key={index}
                className={`rounded-[var(--radius-md)] border border-[var(--border-color)] p-4 ${editing ? 'bg-[var(--bg-input)]' : 'bg-[var(--bg-card-hover)]'}`}
              >
                {editing ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Education #{index + 1}</span>
                      <button
                        onClick={() => removeEducation(index)}
                        className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 cursor-pointer"
                      >
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-[var(--text-muted)] block mb-1">College / University</label>
                        <input
                          type="text"
                          value={edu.collegeName || ''}
                          onChange={(e) => updateEducation(index, 'collegeName', e.target.value)}
                          placeholder="e.g. IIT Delhi"
                          className="w-full px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[var(--text-muted)] block mb-1">Degree</label>
                        <input
                          type="text"
                          value={edu.degree || ''}
                          onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                          placeholder="e.g. B.Tech Computer Science"
                          className="w-full px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[var(--text-muted)] block mb-1">Marks / CGPA</label>
                        <input
                          type="number"
                          step="0.01"
                          value={edu.marks || ''}
                          onChange={(e) => updateEducation(index, 'marks', e.target.value ? parseFloat(e.target.value) : '')}
                          placeholder="e.g. 8.5"
                          className="w-full px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-[var(--text-muted)] block mb-1">Start Date</label>
                          <input
                            type="date"
                            value={edu.startDate || ''}
                            onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                            className="w-full px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-[var(--text-muted)] block mb-1">End Date</label>
                          <input
                            type="date"
                            value={edu.endDate || ''}
                            onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                            className="w-full px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-[var(--radius-md)] bg-[var(--accent-subtle)] shrink-0">
                      <GraduationCap size={18} className="text-[var(--accent)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[var(--text-primary)]">{edu.degree || 'No degree specified'}</p>
                      <p className="text-sm text-[var(--text-muted)]">{edu.collegeName || 'No college specified'}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-[var(--text-placeholder)]">
                        {edu.marks && <span>CGPA: {edu.marks}</span>}
                        {edu.startDate && (
                          <span>
                            {edu.startDate} — {edu.endDate || 'Present'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Projects */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-color)] shadow-[var(--shadow-sm)]"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <Briefcase size={16} className="text-[var(--accent)]" /> Projects
          </h3>
          {editing && (
            <button
              onClick={addProject}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-[var(--accent)] rounded-[var(--radius-md)] hover:bg-[var(--accent-hover)] transition-colors cursor-pointer"
            >
              <Plus size={14} /> Add Project
            </button>
          )}
        </div>

        {profile.projects.length === 0 ? (
          <div className="text-sm text-[var(--text-muted)] text-center py-6">
            No projects added yet.{" "}
            {!editing && (
              <button
                onClick={() => { setEditing(true); addProject(); }}
                className="text-[var(--accent)] hover:underline cursor-pointer"
              >
                Add project
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {profile.projects.map((proj, index) => (
              <div
                key={index}
                className={`rounded-[var(--radius-md)] border border-[var(--border-color)] p-4 ${editing ? 'bg-[var(--bg-input)]' : 'bg-[var(--bg-card-hover)]'}`}
              >
                {editing ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Project #{index + 1}</span>
                      <button
                        onClick={() => removeProject(index)}
                        className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 cursor-pointer"
                      >
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-[var(--text-muted)] block mb-1">Project Name</label>
                        <input
                          type="text"
                          value={proj.name || ''}
                          onChange={(e) => updateProject(index, 'name', e.target.value)}
                          placeholder="e.g. E-Commerce Platform"
                          className="w-full px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[var(--text-muted)] block mb-1">Project URL</label>
                        <input
                          type="url"
                          value={proj.url || ''}
                          onChange={(e) => updateProject(index, 'url', e.target.value)}
                          placeholder="e.g. https://github.com/myproject"
                          className="w-full px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-xs text-[var(--text-muted)] block mb-1">Details / Description</label>
                        <textarea
                          value={proj.details || ''}
                          onChange={(e) => updateProject(index, 'details', e.target.value)}
                          placeholder="Describe your project, technologies used, etc."
                          rows="3"
                          className="w-full px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors resize-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-[var(--text-muted)] block mb-1">Start Date</label>
                          <input
                            type="date"
                            value={proj.startDate || ''}
                            onChange={(e) => updateProject(index, 'startDate', e.target.value)}
                            className="w-full px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-[var(--text-muted)] block mb-1">End Date</label>
                          <input
                            type="date"
                            value={proj.endDate || ''}
                            onChange={(e) => updateProject(index, 'endDate', e.target.value)}
                            className="w-full px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-[var(--radius-md)] bg-[var(--accent-subtle)] shrink-0">
                      <Briefcase size={18} className="text-[var(--accent)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{proj.name || 'Project'}</p>
                        {proj.url && (
                          <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline shrink-0">
                            <LinkIcon size={12} />
                          </a>
                        )}
                      </div>
                      {proj.details && <p className="text-sm text-[var(--text-secondary)] mt-1">{proj.details}</p>}
                      <div className="flex items-center gap-3 mt-1 text-xs text-[var(--text-placeholder)]">
                        {proj.startDate && (
                          <span>
                            {proj.startDate} — {proj.endDate || 'Present'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
