import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload, File, Eye, RefreshCw, CheckCircle, AlertCircle, Loader2, Trash2 } from 'lucide-react';
import { resumeService } from '../../services/resumeService';
import { useNotifications } from '../../context/NotificationContext';
import toast from 'react-hot-toast';

export default function ResumePage() {
  const { notifyResumeUploaded } = useNotifications();
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadedFile, setUploadedFile] = useState(null);

  const fetchResume = useCallback(async () => {
    setLoading(true);
    try {
      const res = await resumeService.getMyResume();
      if (res.status === 200 && res.data) {
        setUploadedFile({
          name: res.data.fileName,
          size: (res.data.fileSize / 1024).toFixed(1) + ' KB',
          date: 'Uploaded',
        });
      } else {
        setUploadedFile(null);
      }
    } catch {
      setUploadedFile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResume();
  }, [fetchResume]);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are accepted');
      return;
    }
    setUploading(true);
    try {
      await resumeService.uploadResume(file);
      toast.success('Resume uploaded successfully!');
      notifyResumeUploaded({ fileName: file.name });
      fetchResume();
    } catch (err) {
      toast.error(err.response?.data || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [fetchResume]);

  const handleViewResume = async () => {
    try {
      const response = await resumeService.previewMyResume();
      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank');
    } catch {
      toast.error('Failed to preview resume');
    }
  };

  const handleDeleteResume = async () => {
    if (!window.confirm('Are you sure you want to delete your resume?')) return;
    try {
      await resumeService.deleteMyResume();
      toast.success('Resume deleted successfully!');
      fetchResume();
    } catch {
      toast.error('Failed to delete resume');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    multiple: false,
  });

  if (loading) {
    return (
      <div className="max-w-3xl flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-[var(--text-muted)]">
          <Loader2 size={24} className="animate-spin" />
          <span>Loading resume details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Resume</h1>
        <p className="text-[var(--text-muted)] mt-1">Upload and manage your resume</p>
      </div>

      {/* Upload Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        {...getRootProps()}
        className={`bg-[var(--bg-card)] rounded-[var(--radius-xl)] border-2 border-dashed transition-all duration-300 cursor-pointer ${
          isDragActive
            ? 'border-[var(--accent)] bg-[var(--accent-subtle)]'
            : 'border-[var(--border-color)] hover:border-[var(--accent)]/50 hover:bg-[var(--bg-card-hover)]'
        }`}
      >
        <input {...getInputProps()} />
        <div className="py-16 px-8 text-center">
          <div className={`inline-flex p-4 rounded-full mb-4 transition-colors ${isDragActive ? 'bg-[var(--accent-light)]' : 'bg-[var(--bg-card-hover)]'}`}>
            <Upload size={32} className={isDragActive ? 'text-[var(--accent)]' : 'text-[var(--text-placeholder)]'} />
          </div>
          <p className="text-lg font-semibold text-[var(--text-primary)] mb-1">
            {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
          </p>
          <p className="text-sm text-[var(--text-muted)] mb-4">or click to browse files</p>
          <p className="text-xs text-[var(--text-placeholder)]">Supports PDF files only (Max 10MB)</p>
          {uploading && (
            <div className="mt-6 flex items-center justify-center gap-2 text-[var(--accent)]">
              <div className="w-5 h-5 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium">Uploading...</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Uploaded File */}
      {uploadedFile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] p-5 border border-[var(--border-color)] shadow-[var(--shadow-sm)]"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-[var(--radius-md)] bg-[var(--accent-subtle)]">
              <File size={24} className="text-[var(--accent)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{uploadedFile.name}</p>
              <p className="text-xs text-[var(--text-muted)]">{uploadedFile.size} • {uploadedFile.date}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs text-[var(--success)]">
                <CheckCircle size={14} /> Uploaded
              </span>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleViewResume}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-[var(--border-color)] rounded-[var(--radius-md)] text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer"
            >
              <Eye size={16} /> View Resume
            </button>
            <button
              {...getRootProps()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-[var(--border-color)] rounded-[var(--radius-md)] text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer"
            >
              <RefreshCw size={16} /> Replace
            </button>
            <button
              onClick={handleDeleteResume}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-red-200 rounded-[var(--radius-md)] text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </motion.div>
      )}

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-color)] shadow-[var(--shadow-sm)]"
      >
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
          <AlertCircle size={16} className="text-[var(--warning)]" /> Resume Tips
        </h3>
        <ul className="space-y-2 text-sm text-[var(--text-muted)]">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-1.5 shrink-0" />
            Keep your resume to 1-2 pages for better readability
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-1.5 shrink-0" />
            Highlight relevant skills and achievements
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-1.5 shrink-0" />
            Use our AI Resume Feedback tool for personalized improvement suggestions
          </li>
        </ul>
      </motion.div>
    </div>
  );
}
