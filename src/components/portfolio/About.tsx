import { motion } from 'framer-motion';
import type { SiteSettings } from '@/lib/types';
import { User, Code2, Server, Rocket } from 'lucide-react';

export default function About({ settings }: { settings: SiteSettings | null }) {
  const defaultStats = [
    { value: '5+', label: 'Years Experience', icon: Rocket, color: 'text-brand-400' },
    { value: '30+', label: 'Projects Completed', icon: Code2, color: 'text-accent-400' },
    { value: '15+', label: 'Technologies', icon: Server, color: 'text-brand-300' },
  ];
  const stats = (settings?.about_stats?.length === 3 ? settings.about_stats : defaultStats).map((stat, index) => ({
    ...stat,
    icon: defaultStats[index].icon,
    color: defaultStats[index].color,
  }));

  return (
    <section id="about" className="relative py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="section-label mb-5">
            <User className="w-3.5 h-3.5" />
            About Me
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-10">
            Who I Am
          </h2>

          <div className="glass-card rounded-3xl p-8 sm:p-12 relative overflow-hidden">
            {/* Decorative gradient corner */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-brand-500/8 to-transparent rounded-full blur-3xl" />

            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed text-balance relative">
              {settings?.about_text || 'Passionate developer creating amazing experiences.'}
            </p>

            <div className="grid sm:grid-cols-3 gap-6 mt-12 pt-10 border-t border-white/5 relative">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                  className="text-center sm:text-left"
                >
                  <div className={`w-10 h-10 flex items-center justify-center rounded-xl glass mb-3 ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div className="text-4xl font-bold gradient-text mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
