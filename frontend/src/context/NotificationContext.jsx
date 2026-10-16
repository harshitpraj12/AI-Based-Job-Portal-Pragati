import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

// Simple Web Audio API sound generator for notifications (no external assets needed)
const playNotificationSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch {
    // AudioContext may be blocked before first user gesture
  }
};

const getSeedNotifications = (role, userName) => {
  const now = Date.now();
  if (role === 'RECRUITER') {
    return [
      {
        id: 'seed-rec-1',
        title: 'Welcome to JobPortal Recruiter',
        message: 'Your recruiter dashboard is active. Post jobs and view AI-matched candidates.',
        type: 'SYSTEM',
        timestamp: now - 3600000,
        read: false,
        link: '/recruiter/dashboard',
      },
      {
        id: 'seed-rec-2',
        title: 'AI Resume Matching Ready',
        message: 'Candidates who apply will automatically receive ATS compatibility scores.',
        type: 'AI',
        timestamp: now - 7200000,
        read: true,
        link: '/recruiter/jobs',
      },
    ];
  }

  return [
    {
      id: 'seed-cand-1',
      title: `Welcome, ${userName || 'Candidate'}!`,
      message: 'Explore active openings and get instant AI resume feedback.',
      type: 'SYSTEM',
      timestamp: now - 1800000,
      read: false,
      link: '/candidate/jobs',
    },
    {
      id: 'seed-cand-2',
      title: 'Upload Your Resume',
      message: 'Upload your PDF resume to unlock 1-click Easy Apply & personalized recommendations.',
      type: 'RESUME',
      timestamp: now - 7200000,
      read: true,
      link: '/candidate/resume',
    },
  ];
};

export function NotificationProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const channelRef = useRef(null);

  const storageKey = user ? `notifications_${user.id || user.email || user.role}` : 'notifications_guest';

  // Load notifications from localStorage
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setNotifications([]);
      return;
    }

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setNotifications(JSON.parse(stored));
      } else {
        const initial = getSeedNotifications(user.role, user.name);
        setNotifications(initial);
        localStorage.setItem(storageKey, JSON.stringify(initial));
      }
    } catch {
      setNotifications([]);
    }
  }, [isAuthenticated, user?.id, user?.email, user?.role, storageKey]);

  // Sync state to localStorage whenever notifications change
  const saveNotifications = useCallback((newNotifs) => {
    setNotifications(newNotifs);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newNotifs));
    } catch (e) {
      console.error('Failed to save notifications', e);
    }
  }, [storageKey]);

  // Setup BroadcastChannel for real-time inter-tab & cross-role notifications
  useEffect(() => {
    let channel;
    try {
      channel = new BroadcastChannel('job_portal_notifications');
      channelRef.current = channel;

      channel.onmessage = (event) => {
        const data = event.data;
        if (!data || !user) return;

        // Check if this notification is intended for the current user/role
        const isTargetUser = data.targetUserId && user.id && String(data.targetUserId) === String(user.id);
        const isTargetEmail = data.targetEmail && user.email && data.targetEmail.toLowerCase() === user.email.toLowerCase();
        const isTargetRole = data.targetRole && (data.targetRole === 'ALL' || data.targetRole === user.role);

        if (isTargetUser || isTargetEmail || isTargetRole) {
          const newNotif = {
            id: data.id || `notif_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
            title: data.title,
            message: data.message,
            type: data.type || 'SYSTEM',
            timestamp: data.timestamp || Date.now(),
            read: false,
            link: data.link || '',
            meta: data.meta || {},
          };

          setNotifications((prev) => {
            const updated = [newNotif, ...prev.filter(n => n.id !== newNotif.id)].slice(0, 50);
            try {
              localStorage.setItem(storageKey, JSON.stringify(updated));
            } catch {}
            return updated;
          });

          playNotificationSound();
          toast(data.title, {
            icon: data.type === 'APPLICATION' ? '📋' : data.type === 'STATUS' ? '⚡' : data.type === 'AI' ? '✨' : '🔔',
            style: {
              borderRadius: '12px',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--accent)',
            },
          });
        }
      };
    } catch (err) {
      console.warn('BroadcastChannel not supported', err);
    }

    return () => {
      if (channel) {
        channel.close();
      }
    };
  }, [user, storageKey]);

  // Add notification & broadcast
  const addNotification = useCallback(({
    title,
    message,
    type = 'SYSTEM',
    targetRole = 'ALL',
    targetUserId = null,
    targetEmail = null,
    link = '',
    meta = {},
    showToast = true,
  }) => {
    const notifItem = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      title,
      message,
      type,
      timestamp: Date.now(),
      read: false,
      link,
      meta,
      targetRole,
      targetUserId,
      targetEmail,
    };

    // If current user is also in the target audience, add to local state immediately
    const isCurrentUserTarget = !targetRole || targetRole === 'ALL' || (user && user.role === targetRole);
    const isTargetUserMatches = !targetUserId || (user && String(user.id) === String(targetUserId));
    const isTargetEmailMatches = !targetEmail || (user && user.email?.toLowerCase() === targetEmail.toLowerCase());

    if (user && isCurrentUserTarget && isTargetUserMatches && isTargetEmailMatches) {
      setNotifications((prev) => {
        const updated = [notifItem, ...prev].slice(0, 50);
        try {
          localStorage.setItem(storageKey, JSON.stringify(updated));
        } catch {}
        return updated;
      });

      playNotificationSound();

      if (showToast) {
        toast(title, {
          icon: type === 'APPLICATION' ? '📋' : type === 'STATUS' ? '⚡' : type === 'AI' ? '✨' : '🔔',
          style: {
            borderRadius: '12px',
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
          },
        });
      }
    }

    // Broadcast to other tabs/sessions
    try {
      if (channelRef.current) {
        channelRef.current.postMessage(notifItem);
      }
    } catch (err) {
      console.warn('Failed to broadcast notification', err);
    }
  }, [user, storageKey]);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, [storageKey]);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map(n => ({ ...n, read: true }));
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, [storageKey]);

  const deleteNotification = useCallback((id) => {
    setNotifications((prev) => {
      const updated = prev.filter(n => n.id !== id);
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, [storageKey]);

  const clearAll = useCallback(() => {
    saveNotifications([]);
  }, [saveNotifications]);

  // Convenience helper functions for key application events:
  const notifyJobApplied = useCallback(({ jobTitle, companyName, candidateName }) => {
    // 1. Notify Candidate
    addNotification({
      title: `Applied to ${jobTitle}`,
      message: `Your Easy Apply application for ${jobTitle} at ${companyName || 'the company'} was submitted successfully!`,
      type: 'APPLICATION',
      targetRole: 'CANDIDATE',
      link: '/candidate/applications',
    });

    // 2. Real-time broadcast to Recruiter
    addNotification({
      title: `New Applicant for ${jobTitle}`,
      message: `${candidateName || 'A candidate'} just applied for "${jobTitle}". Review their profile and ATS score.`,
      type: 'APPLICATION',
      targetRole: 'RECRUITER',
      link: '/recruiter/applications',
      showToast: false, // Don't toast for candidate themselves
    });
  }, [addNotification]);

  const notifyStatusUpdated = useCallback(({ jobTitle, companyName, candidateEmail, newStatus, candidateName }) => {
    // 1. Notify Recruiter
    addNotification({
      title: `Status Changed to ${newStatus}`,
      message: `Updated status for ${candidateName || candidateEmail || 'applicant'} to ${newStatus}.`,
      type: 'STATUS',
      targetRole: 'RECRUITER',
      link: '/recruiter/applications',
    });

    // 2. Real-time broadcast to Candidate
    addNotification({
      title: `Application Update: ${newStatus}`,
      message: `Your application for ${jobTitle} at ${companyName || 'the company'} has been marked as ${newStatus}.`,
      type: 'STATUS',
      targetRole: 'CANDIDATE',
      targetEmail: candidateEmail,
      link: '/candidate/applications',
      showToast: false,
    });
  }, [addNotification]);

  const notifyJobCreated = useCallback(({ jobTitle }) => {
    addNotification({
      title: `Job Posted Successfully`,
      message: `"${jobTitle}" is now live and accepting applications.`,
      type: 'JOB',
      targetRole: 'RECRUITER',
      link: '/recruiter/jobs',
    });
  }, [addNotification]);

  const notifyResumeUploaded = useCallback(({ fileName }) => {
    addNotification({
      title: `Resume Uploaded`,
      message: `"${fileName || 'Resume'}" was saved. ATS parsing and AI analysis are ready.`,
      type: 'RESUME',
      targetRole: 'CANDIDATE',
      link: '/candidate/resume',
    });
  }, [addNotification]);

  const notifyAIToolsUsed = useCallback(({ toolName, summary }) => {
    addNotification({
      title: `${toolName} Completed`,
      message: summary || `Your ${toolName} report is ready to review.`,
      type: 'AI',
      targetRole: 'CANDIDATE',
      link: '/candidate/ai-tools',
    });
  }, [addNotification]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAll,
      notifyJobApplied,
      notifyStatusUpdated,
      notifyJobCreated,
      notifyResumeUploaded,
      notifyAIToolsUsed,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};
