import { getStatusColor } from '../utils/helpers';

export default function StatusBadge({ status }) {
  const { bg, text, label } = getStatusColor(status);

  return (
    <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-[var(--radius-full)] ${bg} ${text}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${text} opacity-80`} style={{ backgroundColor: 'currentColor' }} />
      {label}
    </span>
  );
}
