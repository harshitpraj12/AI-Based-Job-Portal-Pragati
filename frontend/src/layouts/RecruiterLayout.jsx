import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { LayoutDashboard, Building2, Briefcase, FileText, User, Settings } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';
import ThemeToggle from '../components/ThemeToggle';
import NotificationDropdown from '../components/NotificationDropdown';
import ProfileMenu from '../components/ProfileMenu';

const sidebarItems = [
  { label: 'Dashboard', path: '/recruiter/dashboard', icon: LayoutDashboard },
  { label: 'Companies', path: '/recruiter/companies', icon: Building2 },
  { label: 'Jobs', path: '/recruiter/jobs', icon: Briefcase },
  { label: 'Applications', path: '/recruiter/applications', icon: FileText },
  { label: 'Profile', path: '/recruiter/profile', icon: User },
  { label: 'Settings', path: '/recruiter/settings', icon: Settings },
];

export default function RecruiterLayout() {
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
            placeholder="Search candidates, jobs..."
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
