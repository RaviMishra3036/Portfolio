import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';
import type { Skill } from '@/lib/types';
import * as Icons from 'lucide-react';

export default function Skills({ skills }: { skills: Skill[] }) {
  const categories = [...new Set(skills.map((s) => s.category))];

  const getIcon = (iconName: string) => {
    const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[iconName];
    return Icon ? <Icon className="w-5 h-5" /> : <Icons.Code className="w-5 h-5" />;
  };

  return (
    <section id="skills" className="relative py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="section-label mb-5">
            <Cpu className="w-3.5 h-3.5" />
            Skills
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-12">
            Technical Expertise
          </h2>

          {categories.map((category) => (
            <div key={category} className="mb-12 last:mb-0">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8 bg-gradient-to-r from-brand-500/50 to-transparent" />
                <h3 className="text-lg font-semibold text-slate-200">{category}</h3>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills
                  .filter((s) => s.category === category)
                  .map((skill, i) => (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05, duration: 0.4 }}
                      whileHover={{ y: -6 }}
                      className="glass-card card-hover rounded-2xl p-5 group"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-brand-500/8 text-brand-400 group-hover:bg-brand-500/15 group-hover:scale-110 transition-all">
                            {getIcon(skill.icon)}
                          </div>
                          <span className="font-medium text-white">{skill.name}</span>
                        </div>
                        <span className="text-sm text-slate-400 font-mono">{skill.proficiency}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-800/60 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.proficiency}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                          className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full relative"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          ))}

          {skills.length === 0 && (
            <p className="text-slate-500 text-center py-8">No skills added yet.</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
