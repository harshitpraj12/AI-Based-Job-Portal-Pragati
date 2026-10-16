import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Briefcase, CheckCircle, FileText, Sparkles, Trash2, Check, ExternalLink, X } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const getIcon = (type) => {
  switch (type) {
    case 'APPLICATION':
      return Briefcase;
    case 'STATUS':
      return CheckCircle;
    case 'AI':
      return Sparkles;
    case 'RESUME':
      return FileText;
    default:
      return Bell;
  }
};

const formatTimeAgo = (timestamp) => {
  if (!timestamp) return 'Just now';
  const diff = Math.floor((Date.now() - timestamp) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'
  const navigate = useNavigate();

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  } = useNotifications();

  const filteredNotifications = useMemo(() => {
    if (filter === 'unread') {
      return notifications.filter((n) => !n.read);
    }
    return notifications;
  }, [notifications, filter]);

  const handleNotificationClick = (notif) => {
    markAsRead(notif.id);
    if (notif.link) {
      setOpen(false);
      navigate(notif.link);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="View notifications"
        className="relative p-2 rounded-[var(--radius-md)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-all cursor-pointer"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-[var(--danger)] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-88 sm:w-96 z-50 bg-[var(--bg-card)] rounded-[var(--radius-xl)] shadow-2xl border border-[var(--border-color)] overflow-hidden flex flex-col max-h-[500px]"
            >
              {/* Header */}
              <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-card-hover)]/40">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                    Notifications
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.2 text-[10px] font-semibold rounded-full bg-[var(--accent)] text-white">
                        {unreadCount} new
                      </span>
                    )}
                  </h4>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[var(--accent)] hover:underline font-medium cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAll}
                      className="text-[var(--text-placeholder)] hover:text-[var(--danger)] transition-colors cursor-pointer"
                      title="Clear all"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex border-b border-[var(--border-color)] px-4 bg-[var(--bg-card)]">
                <button
                  onClick={() => setFilter('all')}
                  className={`py-2 text-xs font-medium border-b-2 transition-all cursor-pointer mr-4 ${
                    filter === 'all'
                      ? 'border-[var(--accent)] text-[var(--accent)]'
                      : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`py-2 text-xs font-medium border-b-2 transition-all cursor-pointer ${
                    filter === 'unread'
                      ? 'border-[var(--accent)] text-[var(--accent)]'
                      : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
              </div>

              {/* Notification List */}
              <div className="flex-1 overflow-y-auto divide-y divide-[var(--border-color)]">
                {filteredNotifications.length === 0 ? (
                  <div className="py-12 px-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-[var(--bg-card-hover)] flex items-center justify-center mx-auto mb-3 text-[var(--text-placeholder)]">
                      <Bell size={20} />
                    </div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      {filter === 'unread'
                        ? "You're all caught up with your updates."
                        : 'Real-time updates about applications and jobs will appear here.'}
                    </p>
                  </div>
                ) : (
                  filteredNotifications.map((notif) => {
                    const IconComponent = getIcon(notif.type);
                    return (
                      <div
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className={`group relative flex items-start gap-3 p-3.5 hover:bg-[var(--bg-card-hover)] transition-all cursor-pointer ${
                          !notif.read ? 'bg-[var(--accent-subtle)]/40' : ''
                        }`}
                      >
                        {/* Icon */}
                        <div
                          className={`p-2 rounded-[var(--radius-md)] shrink-0 mt-0.5 ${
                            notif.type === 'APPLICATION'
                              ? 'bg-blue-500/10 text-blue-500'
                              : notif.type === 'STATUS'
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : notif.type === 'AI'
                              ? 'bg-purple-500/10 text-purple-500'
                              : 'bg-[var(--accent-subtle)] text-[var(--accent)]'
                          }`}
                        >
                          <IconComponent size={16} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 pr-6">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-semibold text-[var(--text-primary)] line-clamp-1">
                              {notif.title}
                            </p>
                            {!notif.read && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-[var(--text-secondary)] mt-0.5 line-clamp-2 leading-relaxed">
                            {notif.message}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] text-[var(--text-placeholder)]">
                              {formatTimeAgo(notif.timestamp)}
                            </span>
                            {notif.link && (
                              <span className="text-[10px] text-[var(--accent)] flex items-center gap-0.5 group-hover:underline">
                                View <ExternalLink size={10} />
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Delete Single Action */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notif.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-[var(--text-placeholder)] hover:text-[var(--danger)] rounded transition-opacity absolute top-3 right-3"
                          title="Remove notification"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="p-2.5 border-t border-[var(--border-color)] bg-[var(--bg-card-hover)]/30 text-center">
                <span className="text-[10px] text-[var(--text-muted)] flex items-center justify-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Real-time alerts active
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
