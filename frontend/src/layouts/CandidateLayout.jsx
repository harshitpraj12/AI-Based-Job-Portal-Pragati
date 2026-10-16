import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { LayoutDashboard, Briefcase, FileText, User, Upload, Sparkles, Settings } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';
import ThemeToggle from '../components/ThemeToggle';
import NotificationDropdown from '../components/NotificationDropdown';
import ProfileMenu from '../components/ProfileMenu';

const sidebarItems = [
  { label: 'Dashboard', path: '/candidate/dashboard', icon: LayoutDashboard },
  { label: 'Browse Jobs', path: '/candidate/jobs', icon: Briefcase },
  { label: 'My Applications', path: '/candidate/applications', icon: FileText },
  { label: 'Profile', path: '/candidate/profile', icon: User },
  { label: 'Resume', path: '/candidate/resume', icon: Upload },
  { label: 'AI Tools', path: '/candidate/ai-tools', icon: Sparkles },
  { label: 'Settings', path: '/candidate/settings', icon: Settings },
];

export default function CandidateLayout() {
  const [search, setSearch] = useState('');

  return (
    <div className="flex min-h-screen">
      <Sidebar items={sidebarItems} />

      <div className="flex-1 ml-[260px] transition-[margin] duration-300">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 h-16 bg-[var(--bg-card)]/80 backdrop-blur-xl border-b border-[var(--border-color)] flex items-center justify-between px-6 gap-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search jobs, companies..."
            className="max-w-md flex-1"
          />
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <NotificationDropdown />
            <ProfileMenu />
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
