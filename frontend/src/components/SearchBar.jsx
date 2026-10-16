import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search...', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-placeholder)]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)] focus:outline-none focus:border-[var(--border-color-focus)] focus:ring-1 focus:ring-[var(--accent)] transition-all duration-200"
      />
    </div>
  );
}
