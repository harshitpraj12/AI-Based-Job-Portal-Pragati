import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';

export default function EmptyState({ icon: Icon = Inbox, title = 'Nothing here yet', description = 'Check back later for updates.', action, actionLabel }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className="p-4 rounded-full bg-[var(--bg-card-hover)] mb-4">
        <Icon size={40} className="text-[var(--text-placeholder)]" />
      </div>
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">{title}</h3>
      <p className="text-sm text-[var(--text-muted)] max-w-sm mb-6">{description}</p>
      {action && (
        <button
          onClick={action}
          className="px-5 py-2.5 bg-[var(--accent)] text-white text-sm font-medium rounded-[var(--radius-md)] hover:bg-[var(--accent-hover)] transition-colors cursor-pointer"
        >
          {actionLabel || 'Take Action'}
        </button>
      )}
    </motion.div>
  );
}
