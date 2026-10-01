import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import type { Achievement as Ach } from '@/lib/types';

export default function Achievements({ achievements }: { achievements: Ach[] }) {
  return (
    <section id="achievements" className="relative py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="section-label mb-5">
            <Trophy className="w-3.5 h-3.5" />
            Achievements
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-12">
            Milestones & Awards
          </h2>

          <div className="grid sm:grid-cols-2 gap-5">
            {achievements.map((ach, i) => (
              <motion.div
                key={ach.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 2) * 0.1, duration: 0.5 }}
                whileHover={{ y: -6 }}
                className="group glass-card card-hover rounded-2xl p-6 flex items-start gap-4 relative overflow-hidden"
              >
                <div className="absolute -top-16 -right-16 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-12 h-12 shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/15 to-orange-500/15 text-amber-400 group-hover:scale-110 transition-transform">
                  <Trophy className="w-6 h-6" />
                </div>
                <div className="relative">
                  <h3 className="font-semibold text-white mb-1">{ach.title}</h3>
                  {ach.date && <p className="text-xs text-amber-400/70 mb-2 font-mono">{ach.date}</p>}
                  {ach.description && (
                    <p className="text-sm text-slate-400 leading-relaxed">{ach.description}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {achievements.length === 0 && (
            <p className="text-slate-500 text-center py-8">No achievements added yet.</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
