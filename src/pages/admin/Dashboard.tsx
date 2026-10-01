import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FolderGit2, Cpu, Mail, Briefcase, Award, Wrench,
  TrendingUp, Eye, MessageSquare, ArrowUpRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

interface Stats {
  projects: number;
  skills: number;
  messages: number;
  unreadMessages: number;
  experience: number;
  certifications: number;
  services: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    projects: 0, skills: 0, messages: 0, unreadMessages: 0,
    experience: 0, certifications: 0, services: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const [
        { count: projects }, { count: skills }, { count: messages },
        { count: unreadMessages }, { count: experience },
        { count: certifications }, { count: services }
      ] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('skills').select('*', { count: 'exact', head: true }),
        supabase.from('messages').select('*', { count: 'exact', head: true }),
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
        supabase.from('experience').select('*', { count: 'exact', head: true }),
        supabase.from('certifications').select('*', { count: 'exact', head: true }),
        supabase.from('services').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        projects: projects || 0, skills: skills || 0, messages: messages || 0,
        unreadMessages: unreadMessages || 0, experience: experience || 0,
        certifications: certifications || 0, services: services || 0,
      });
      setLoading(false);
    }
    fetchStats();
  }, []);

  const cards = [
    { label: 'Total Projects', value: stats.projects, icon: FolderGit2, color: 'brand', link: '/admin/projects' },
    { label: 'Total Skills', value: stats.skills, icon: Cpu, color: 'accent', link: '/admin/skills' },
    { label: 'Total Messages', value: stats.messages, icon: Mail, color: 'blue', link: '/admin/messages' },
    { label: 'Unread Messages', value: stats.unreadMessages, icon: MessageSquare, color: 'red', link: '/admin/messages' },
    { label: 'Experience Entries', value: stats.experience, icon: Briefcase, color: 'amber', link: '/admin/experience' },
    { label: 'Certifications', value: stats.certifications, icon: Award, color: 'purple', link: '/admin/certifications' },
    { label: 'Services', value: stats.services, icon: Wrench, color: 'teal', link: '/admin/services' },
  ];

  const colorMap: Record<string, string> = {
    brand: 'from-brand-500/20 to-brand-600/5 text-brand-400 border-brand-500/20',
    accent: 'from-accent-500/20 to-accent-600/5 text-accent-400 border-accent-500/20',
    blue: 'from-blue-500/20 to-blue-600/5 text-blue-400 border-blue-500/20',
    red: 'from-red-500/20 to-red-600/5 text-red-400 border-red-500/20',
    amber: 'from-amber-500/20 to-amber-600/5 text-amber-400 border-amber-500/20',
    purple: 'from-purple-500/20 to-purple-600/5 text-purple-400 border-purple-500/20',
    teal: 'from-teal-500/20 to-teal-600/5 text-teal-400 border-teal-500/20',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-brand-500/30 border-t-brand-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold mb-1">Dashboard Overview</h1>
        <p className="text-sm text-slate-400">Welcome back! Here's what's happening with your portfolio.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
          >
            <Link
              to={card.link}
              className={`block glass rounded-2xl p-5 border bg-gradient-to-br ${colorMap[card.color]} hover:scale-[1.02] transition-transform`}
            >
              <div className="flex items-center justify-between mb-3">
                <card.icon className="w-6 h-6" />
                <ArrowUpRight className="w-4 h-4 opacity-40" />
              </div>
              <div className="text-3xl font-bold mb-1">{card.value}</div>
              <div className="text-xs text-slate-400">{card.label}</div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-brand-400" />
          <h2 className="font-semibold">Quick Actions</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Add Project', link: '/admin/projects', icon: FolderGit2 },
            { label: 'Add Skill', link: '/admin/skills', icon: Cpu },
            { label: 'View Messages', link: '/admin/messages', icon: Mail },
            { label: 'Update Profile', link: '/admin/profile', icon: Eye },
          ].map((action) => (
            <Link
              key={action.label}
              to={action.link}
              className="flex items-center gap-3 px-4 py-3 rounded-xl glass hover:bg-white/5 transition-colors text-sm font-medium"
            >
              <action.icon className="w-5 h-5 text-brand-400" />
              {action.label}
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
