import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import type { Experience as Exp } from '@/lib/types';

export default function ExperienceSection({ experience }: { experience: Exp[] }) {
  return (
    <section id="experience" className="relative py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="section-label mb-5">
            <Briefcase className="w-3.5 h-3.5" />
            Experience
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-12">
            Work History
          </h2>

          <div className="relative">
            <div className="absolute left-6 top-2 bottom-2 w-px bg-gradient-to-b from-accent-500/60 via-slate-700/40 to-transparent" />

            {experience.map((exp, i) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="relative pl-20 pb-10 last:pb-0 group"
              >
                <div className="absolute left-0 top-0 w-14 h-14 flex items-center justify-center rounded-2xl glass-card border border-accent-500/20 group-hover:scale-110 group-hover:border-accent-500/40 transition-all">
                  <Briefcase className="w-6 h-6 text-accent-400" />
                </div>
                <div className="absolute left-[22px] top-6 w-1.5 h-1.5 rounded-full bg-accent-400 ring-4 ring-accent-500/10" />

                <div className="glass-card card-hover rounded-2xl p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-white">{exp.position}</h3>
                    <span className="text-xs text-accent-400 font-mono px-3 py-1 rounded-full bg-accent-500/8 border border-accent-500/15">
                      {exp.start_date} — {exp.end_date || 'Present'}
                    </span>
                  </div>
                  <p className="text-brand-300 font-medium mb-3">{exp.company}</p>
                  {exp.description && (
                    <p className="text-slate-400 text-sm leading-relaxed">{exp.description}</p>
                  )}
                </div>
              </motion.div>
            ))}

            {experience.length === 0 && (
              <p className="text-slate-500 text-center py-8">No experience entries yet.</p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
