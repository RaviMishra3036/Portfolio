import { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, User, FolderGit2, Cpu, GraduationCap,
  Award, Trophy, Wrench, Mail, FileText, Link2, Settings, LogOut, Menu, X, UserRound,
  Globe,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/lib/types';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/profile', label: 'Profile', icon: User, end: false },
  { to: '/admin/about', label: 'About Me', icon: UserRound, end: false },
  { to: '/admin/projects', label: 'Projects', icon: FolderGit2, end: false },
  { to: '/admin/skills', label: 'Skills', icon: Cpu, end: false },
  { to: '/admin/education', label: 'Education', icon: GraduationCap, end: false },
  { to: '/admin/certifications', label: 'Certifications', icon: Award, end: false },
  { to: '/admin/achievements', label: 'Achievements', icon: Trophy, end: false },
  { to: '/admin/services', label: 'Services', icon: Wrench, end: false },
  { to: '/admin/messages', label: 'Messages', icon: Mail, end: false },
  { to: '/admin/resume', label: 'Resume', icon: FileText, end: false },
  { to: '/admin/social-links', label: 'Social Links', icon: Link2, end: false },
  { to: '/admin/settings', label: 'Settings', icon: Settings, end: false },
];

export default function AdminLayout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLight, setIsLight] = useState(() => localStorage.getItem('theme') === 'light');
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = isLight ? 'light' : 'dark';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  }, [isLight]);

  useEffect(() => {
    supabase.from('profile').select('*').maybeSingle().then(({ data }) => setProfile(data as Profile | null));
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="admin-shell min-h-screen bg-slate-950 flex">
      {/* Sidebar - desktop */}
      <aside className="admin-sidebar hidden lg:flex w-72 flex-col border-r border-white/5 bg-slate-900/50 fixed h-screen">
        <div className="p-6 border-b border-white/5">
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 font-display text-xl font-bold">
            {profile?.photo_url ? (
              <img src={profile.photo_url} alt="Profile" className="w-12 h-12 rounded-xl object-cover border border-white/10" />
            ) : (
              <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/30 to-accent-500/25 flex items-center justify-center text-brand-300">R</span>
            )}
            <span>
              <span className="gradient-text block">{profile?.name || 'Ravi Mishra'}</span>
              <span className="text-slate-500 text-sm block mt-1 font-sans font-normal">Admin Panel</span>
            </span>
          </a>
          <button
            onClick={() => setIsLight((current) => !current)}
            className="admin-theme-toggle w-full mt-6 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            {isLight ? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? 'admin-nav-active bg-brand-500/15 text-brand-300 border border-brand-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5 space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <Globe className="w-5 h-5" />
            View Portfolio
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-slate-900 border-r border-white/5 z-50 flex flex-col"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <a href="/" target="_blank" rel="noreferrer" className="font-display text-xl font-bold">
                  <span className="gradient-text">Portfolio</span>
                </a>
                <button onClick={() => setSidebarOpen(false)} className="text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium transition-all ${
                        isActive
                          ? 'admin-nav-active bg-brand-500/15 text-brand-300'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </NavLink>
                ))}
              </nav>
              <div className="p-4 border-t border-white/5">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 lg:ml-72 min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-30 glass-strong border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-300">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-display font-bold gradient-text">Admin Panel</span>
          <a href="/" target="_blank" rel="noreferrer" className="text-slate-400">
            <Globe className="w-5 h-5" />
          </a>
        </header>

        <main className="p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
