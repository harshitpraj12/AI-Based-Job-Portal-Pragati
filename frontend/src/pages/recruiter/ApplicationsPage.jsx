import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Download, Mail, Sparkles, Eye, User, CheckSquare } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import Modal from '../../components/Modal';
import { applicationService } from '../../services/applicationService';
import { resumeService } from '../../services/resumeService';
import { emailService } from '../../services/emailService';
import { aiService } from '../../services/aiService';
import { formatDate } from '../../utils/helpers';
import { useNotifications } from '../../context/NotificationContext';
import toast from 'react-hot-toast';

export default function ApplicationsPage() {
  const { notifyStatusUpdated } = useNotifications();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Unified Details Modal
  const [selectedApp, setSelectedApp] = useState(null);

  // Email form state inside details modal
  const [emailForm, setEmailForm] = useState({ subject: '', message: '' });
  const [sendingEmail, setSendingEmail] = useState(false);

  // AI Analysis states inside details modal
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  const fetchApplications = () => {
    setLoading(true);
    applicationService.getAllApplications()
      .then(res => setApplications(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusChange = async (appId, candidateEmail, newStatus) => {
    try {
      await applicationService.updateStatus(appId, newStatus);
      toast.success(`Status updated to ${newStatus}. Automated email sent to ${candidateEmail}`);
      
      const app = applications.find(a => a.id === appId);
      notifyStatusUpdated({
        jobTitle: app?.job?.title || 'Job Application',
        companyName: app?.job?.company?.companyName || 'Company',
        candidateEmail: candidateEmail || app?.candidate?.email,
        candidateName: app?.candidate?.name,
        newStatus,
      });

      // Update applications list
      const res = await applicationService.getAllApplications();
      setApplications(res.data || []);

      // Also update currently selected application status in the modal
      if (selectedApp && selectedApp.id === appId) {
        setSelectedApp(prev => ({ ...prev, status: newStatus }));
      }
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

  const handleAiAnalysis = async (candidateId, jobId) => {
    if (!candidateId || !jobId) {
      toast.error('Cannot run AI Analysis: Missing candidate or job reference');
      return;
    }
    setAiLoading(true);
    setAiResult(null);
    try {
      const res = await aiService.analyzeCandidateForJob(candidateId, jobId);
      setAiResult(res.data);
    } catch (err) {
      toast.error('AI Analysis failed');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!emailForm.subject.trim() || !emailForm.message.trim()) {
      toast.error('Please enter both subject and message');
      return;
    }
    setSendingEmail(true);
    try {
      await emailService.sendEmail(selectedApp.candidate?.email, emailForm.subject, emailForm.message);
      toast.success('Custom email sent successfully!');
      setEmailForm({ subject: '', message: '' });
    } catch {
      toast.error('Failed to send email');
    } finally {
      setSendingEmail(false);
    }
  };

  const openDetailsModal = (app) => {
    setSelectedApp(app);
    setEmailForm({ subject: '', message: '' });
    
    // Automatically load saved AI analysis if present on the application entity
    if (app.resumeAnalysis) {
      setAiResult({
        overallScore: app.resumeAnalysis.matchScore,
        strength: app.resumeAnalysis.strength,
        weakness: app.resumeAnalysis.missingSkills,
        suggessions: app.resumeAnalysis.suggestions
      });
    } else {
      setAiResult(null);
    }
    setAiLoading(false);
  };

  // Helper to render array elements or format text strings into bullet points nicely
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">All Applications</h1>
        <p className="text-[var(--text-muted)] mt-1">View and manage candidate applications across your jobs</p>
      </div>

      {loading ? (
        <LoadingSkeleton type="table" count={5} />
      ) : applications.length === 0 ? (
        <EmptyState icon={FileText} title="No applications" description="Applications will appear here when candidates apply to your jobs." />
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
                  <th className="text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider px-6 py-3">Job</th>
                  <th className="text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider px-6 py-3">Applied</th>
                  <th className="text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider px-6 py-3">Status</th>
                  <th className="text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--bg-card-hover)] transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-[var(--text-primary)]">{app.candidate?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-[var(--text-muted)]">{app.job?.title || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-[var(--text-muted)]">{formatDate(app.appliedAt)}</td>
                    <td className="px-6 py-4"><StatusBadge status={app.status} /></td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openDetailsModal(app)}
                        className="px-3.5 py-1.5 bg-[var(--accent-subtle)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white text-xs font-semibold rounded-[var(--radius-md)] transition-colors cursor-pointer"
                      >
                        Show Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Unified Details Modal */}
      <Modal 
        isOpen={!!selectedApp} 
        onClose={() => setSelectedApp(null)} 
        title={`Application Details: ${selectedApp?.candidate?.name || 'Candidate'}`}
        size="lg"
      >
        {selectedApp && (
          <div className="grid md:grid-cols-2 gap-6 max-h-[80vh] overflow-y-auto pr-2">
            {/* ─── LEFT COLUMN: Info, Resume & Status ─── */}
            <div className="space-y-6">
              {/* Profile details */}
              <div className="bg-[var(--bg-card-hover)] p-4 rounded-[var(--radius-lg)] border border-[var(--border-color)] space-y-3">
                <h3 className="text-sm font-semibold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
                  <User size={16} className="text-[var(--accent)]" /> Candidate Information
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Full Name:</span>
                    <span className="font-medium text-[var(--text-primary)]">{selectedApp.candidate?.name || 'N/A'}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Email Address:</span>
                    <span className="font-medium text-[var(--text-primary)]">{selectedApp.candidate?.email || 'N/A'}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Applied Job:</span>
                    <span className="font-medium text-[var(--text-primary)]">{selectedApp.job?.title || 'N/A'}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Applied Date:</span>
                    <span className="font-medium text-[var(--text-primary)]">{formatDate(selectedApp.appliedAt)}</span>
                  </p>
                </div>
              </div>

              {/* Status Section */}
              <div className="bg-[var(--bg-card-hover)] p-4 rounded-[var(--radius-lg)] border border-[var(--border-color)] space-y-3">
                <h3 className="text-sm font-semibold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
                  <CheckSquare size={16} className="text-[var(--accent)]" /> Update Status
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--text-muted)]">Current Status:</span>
                    <StatusBadge status={selectedApp.status} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Change Status</label>
                    <select
                      value={selectedApp.status}
                      onChange={(e) => handleStatusChange(selectedApp.id, selectedApp.candidate?.email, e.target.value)}
                      className="w-full px-3 py-2 text-sm font-medium rounded-[var(--radius-md)] bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] cursor-pointer"
                    >
                      <option value="APPLIED">APPLIED</option>
                      <option value="SHORTLISTED">SHORTLISTED</option>
                      <option value="HIRED">HIRED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] italic">
                    * Updating status sends an automated notification email to the candidate.
                  </p>
                </div>
              </div>

              {/* Resume Options */}
              <div className="bg-[var(--bg-card-hover)] p-4 rounded-[var(--radius-lg)] border border-[var(--border-color)] space-y-3">
                <h3 className="text-sm font-semibold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
                  <FileText size={16} className="text-[var(--accent)]" /> Resume Options
                </h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleDownloadResume(selectedApp.candidate?.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-[var(--accent)] text-white text-sm font-medium rounded-[var(--radius-md)] hover:bg-[var(--accent-hover)] transition-colors cursor-pointer"
                  >
                    <Download size={16} /> Download Resume
                  </button>
                </div>
              </div>
            </div>

            {/* ─── RIGHT COLUMN: Email & AI Analyse ─── */}
            <div className="space-y-6">
              {/* Send Custom Email Form */}
              <div className="bg-[var(--bg-card-hover)] p-4 rounded-[var(--radius-lg)] border border-[var(--border-color)] space-y-3">
                <h3 className="text-sm font-semibold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
                  <Mail size={16} className="text-[var(--accent)]" /> Send Custom Email
                </h3>
                <form onSubmit={handleSendEmail} className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Subject</label>
                    <input
                      type="text"
                      value={emailForm.subject}
                      onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                      placeholder="e.g. Schedule Interview..."
                      className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Message</label>
                    <textarea
                      value={emailForm.message}
                      onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                      rows={3}
                      placeholder="Type custom message to candidate..."
                      className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sendingEmail}
                    className="w-full py-2 bg-[var(--info)] text-white text-sm font-medium rounded-[var(--radius-md)] hover:bg-[var(--info-hover)] transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {sendingEmail ? 'Sending...' : 'Send Email'}
                  </button>
                </form>
              </div>

              {/* AI Resume Evaluation */}
              <div className="bg-[var(--bg-card-hover)] p-4 rounded-[var(--radius-lg)] border border-[var(--border-color)] space-y-3">
                <h3 className="text-sm font-semibold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
                  <Sparkles size={16} className="text-[var(--accent)]" /> AI Resume Evaluation
                </h3>
                
                {aiLoading && (
                  <div className="flex flex-col items-center justify-center py-4 space-y-2">
                    <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-[var(--text-muted)] animate-pulse">Running advanced AI candidate evaluation...</span>
                  </div>
                )}

                {!aiLoading && (
                  <div className="space-y-4">
                    {aiResult ? (
                      <div className="space-y-4 pt-2">
                        <div className="flex items-center gap-3">
                          <div className="relative flex items-center justify-center shrink-0">
                            <svg className="w-16 h-16 transform -rotate-90">
                              <circle cx="32" cy="32" r="26" stroke="var(--border-color)" strokeWidth="4" fill="transparent" />
                              <circle cx="32" cy="32" r="26" stroke="var(--accent)" strokeWidth="4" fill="transparent"
                                strokeDasharray={2 * Math.PI * 26}
                                strokeDashoffset={2 * Math.PI * 26 * (1 - (aiResult.overallScore || 0) / 100)} />
                            </svg>
                            <span className="absolute text-sm font-bold text-[var(--text-primary)]">{aiResult.overallScore || 0}%</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[var(--text-primary)]">Overall Match Score</p>
                            <p className="text-xs text-[var(--text-muted)]">Candidate's fit for this job requirement</p>
                          </div>
                        </div>

                        <div className="space-y-2.5 max-h-[200px] overflow-y-auto pr-1">
                          <div>
                            <span className="text-xs font-semibold text-[var(--success)] block mb-0.5">Key Strengths</span>
                            <ul className="text-xs text-[var(--text-secondary)] list-disc pl-4 space-y-0.5">
                              {renderListOrText(aiResult.strength)}
                            </ul>
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-[var(--danger)] block mb-0.5">Potential Gaps</span>
                            <ul className="text-xs text-[var(--text-secondary)] list-disc pl-4 space-y-0.5">
                              {renderListOrText(aiResult.weakness)}
                            </ul>
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-[var(--accent)] block mb-0.5">AI Suggestions</span>
                            <ul className="text-xs text-[var(--text-secondary)] list-disc pl-4 space-y-0.5">
                              {renderListOrText(aiResult.suggessions)}
                            </ul>
                          </div>
                        </div>

                        <button
                          onClick={() => handleAiAnalysis(selectedApp.candidate?.id, selectedApp.job?.id)}
                          className="w-full mt-2 py-2 border border-[var(--accent)] text-[var(--accent)] text-xs font-medium rounded-[var(--radius-md)] hover:bg-[var(--accent-subtle)] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles size={14} /> Re-run AI Analysis
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-4 space-y-3">
                        <p className="text-sm text-[var(--text-muted)]">No AI analysis result available for this candidate yet.</p>
                        <button
                          onClick={() => handleAiAnalysis(selectedApp.candidate?.id, selectedApp.job?.id)}
                          className="w-full py-2 bg-[var(--accent)] text-white text-sm font-medium rounded-[var(--radius-md)] hover:bg-[var(--accent-hover)] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Sparkles size={16} /> Run AI Analysis
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
