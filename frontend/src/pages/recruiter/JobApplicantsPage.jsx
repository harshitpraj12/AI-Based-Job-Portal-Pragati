import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Eye, UserCheck, UserX, Star, Mail, Sparkles } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import Modal from '../../components/Modal';
import { applicationService } from '../../services/applicationService';
import { resumeService } from '../../services/resumeService';
import { emailService } from '../../services/emailService';
import { aiService } from '../../services/aiService';
import { useNotifications } from '../../context/NotificationContext';
import toast from 'react-hot-toast';

export default function JobApplicantsPage() {
  const { notifyStatusUpdated } = useNotifications();
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emailModal, setEmailModal] = useState(null);
  const [emailForm, setEmailForm] = useState({ subject: '', message: '' });

  // AI Analysis states
  const [aiAnalysisModal, setAiAnalysisModal] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  useEffect(() => {
    applicationService.getApplicantsByJob(jobId)
      .then(res => setApplicants(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [jobId]);

  const updateStatus = async (applicationId, status) => {
    try {
      await applicationService.updateStatus(applicationId, status);
      toast.success(`Status updated to ${status}. Automated email sent.`);

      const applicant = applicants.find(a => a.applicationId === applicationId);
      notifyStatusUpdated({
        jobTitle: `Job #${jobId}`,
        candidateEmail: applicant?.email,
        candidateName: applicant?.candidateName,
        newStatus: status,
      });

      // Refresh
      const res = await applicationService.getApplicantsByJob(jobId);
      setApplicants(res.data || []);
    } catch (err) {
      toast.error(typeof err.response?.data === 'string' ? err.response.data : err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDownloadResume = async (candidateId) => {
    try {
      const res = await resumeService.downloadResume(candidateId);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error('Resume not available');
    }
  };

  const handleAiAnalysis = async (candidateId, matchScore, strengths, missingSkills, suggestions) => {
    setAiAnalysisModal(true);
    if (matchScore && strengths && strengths !== 'Analysis pending') {
      setAiResult({
        overallScore: matchScore,
        strength: strengths,
        weakness: missingSkills,
        suggessions: suggestions
      });
      setAiLoading(false);
    } else {
      setAiLoading(true);
      setAiResult(null);
      try {
        const res = await aiService.analyzeCandidateForJob(candidateId, jobId);
        setAiResult(res.data);
      } catch (err) {
        toast.error('AI Analysis failed');
        setAiAnalysisModal(false);
      } finally {
        setAiLoading(false);
      }
    }
  };

  const renderListOrText = (data) => {
    if (!data) return <li>No details available.</li>;
    if (Array.isArray(data)) {
      return data.map((item, index) => <li key={index}>{item}</li>);
    }
    if (typeof data === 'string') {
      const items = data.split(/[,\n]+/).map(item => item.replace(/^[-\*\s]+/, '').trim()).filter(Boolean);
      if (items.length > 1) {
        return items.map((item, index) => <li key={index}>{item}</li>);
      }
      return <li>{data}</li>;
    }
    return <li>{String(data)}</li>;
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    try {
      await emailService.sendEmail(emailModal.email, emailForm.subject, emailForm.message);
      toast.success('Email sent!');
      setEmailModal(null);
      setEmailForm({ subject: '', message: '' });
    } catch {
      toast.error('Failed to send email');
    }
  };

  return (
    <div className="space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors cursor-pointer">
        <ArrowLeft size={16} /> Back
      </button>

      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Applicants</h1>
        <p className="text-[var(--text-muted)] mt-1">Job ID: {jobId} • {applicants.length} applicant{applicants.length !== 1 && 's'}</p>
      </div>

      {loading ? (
        <LoadingSkeleton type="table" count={5} />
      ) : applicants.length === 0 ? (
        <EmptyState title="No applicants yet" description="No one has applied to this job yet." />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] border border-[var(--border-color)] shadow-[var(--shadow-sm)] overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border-color)]">
                  <th className="text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider px-6 py-3">Candidate</th>
                  <th className="text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider px-6 py-3">Email</th>
                  <th className="text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider px-6 py-3">AI Score</th>
                  <th className="text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider px-6 py-3">Strengths</th>
                  <th className="text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider px-6 py-3">Status</th>
                  <th className="text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((app) => (
                  <tr key={app.candidateId} className="border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--bg-card-hover)] transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-[var(--text-primary)]">{app.candidateName}</td>
                    <td className="px-6 py-4 text-sm text-[var(--text-muted)]">{app.email}</td>
                    <td className="px-6 py-4">
                      {app.matchScore ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-[var(--radius-full)] bg-[var(--accent-subtle)] text-[var(--accent)]">
                          <Star size={12} /> {app.matchScore}%
                        </span>
                      ) : (
                        <span className="text-xs text-[var(--text-placeholder)]">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-muted)] max-w-[200px] truncate">{app.strengths || '—'}</td>
                    <td className="px-6 py-4"><StatusBadge status={app.status} /></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleDownloadResume(app.candidateId)} className="p-2 rounded-[var(--radius-md)] text-[var(--text-muted)] hover:bg-[var(--accent-subtle)] hover:text-[var(--accent)] transition-colors cursor-pointer" title="Download Resume">
                          <Download size={16} />
                        </button>
                        <button onClick={() => setEmailModal(app)} className="p-2 rounded-[var(--radius-md)] text-[var(--text-muted)] hover:bg-[var(--info-light)] hover:text-[var(--info)] transition-colors cursor-pointer" title="Send Email">
                          <Mail size={16} />
                        </button>
                        <button onClick={() => handleAiAnalysis(app.candidateId, app.matchScore, app.strengths, app.missingSkills, app.suggestions)} className="p-2 rounded-[var(--radius-md)] text-[var(--text-muted)] hover:bg-[var(--accent-subtle)] hover:text-[var(--accent)] transition-colors cursor-pointer" title="AI Match Evaluation">
                          <Sparkles size={16} />
                        </button>
                        <button onClick={() => updateStatus(app.applicationId, 'SHORTLISTED')} className="p-2 rounded-[var(--radius-md)] text-[var(--text-muted)] hover:bg-[var(--warning-light)] hover:text-[var(--warning)] transition-colors cursor-pointer" title="Shortlist">
                          <UserCheck size={16} />
                        </button>
                        <button onClick={() => updateStatus(app.applicationId, 'HIRED')} className="p-2 rounded-[var(--radius-md)] text-[var(--text-muted)] hover:bg-[var(--success-light)] hover:text-[var(--success)] transition-colors cursor-pointer" title="Hire">
                          <Star size={16} />
                        </button>
                        <button onClick={() => updateStatus(app.applicationId, 'REJECTED')} className="p-2 rounded-[var(--radius-md)] text-[var(--text-muted)] hover:bg-[var(--danger-light)] hover:text-[var(--danger)] transition-colors cursor-pointer" title="Reject">
                          <UserX size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Email Modal */}
      <Modal isOpen={!!emailModal} onClose={() => setEmailModal(null)} title={`Email ${emailModal?.candidateName}`}>
        <form onSubmit={handleSendEmail} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[var(--text-primary)] mb-1.5 block">To</label>
            <input type="text" value={emailModal?.email || ''} readOnly className="w-full px-3 py-2.5 bg-[var(--bg-card-hover)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-sm text-[var(--text-muted)]" />
          </div>
          <div>
            <label className="text-sm font-medium text-[var(--text-primary)] mb-1.5 block">Subject</label>
            <input type="text" value={emailForm.subject} onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })} placeholder="Regarding your application..." className="w-full px-3 py-2.5 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors" />
          </div>
          <div>
            <label className="text-sm font-medium text-[var(--text-primary)] mb-1.5 block">Message</label>
            <textarea value={emailForm.message} onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })} rows={5} placeholder="Write your message..." className="w-full px-3 py-2.5 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors resize-none" />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setEmailModal(null)} className="px-4 py-2 text-sm font-medium border border-[var(--border-color)] rounded-[var(--radius-md)] text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium bg-[var(--accent)] text-white rounded-[var(--radius-md)] hover:bg-[var(--accent-hover)] transition-colors cursor-pointer">Send Email</button>
          </div>
        </form>
      </Modal>

      {/* AI Analysis Modal */}
      <Modal isOpen={!!aiAnalysisModal} onClose={() => setAiAnalysisModal(null)} title="AI Candidate Match Analysis">
        {aiLoading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="w-10 h-10 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-[var(--text-muted)] animate-pulse">Running advanced AI candidate evaluation...</p>
          </div>
        ) : aiResult ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center p-4 bg-[var(--bg-card-hover)] rounded-[var(--radius-lg)] border border-[var(--border-color)]">
              <span className="text-sm font-medium text-[var(--text-muted)]">Overall Match Score</span>
              <div className="relative flex items-center justify-center mt-3">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="var(--border-color)" strokeWidth="8" fill="transparent" />
                  <circle cx="48" cy="48" r="40" stroke="var(--accent)" strokeWidth="8" fill="transparent"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - (aiResult.overallScore || 0) / 100)} />
                </svg>
                <span className="absolute text-2xl font-bold text-[var(--text-primary)]">{aiResult.overallScore || 0}%</span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[var(--success)] flex items-center gap-1.5 mb-2">
                <span className="w-2 h-2 rounded-full bg-[var(--success)]" /> Key Strengths
              </h4>
              <ul className="space-y-1.5 text-sm text-[var(--text-secondary)] list-disc pl-5">
                {renderListOrText(aiResult.strength)}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[var(--danger)] flex items-center gap-1.5 mb-2">
                <span className="w-2 h-2 rounded-full bg-[var(--danger)]" /> Potential Gaps
              </h4>
              <ul className="space-y-1.5 text-sm text-[var(--text-secondary)] list-disc pl-5">
                {renderListOrText(aiResult.weakness)}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[var(--accent)] flex items-center gap-1.5 mb-2">
                <span className="w-2 h-2 rounded-full bg-[var(--accent)]" /> AI Suggestions
              </h4>
              <ul className="space-y-1.5 text-sm text-[var(--text-secondary)] list-disc pl-5">
                {renderListOrText(aiResult.suggessions)}
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-[var(--text-muted)]">No evaluation data available.</div>
        )}
      </Modal>
    </div>
  );
}
