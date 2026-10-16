import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className="relative p-2 rounded-[var(--radius-md)] transition-colors duration-200 hover:bg-[var(--bg-card-hover)] cursor-pointer"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? (
          <Sun size={20} className="text-[var(--warning)]" />
        ) : (
          <Moon size={20} className="text-[var(--text-muted)]" />
        )}
      </motion.div>
    </motion.button>
  );
}
