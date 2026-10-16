import { Link } from 'react-router-dom';
import { Briefcase, Globe, Link as LinkIcon, MessageCircle, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    'For Candidates': [
      { label: 'Browse Jobs', path: '/jobs' },
      { label: 'Companies', path: '/companies' },
      { label: 'Career Advice', path: '#' },
      { label: 'Resume Builder', path: '#' },
    ],
    'For Recruiters': [
      { label: 'Post a Job', path: '/register' },
      { label: 'Search Candidates', path: '#' },
      { label: 'Pricing', path: '#' },
      { label: 'Employer Branding', path: '#' },
    ],
    Company: [
      { label: 'About Us', path: '#' },
      { label: 'Blog', path: '#' },
      { label: 'Privacy Policy', path: '#' },
      { label: 'Terms of Service', path: '#' },
    ],
  };

  const socialLinks = [
    { icon: Globe, href: '#', label: 'GitHub' },
    { icon: LinkIcon, href: '#', label: 'LinkedIn' },
    { icon: MessageCircle, href: '#', label: 'Twitter' },
    { icon: Mail, href: '#', label: 'Email' },
  ];

  return (
    <footer className="border-t border-[var(--border-color)] bg-[var(--bg-card)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="p-2 rounded-[var(--radius-md)] bg-[var(--accent)]">
                <Briefcase size={18} className="text-white" />
              </div>
              <span className="text-lg font-bold text-[var(--text-primary)]">
                Job<span className="text-[var(--accent)]">Portal</span>
              </span>
            </Link>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">
              AI-powered job portal connecting talented candidates with top companies. Find your dream job today.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="p-2 rounded-[var(--radius-md)] text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-subtle)] transition-all duration-200"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(({ label, path }) => (
                  <li key={label}>
                    <Link
                      to={path}
                      className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="py-4 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[var(--text-placeholder)]">
            © {currentYear} JobPortal. All rights reserved.
          </p>
          <p className="text-xs text-[var(--text-placeholder)]">
            Built with ❤️ using React & Spring Boot
          </p>
        </div>
      </div>
    </footer>
  );
}
