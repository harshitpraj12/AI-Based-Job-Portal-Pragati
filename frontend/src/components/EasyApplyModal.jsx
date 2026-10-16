import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Building2,
  MapPin,
  DollarSign,
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  Send,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { applicationService } from '../services/applicationService';
import { resumeService } from '../services/resumeService';
import toast from 'react-hot-toast';

export default function EasyApplyModal({ isOpen, onClose, job, onSuccess }) {
  const { user, isAuthenticated } = useAuth();
  const { notifyJobApplied } = useNotifications();
  const navigate = useNavigate();

  // Form states
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');

  // Resume states
  const [resumeLoading, setResumeLoading] = useState(true);
  const [uploadedResume, setUploadedResume] = useState(null);
  const [uploadingNewResume, setUploadingNewResume] = useState(false);
  const [showUploader, setShowUploader] = useState(false);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Fetch candidate's current resume
  const fetchResume = useCallback(async () => {
    if (!isAuthenticated) return;
    setResumeLoading(true);
    try {
      const res = await resumeService.getMyResume();
      if (res.status === 200 && res.data) {
        setUploadedResume(res.data);
      } else {
        setUploadedResume(null);
      }
    } catch {
      setUploadedResume(null);
    } finally {
      setResumeLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setShowUploader(false);
      fetchResume();
    }
  }, [isOpen, fetchResume]);

  // Handle instant PDF upload within the modal
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF resumes are supported');
      return;
    }
    setUploadingNewResume(true);
    try {
      await resumeService.uploadResume(file);
      toast.success('Resume uploaded successfully!');
      setShowUploader(false);
      await fetchResume();
    } catch (err) {
      toast.error(err.response?.data || 'Failed to upload resume');
    } finally {
      setUploadingNewResume(false);
    }
  }, [fetchResume]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  const handlePreviewResume = async () => {
    try {
      const response = await resumeService.previewMyResume();
      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank');
    } catch {
      toast.error('Could not open resume preview');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!uploadedResume) {
      toast.error('Please upload your resume before submitting');
      setShowUploader(true);
      return;
    }

    setSubmitting(true);
    try {
      await applicationService.applyJob(job.id);
      setSubmitted(true);

      // Trigger real-time notifications for candidate and recruiter!
      notifyJobApplied({
        jobTitle: job.title,
        companyName: job.companyName || job.company?.companyName || 'Company',
        candidateName: user?.name || 'Applicant',
      });

      if (onSuccess) {
        onSuccess(job.id);
      }
    } catch (err) {
      const msg = typeof err.response?.data === 'string'
        ? err.response.data
        : err.response?.data?.message || 'Failed to submit application';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !job) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => (!submitting ? onClose() : null)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-xl bg-[var(--bg-card)] rounded-[var(--radius-xl)] shadow-2xl border border-[var(--border-color)] overflow-hidden z-10 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-5 border-b border-[var(--border-color)] flex items-start justify-between bg-[var(--bg-card-hover)]/40">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center gap-1">
                  <Sparkles size={12} /> Easy Apply
                </span>
                <span className="text-xs text-[var(--text-muted)]">Verified Application</span>
              </div>
              <h2 className="text-xl font-bold text-[var(--text-primary)] line-clamp-1">{job.title}</h2>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-[var(--text-muted)]">
                <span className="flex items-center gap-1 font-medium text-[var(--text-secondary)]">
                  <Building2 size={13} /> {job.companyName || job.company?.companyName || 'Company'}
                </span>
                {job.location && (
                  <span className="flex items-center gap-1">
                    <MapPin size={13} /> {job.location}
                  </span>
                )}
                {job.salary && (
                  <span className="flex items-center gap-1 font-semibold text-[var(--accent)]">
                    <DollarSign size={13} /> {job.salary}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={submitting}
              className="p-1.5 rounded-[var(--radius-md)] text-[var(--text-placeholder)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-5 flex-1">
            {submitted ? (
              /* Success Screen */
              <div className="text-center py-8 space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12 }}
                  className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto"
                >
                  <CheckCircle size={36} />
                </motion.div>

                <div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)]">Application Submitted!</h3>
                  <p className="text-sm text-[var(--text-muted)] mt-1.5 max-w-md mx-auto">
                    Your profile and resume were sent directly to{' '}
                    <strong className="text-[var(--text-primary)]">
                      {job.companyName || job.company?.companyName || 'the hiring team'}
                    </strong>
                    . You will receive real-time updates as your application progresses.
                  </p>
                </div>

                <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--bg-card-hover)]/70 border border-[var(--border-color)] text-left text-xs space-y-2 max-w-sm mx-auto">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Applied Position:</span>
                    <span className="font-semibold text-[var(--text-primary)]">{job.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Applicant:</span>
                    <span className="font-semibold text-[var(--text-primary)]">{user?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Resume:</span>
                    <span className="font-semibold text-[var(--accent)]">{uploadedResume?.fileName || 'Attached'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Status:</span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 font-semibold text-[10px]">
                      APPLIED (Under Review)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-3">
                  <button
                    onClick={() => {
                      onClose();
                      navigate('/candidate/applications');
                    }}
                    className="px-5 py-2.5 bg-[var(--accent)] text-white text-sm font-semibold rounded-[var(--radius-md)] hover:bg-[var(--accent-hover)] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    View My Applications <ArrowRight size={15} />
                  </button>
                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 border border-[var(--border-color)] text-sm font-medium rounded-[var(--radius-md)] hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              /* Application Form */
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* 1. Contact Information */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">
                    1. Contact Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={user?.name || ''}
                        disabled
                        className="w-full px-3.5 py-2.5 bg-[var(--bg-card-hover)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] opacity-80 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full px-3.5 py-2.5 bg-[var(--bg-card-hover)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] opacity-80 cursor-not-allowed"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +1 (555) 000-1234"
                        className="w-full px-3.5 py-2.5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Resume Section */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                      2. Resume Attachment
                    </h4>
                    {uploadedResume && !showUploader && (
                      <button
                        type="button"
                        onClick={() => setShowUploader(true)}
                        className="text-xs text-[var(--accent)] hover:underline cursor-pointer"
                      >
                        Change / Upload new
                      </button>
                    )}
                  </div>

                  {resumeLoading ? (
                    <div className="p-4 rounded-[var(--radius-md)] bg-[var(--bg-card-hover)] flex items-center justify-center gap-2 text-xs text-[var(--text-muted)]">
                      <Loader2 size={16} className="animate-spin text-[var(--accent)]" /> Checking uploaded resume...
                    </div>
                  ) : uploadedResume && !showUploader ? (
                    <div className="p-3.5 rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--bg-card-hover)]/40 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-[var(--radius-sm)] bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center shrink-0">
                          <FileText size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[var(--text-primary)] truncate max-w-[240px] sm:max-w-[300px]">
                            {uploadedResume.fileName || 'Resume.pdf'}
                          </p>
                          <p className="text-[11px] text-[var(--text-muted)]">
                            {(uploadedResume.fileSize / 1024).toFixed(1)} KB &bull; Verified for ATS Analysis
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handlePreviewResume}
                        className="px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] rounded-[var(--radius-sm)] hover:bg-[var(--accent-subtle)] flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Eye size={13} /> Preview
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-[var(--radius-lg)] p-5 text-center cursor-pointer transition-all ${
                          isDragActive
                            ? 'border-[var(--accent)] bg-[var(--accent-subtle)]/40'
                            : 'border-[var(--border-color)] hover:border-[var(--accent)]/50 bg-[var(--bg-card)]'
                        }`}
                      >
                        <input {...getInputProps()} />
                        {uploadingNewResume ? (
                          <div className="flex flex-col items-center justify-center gap-2 py-3">
                            <Loader2 size={24} className="animate-spin text-[var(--accent)]" />
                            <p className="text-xs text-[var(--text-muted)]">Uploading & parsing PDF resume...</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center gap-2 py-2">
                            <div className="w-10 h-10 rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center">
                              <Upload size={18} />
                            </div>
                            <p className="text-xs font-semibold text-[var(--text-primary)]">
                              Click or drag and drop your PDF resume here
                            </p>
                            <p className="text-[11px] text-[var(--text-muted)]">
                              Max file size 10MB &bull; Required for ATS match
                            </p>
                          </div>
                        )}
                      </div>

                      {uploadedResume && showUploader && (
                        <div className="mt-2 text-right">
                          <button
                            type="button"
                            onClick={() => setShowUploader(false)}
                            className="text-xs text-[var(--text-muted)] hover:underline"
                          >
                            Cancel and use existing resume ({uploadedResume.fileName})
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 3. Note / Pitch */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                    3. Note to Hiring Team (Optional)
                  </h4>
                  <textarea
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Introduce yourself or highlight why you are a great match for this role..."
                    className="w-full px-3.5 py-2.5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)] focus:outline-none focus:border-[var(--accent)] transition-colors resize-none"
                  />
                </div>

                {/* Submit Actions */}
                <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between">
                  <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                    <Sparkles size={13} className="text-[var(--accent)]" /> Instant notification sent to recruiter
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={submitting}
                      className="px-4 py-2.5 border border-[var(--border-color)] text-xs font-medium text-[var(--text-secondary)] rounded-[var(--radius-md)] hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || (!uploadedResume && !uploadingNewResume)}
                      className="px-5 py-2.5 bg-[var(--accent)] text-white text-xs font-semibold rounded-[var(--radius-md)] hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-60 flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={14} className="animate-spin" /> Submitting...
                        </>
                      ) : (
                        <>
                          <Send size={13} /> Submit Easy Apply
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
