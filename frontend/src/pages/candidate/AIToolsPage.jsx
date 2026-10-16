import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  FileSearch,
  MessageSquare,
  Lightbulb,
  Loader2,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Star,
  XCircle,
  Building2,
  ExternalLink,
  Copy,
  Check,
  Code,
  Users,
  Terminal,
  HelpCircle,
  RefreshCw,
  Send,
  UploadCloud,
} from 'lucide-react';
import { aiService } from '../../services/aiService';
import { jobService } from '../../services/jobService';
import { useNotifications } from '../../context/NotificationContext';
import EasyApplyModal from '../../components/EasyApplyModal';
import toast from 'react-hot-toast';

export default function AIToolsPage() {
  const { notifyAIToolsUsed } = useNotifications();

  // State
  const [resumeFeedback, setResumeFeedback] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [interviewQuestions, setInterviewQuestions] = useState(null);

  // Available jobs for selector
  const [availableJobs, setAvailableJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [customJobId, setCustomJobId] = useState('');

  // Loading states
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // Interview Questions UI state
  const [questionTab, setQuestionTab] = useState('all'); // 'all' | 'technical' | 'hr' | 'coding'
  const [expandedTips, setExpandedTips] = useState({});
  const [practicedQuestions, setPracticedQuestions] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  // Easy Apply Modal state for recommendations
  const [applyModalJob, setApplyModalJob] = useState(null);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());

  // Load available jobs for the interview question selector
  useEffect(() => {
    jobService.getAllJobs()
      .then((res) => {
        const jobs = res.data || [];
        setAvailableJobs(jobs);
        if (jobs.length > 0) {
          setSelectedJobId(String(jobs[0].id));
        }
      })
      .catch(() => {});
  }, []);

  const getErrorMessage = (err) => {
    const status = err.response?.status;
    const data = err.response?.data;
    const message = typeof data === 'string' ? data : data?.message || data?.error;
    if (status === 401) return 'Please login again to use AI tools';
    if (status === 403) return 'You need a Candidate account to use this feature';
    if (typeof message === 'string' && (message.toLowerCase().includes('resume not found') || message.toLowerCase().includes('resume not available'))) {
      return 'Please upload your resume first in the Resume section';
    }
    if (message && typeof message === 'string') return message;
    if (status === 500) return 'AI service encountered an issue. Please try again in a moment.';
    return 'Something went wrong. Please check your network connection and try again.';
  };

  // 1. Resume Feedback Handler
  const handleResumeFeedback = async () => {
    setLoadingFeedback(true);
    try {
      const res = await aiService.getResumeFeedback();
      setResumeFeedback(res.data);
      const score = res.data?.overallScore || 80;
      notifyAIToolsUsed({
        toolName: 'AI Resume Feedback',
        summary: `Your resume analysis is complete with an ATS score of ${score}/100.`,
      });
      toast.success('Resume analysis ready!');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoadingFeedback(false);
    }
  };

  // 2. Job Recommendations Handler
  const handleRecommendations = async () => {
    setLoadingRecs(true);
    try {
      const res = await aiService.getRecommendedJobs();
      setRecommendations(res.data);
      const count = Array.isArray(res.data) ? res.data.length : 0;
      notifyAIToolsUsed({
        toolName: 'Job Recommendations',
        summary: `Found ${count} recommended job matches based on your skills.`,
      });
      toast.success(`Found ${count} matching opportunities!`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoadingRecs(false);
    }
  };

  // 3. Interview Questions Handler
  const handleInterviewQuestions = async () => {
    const targetId = customJobId.trim() || selectedJobId;
    if (!targetId) {
      toast.error('Please select or enter a Job ID');
      return;
    }
    setLoadingQuestions(true);
    try {
      const res = await aiService.getInterviewQuestions(targetId);
      setInterviewQuestions(res.data);
      const selectedJob = availableJobs.find((j) => String(j.id) === String(targetId));
      notifyAIToolsUsed({
        toolName: 'Interview Question Generator',
        summary: `Curated practice questions generated for ${selectedJob?.title || `Job #${targetId}`}.`,
      });
      toast.success('Interview questions generated successfully!');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoadingQuestions(false);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const togglePracticed = (key) => {
    setPracticedQuestions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleTip = (key) => {
    setExpandedTips((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // ==========================================
  // RENDERERS
  // ==========================================

  // 1. Render Resume Feedback
  const renderResumeFeedback = (data) => {
    if (!data) return null;

    if (typeof data === 'string') {
      return (
        <div className="p-4 rounded-[var(--radius-md)] bg-[var(--bg-card)] border border-[var(--border-color)]">
          <pre className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap">{data}</pre>
        </div>
      );
    }

    const getArrayData = (val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val;
      if (typeof val === 'string') return [val];
      return [];
    };

    const strengths = getArrayData(data.strength || data.strengths);
    const weaknesses = getArrayData(data.weakness || data.weaknesses);
    const suggestions = getArrayData(data.suggessions || data.suggestions || data.improvements);
    const score = data.overallScore ?? 80;

    const getScoreColor = (sc) => {
      if (sc >= 85) return { text: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'Excellent ATS Match' };
      if (sc >= 70) return { text: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Strong Profile' };
      return { text: 'text-amber-500', bg: 'bg-amber-500/10', label: 'Needs Optimization' };
    };

    const scoreMeta = getScoreColor(score);

    return (
      <div className="space-y-5">
        {/* Top Score & Summary Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className={`sm:col-span-1 p-5 rounded-[var(--radius-lg)] ${scoreMeta.bg} border border-current/20 flex flex-col items-center justify-center text-center`}>
            <div className="relative flex items-center justify-center">
              <span className={`text-4xl font-extrabold ${scoreMeta.text}`}>{score}</span>
              <span className="text-sm font-semibold text-[var(--text-muted)] ml-1">/100</span>
            </div>
            <p className="text-xs font-bold uppercase tracking-wider mt-2 text-[var(--text-primary)]">
              {scoreMeta.label}
            </p>
          </div>

          <div className="sm:col-span-2 p-5 rounded-[var(--radius-lg)] bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col justify-center">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
              Executive Evaluation
            </h4>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {data.summary ||
                'Your resume shows a strong technical foundation with clear potential. Focus on adding quantifiable project metrics and cloud infrastructure keywords to increase recruiter conversion.'}
            </p>
          </div>
        </div>

        {/* Strengths */}
        {strengths.length > 0 && (
          <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--bg-card)] border border-[var(--border-color)]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5 mb-3">
              <CheckCircle size={15} /> Key Strengths ({strengths.length})
            </h4>
            <ul className="space-y-2">
              {strengths.map((s, i) => (
                <li key={i} className="text-sm text-[var(--text-secondary)] flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Weaknesses / Gaps */}
        {weaknesses.length > 0 && (
          <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--bg-card)] border border-[var(--border-color)]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5 mb-3">
              <AlertCircle size={15} /> Areas for Improvement ({weaknesses.length})
            </h4>
            <ul className="space-y-2">
              {weaknesses.map((w, i) => (
                <li key={i} className="text-sm text-[var(--text-secondary)] flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actionable Suggestions */}
        {suggestions.length > 0 && (
          <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--bg-card)] border border-[var(--border-color)]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--accent)] flex items-center gap-1.5 mb-3">
              <Lightbulb size={15} /> Actionable Next Steps ({suggestions.length})
            </h4>
            <ul className="space-y-2.5">
              {suggestions.map((s, i) => (
                <li key={i} className="text-sm text-[var(--text-secondary)] flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() =>
              copyToClipboard(
                `Resume Score: ${score}/100\n\nStrengths:\n${strengths.map((s) => '- ' + s).join('\n')}\n\nSuggestions:\n${suggestions.map((s) => '- ' + s).join('\n')}`,
                'feedback-all'
              )
            }
            className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] flex items-center gap-1 cursor-pointer"
          >
            {copiedId === 'feedback-all' ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
            {copiedId === 'feedback-all' ? 'Copied' : 'Copy Analysis'}
          </button>

          <Link
            to="/candidate/resume"
            className="text-xs text-[var(--accent)] hover:underline flex items-center gap-1 font-medium"
          >
            Update Resume in Resume Section &rarr;
          </Link>
        </div>
      </div>
    );
  };

  // 2. Render Job Recommendations
  const renderRecommendations = (data) => {
    if (!data) return null;

    let recList = [];
    if (Array.isArray(data)) {
      recList = data;
    } else if (data.recommendations && Array.isArray(data.recommendations)) {
      recList = data.recommendations;
    }

    if (recList.length === 0) {
      return (
        <div className="p-6 text-center text-sm text-[var(--text-muted)]">
          No matching jobs found right now. Check back soon or explore the Browse Jobs section.
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pb-1">
          <span>Found {recList.length} customized job matches based on your background</span>
          <Link to="/candidate/jobs" className="text-[var(--accent)] hover:underline font-medium">
            Browse All Jobs &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {recList.map((rec, i) => {
            const jobId = rec.jobId || rec.id;
            const title = rec.jobTitle || rec.title || 'Recommended Position';
            const company = rec.company || rec.companyName || 'Top Tech Company';
            const matchScore = rec.matchScore || rec.score || 85;
            const isApplied = appliedJobIds.has(jobId);

            // Construct job payload for EasyApplyModal
            const jobData = {
              id: jobId,
              title,
              companyName: company,
              location: rec.location || 'Remote / Hybrid',
              salary: rec.salary || '$95,000 - $130,000',
            };

            return (
              <motion.div
                key={jobId || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-5 rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--accent)]/40 hover:shadow-md transition-all flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-base font-bold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">
                        <Link to={`/jobs/${jobId}`}>{title}</Link>
                      </h4>
                      <p className="text-xs text-[var(--text-muted)] flex items-center gap-1.5 mt-1 font-medium">
                        <Building2 size={13} className="text-[var(--text-placeholder)]" /> {company}
                      </p>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0">
                      {matchScore}% Match
                    </span>
                  </div>

                  {rec.reason && (
                    <div className="mt-3 p-3 rounded-[var(--radius-md)] bg-[var(--bg-card-hover)]/70 text-xs text-[var(--text-secondary)] leading-relaxed">
                      <strong className="text-[var(--text-primary)] font-semibold">Why you match: </strong>
                      {rec.reason}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)]">
                  <Link
                    to={`/jobs/${jobId}`}
                    className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] flex items-center gap-1 font-medium transition-colors"
                  >
                    View Job Details <ExternalLink size={12} />
                  </Link>

                  {isApplied ? (
                    <span className="px-4 py-2 bg-emerald-500/10 text-emerald-500 text-xs font-semibold rounded-[var(--radius-md)] flex items-center gap-1.5 border border-emerald-500/20">
                      <CheckCircle size={14} /> Applied
                    </span>
                  ) : (
                    <button
                      onClick={() => setApplyModalJob(jobData)}
                      className="px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold rounded-[var(--radius-md)] shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles size={13} /> Easy Apply
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  // 3. Render Interview Questions in Categorized Format
  const renderInterviewQuestions = (data) => {
    if (!data) return null;

    // Normalization
    let technical = [];
    let hr = [];
    let coding = [];

    if (data.technicalQuestions && Array.isArray(data.technicalQuestions)) {
      technical = data.technicalQuestions;
    }
    if (data.hrQuestions && Array.isArray(data.hrQuestions)) {
      hr = data.hrQuestions;
    }
    if (data.codingQuestions && Array.isArray(data.codingQuestions)) {
      coding = data.codingQuestions;
    }

    // Fallback if returned as raw array of strings or objects
    if (technical.length === 0 && hr.length === 0 && coding.length === 0) {
      const allQ = Array.isArray(data) ? data : data.questions || [];
      if (Array.isArray(allQ) && allQ.length > 0) {
        technical = allQ.map((q) => (typeof q === 'string' ? q : q.question || JSON.stringify(q)));
      }
    }

    const allQuestions = [
      ...technical.map((q, idx) => ({ id: `tech-${idx}`, text: q, category: 'Technical Architecture', type: 'technical' })),
      ...hr.map((q, idx) => ({ id: `hr-${idx}`, text: q, category: 'HR & Behavioral', type: 'hr' })),
      ...coding.map((q, idx) => ({ id: `code-${idx}`, text: q, category: 'Coding & System Design', type: 'coding' })),
    ];

    if (allQuestions.length === 0) {
      return (
        <div className="p-6 text-center text-sm text-[var(--text-muted)]">
          No questions generated. Please verify the Job ID and try again.
        </div>
      );
    }

    const filteredQuestions = allQuestions.filter((q) => {
      if (questionTab === 'all') return true;
      return q.type === questionTab;
    });

    const practicedCount = Object.values(practicedQuestions).filter(Boolean).length;

    const copyAllQuestions = () => {
      const fullText = [
        '=== TECHNICAL QUESTIONS ===',
        ...technical.map((q, i) => `${i + 1}. ${q}`),
        '',
        '=== HR & BEHAVIORAL QUESTIONS ===',
        ...hr.map((q, i) => `${i + 1}. ${q}`),
        '',
        '=== CODING & SYSTEM DESIGN ===',
        ...coding.map((q, i) => `${i + 1}. ${q}`),
      ].join('\n');
      copyToClipboard(fullText, 'all-questions');
    };

    return (
      <div className="space-y-4">
        {/* Progress & Quick Stats */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-[var(--radius-lg)] bg-[var(--bg-card)] border border-[var(--border-color)]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[var(--text-primary)]">
                Interview Readiness Tracker
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[var(--accent-subtle)] text-[var(--accent)]">
                {practicedCount} / {allQuestions.length} Practiced
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Mark off questions as you prepare answers.
            </p>
          </div>

          <button
            onClick={copyAllQuestions}
            className="px-3 py-1.5 border border-[var(--border-color)] hover:border-[var(--accent)] text-xs font-medium rounded-[var(--radius-md)] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copiedId === 'all-questions' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            {copiedId === 'all-questions' ? 'Copied All' : 'Copy All Questions'}
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-[var(--border-color)] pb-3">
          <button
            onClick={() => setQuestionTab('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              questionTab === 'all'
                ? 'bg-[var(--accent)] text-white shadow-sm'
                : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
            }`}
          >
            All Questions ({allQuestions.length})
          </button>
          <button
            onClick={() => setQuestionTab('technical')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              questionTab === 'technical'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
            }`}
          >
            <Code size={13} /> Technical ({technical.length})
          </button>
          <button
            onClick={() => setQuestionTab('hr')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              questionTab === 'hr'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
            }`}
          >
            <Users size={13} /> HR & Behavioral ({hr.length})
          </button>
          <button
            onClick={() => setQuestionTab('coding')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              questionTab === 'coding'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
            }`}
          >
            <Terminal size={13} /> Coding / Architecture ({coding.length})
          </button>
        </div>

        {/* Questions Grid */}
        <div className="space-y-3">
          {filteredQuestions.map((q, idx) => {
            const isPracticed = !!practicedQuestions[q.id];
            const isTipExpanded = !!expandedTips[q.id];

            return (
              <div
                key={q.id}
                className={`p-4 rounded-[var(--radius-lg)] border transition-all ${
                  isPracticed
                    ? 'border-emerald-500/40 bg-emerald-500/5 opacity-80'
                    : 'border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--accent)]/30'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <span
                      onClick={() => togglePracticed(q.id)}
                      title="Toggle practiced status"
                      className={`w-6 h-6 rounded-[var(--radius-sm)] flex items-center justify-center shrink-0 mt-0.5 cursor-pointer text-xs font-bold transition-all ${
                        isPracticed
                          ? 'bg-emerald-500 text-white'
                          : 'bg-[var(--bg-card-hover)] text-[var(--text-muted)] hover:bg-[var(--accent-subtle)] hover:text-[var(--accent)]'
                      }`}
                    >
                      {isPracticed ? <Check size={14} /> : idx + 1}
                    </span>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            q.type === 'technical'
                              ? 'bg-blue-500/10 text-blue-500'
                              : q.type === 'hr'
                              ? 'bg-purple-500/10 text-purple-500'
                              : 'bg-emerald-500/10 text-emerald-500'
                          }`}
                        >
                          {q.category}
                        </span>
                        {isPracticed && (
                          <span className="text-[10px] font-semibold text-emerald-500">
                            &bull; Practiced
                          </span>
                        )}
                      </div>

                      <p
                        className={`text-sm font-medium leading-relaxed ${
                          isPracticed ? 'text-[var(--text-secondary)] line-through decoration-emerald-500/40' : 'text-[var(--text-primary)]'
                        }`}
                      >
                        {q.text}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => toggleTip(q.id)}
                      className="p-1.5 rounded-[var(--radius-md)] text-[var(--text-placeholder)] hover:text-[var(--accent)] hover:bg-[var(--accent-subtle)] transition-colors cursor-pointer"
                      title="Key Talking Points & Tips"
                    >
                      <HelpCircle size={16} />
                    </button>
                    <button
                      onClick={() => copyToClipboard(q.text, q.id)}
                      className="p-1.5 rounded-[var(--radius-md)] text-[var(--text-placeholder)] hover:text-[var(--accent)] hover:bg-[var(--accent-subtle)] transition-colors cursor-pointer"
                      title="Copy question"
                    >
                      {copiedId === q.id ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                {/* Expandable Model Answer Guide */}
                <AnimatePresence>
                  {isTipExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pt-3 border-t border-[var(--border-color)] text-xs text-[var(--text-secondary)] bg-[var(--bg-card-hover)]/40 p-3 rounded-[var(--radius-md)] space-y-1"
                    >
                      <p className="font-semibold text-[var(--accent)] flex items-center gap-1">
                        <Lightbulb size={13} /> Preparation Guide / STAR Points:
                      </p>
                      <ul className="list-disc list-inside space-y-1 pl-1 text-[var(--text-muted)]">
                        <li>Structure response: Situation &rarr; Task &rarr; Action taken &rarr; Measurable result.</li>
                        <li>Highlight relevant technologies, trade-offs evaluated, and lessons learned.</li>
                        <li>Be ready to discuss edge cases, scale constraints, and security implications.</li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const tools = [
    {
      id: 'feedback',
      title: 'Resume Feedback & ATS Analysis',
      desc: 'Get a comprehensive AI breakdown of your resume strengths, gaps, and an ATS score.',
      icon: FileSearch,
      color: 'accent',
      loading: loadingFeedback,
      action: handleResumeFeedback,
      result: resumeFeedback,
      renderResult: renderResumeFeedback,
      buttonText: 'Analyze Resume',
    },
    {
      id: 'recommendations',
      title: 'Smart Job Recommendations',
      desc: 'Discover matching opportunities tailored to your parsed resume with direct 1-click Easy Apply.',
      icon: Lightbulb,
      color: 'info',
      loading: loadingRecs,
      action: handleRecommendations,
      result: recommendations,
      renderResult: renderRecommendations,
      buttonText: 'Find Matches',
    },
  ];

  return (
    <div className="max-w-4xl space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] flex items-center gap-2.5">
          <div className="p-2 rounded-[var(--radius-md)] bg-[var(--accent-subtle)] text-[var(--accent)]">
            <Sparkles size={24} />
          </div>
          AI Career Suite
        </h1>
        <p className="text-[var(--text-muted)] mt-1.5">
          Leverage cutting-edge LLMs and ATS analysis to tailor your job search and ace interviews.
        </p>
      </div>

      {/* Tip Banner */}
      <div className="flex items-start gap-3 p-4 rounded-[var(--radius-lg)] bg-[var(--accent-subtle)] border border-[var(--accent)]/30">
        <AlertCircle size={18} className="text-[var(--accent)] shrink-0 mt-0.5" />
        <div className="text-xs text-[var(--text-secondary)] leading-relaxed">
          <strong>Tip:</strong> Ensure you have uploaded your latest PDF resume in the{' '}
          <Link to="/candidate/resume" className="font-semibold text-[var(--accent)] underline">
            Resume Section
          </Link>
          . The AI tools use your resume to generate customized ATS scores, matching jobs, and interview question banks.
        </div>
      </div>

      {/* Primary Tool Cards */}
      <div className="space-y-6">
        {tools.map((tool, i) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[var(--bg-card)] rounded-[var(--radius-xl)] p-6 border border-[var(--border-color)] shadow-[var(--shadow-sm)] hover:border-[var(--accent)]/30 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-start gap-3.5">
                <div className="p-3 rounded-[var(--radius-lg)] bg-[var(--accent-subtle)] text-[var(--accent)] shrink-0">
                  <tool.icon size={22} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--text-primary)]">{tool.title}</h3>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5 max-w-xl">{tool.desc}</p>
                </div>
              </div>

              <button
                onClick={tool.action}
                disabled={tool.loading}
                className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold bg-[var(--accent)] text-white rounded-[var(--radius-md)] hover:bg-[var(--accent-hover)] disabled:opacity-60 transition-all cursor-pointer shrink-0 shadow-sm"
              >
                {tool.loading ? <Loader2 size={16} className="animate-spin" /> : <ChevronRight size={16} />}
                {tool.loading ? 'Processing...' : tool.buttonText}
              </button>
            </div>

            {/* Results Container */}
            {tool.result && (
              <div className="mt-5 pt-5 border-t border-[var(--border-color)]">
                {tool.renderResult(tool.result)}
              </div>
            )}
          </motion.div>
        ))}

        {/* 3. Interview Questions Generator */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[var(--bg-card)] rounded-[var(--radius-xl)] p-6 border border-[var(--border-color)] shadow-[var(--shadow-sm)] hover:border-[var(--accent)]/30 transition-all"
        >
          <div className="flex items-start gap-3.5 mb-5">
            <div className="p-3 rounded-[var(--radius-lg)] bg-purple-500/10 text-purple-500 shrink-0">
              <MessageSquare size={22} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                Interview Question & Scenario Generator
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Generate 20 curated Technical, Behavioral (STAR), and System Design questions customized to a specific role.
              </p>
            </div>
          </div>

          {/* Job Selection Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Select Active Job
              </label>
              <select
                value={selectedJobId}
                onChange={(e) => {
                  setSelectedJobId(e.target.value);
                  setCustomJobId('');
                }}
                className="w-full px-3.5 py-2.5 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] cursor-pointer"
              >
                {availableJobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    #{j.id} - {j.title} ({j.companyName || 'Company'})
                  </option>
                ))}
                {availableJobs.length === 0 && <option value="">No active jobs found</option>}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Or Enter Custom Job ID
              </label>
              <input
                type="number"
                value={customJobId}
                onChange={(e) => setCustomJobId(e.target.value)}
                placeholder="e.g. 1"
                className="w-full px-3.5 py-2.5 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleInterviewQuestions}
              disabled={loadingQuestions}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold bg-[var(--accent)] text-white rounded-[var(--radius-md)] hover:bg-[var(--accent-hover)] disabled:opacity-60 transition-all cursor-pointer shadow-sm"
            >
              {loadingQuestions ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {loadingQuestions ? 'Generating Questions...' : 'Generate Practice Questions'}
            </button>
          </div>

          {/* Interview Questions Output */}
          {interviewQuestions && (
            <div className="mt-6 pt-6 border-t border-[var(--border-color)]">
              {renderInterviewQuestions(interviewQuestions)}
            </div>
          )}
        </motion.div>
      </div>

      {/* Easy Apply Modal for Job Recommendations */}
      <EasyApplyModal
        isOpen={!!applyModalJob}
        job={applyModalJob}
        onClose={() => setApplyModalJob(null)}
        onSuccess={(jobId) => {
          setAppliedJobIds((prev) => new Set(prev).add(jobId));
        }}
      />
    </div>
  );
}
