import { motion } from 'framer-motion';

export default function StatCard({ icon: Icon, label, value, color = 'accent', delay = 0 }) {
  const colorMap = {
    accent: { bg: 'bg-accent-subtle', iconColor: 'text-accent' },
    info: { bg: 'bg-info-light', iconColor: 'text-info' },
    success: { bg: 'bg-success-light', iconColor: 'text-success' },
    warning: { bg: 'bg-warning-light', iconColor: 'text-warning' },
    danger: { bg: 'bg-danger-light', iconColor: 'text-danger' },
  };

  const c = colorMap[color] || colorMap.accent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-sm)] border border-[var(--border-color)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300"
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-[var(--radius-md)] ${c.bg}`}>
          <Icon size={24} className={c.iconColor} />
        </div>
        <div>
          <p className="text-sm text-[var(--text-muted)] font-medium">{label}</p>
          <p className="text-2xl font-bold text-[var(--text-primary)] mt-0.5">{value}</p>
        </div>
      </div>
    </motion.div>
  );
}
