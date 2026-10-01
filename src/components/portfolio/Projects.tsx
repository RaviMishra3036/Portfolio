import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderGit2, Github, ExternalLink, Star, X, ArrowUpRight } from 'lucide-react';
import type { Project } from '@/lib/types';

export default function Projects({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<Project | null>(null);
  const [filter, setFilter] = useState<string>('All');
  const categories = ['All', ...new Set(projects.map((p) => p.category).filter(Boolean))] as string[];

  const filtered = filter === 'All' ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="relative py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="section-label mb-5">
            <FolderGit2 className="w-3.5 h-3.5" />
            Projects
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-8">
            Featured Work
          </h2>

          {/* Filter tabs */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    filter === cat
                      ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/20'
                      : 'glass text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.1, duration: 0.5 }}
                whileHover={{ y: -10 }}
                className="group glass-card card-hover rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setSelected(project)}
              >
                {/* Project image / gradient placeholder */}
                <div className="relative h-52 overflow-hidden">
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-500/10 via-slate-800/30 to-accent-500/10">
                      <FolderGit2 className="w-14 h-14 text-slate-600 group-hover:text-slate-500 transition-colors" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  {project.featured && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 backdrop-blur-md text-amber-300 text-xs font-semibold border border-amber-500/30">
                      <Star className="w-3 h-3 fill-current" />
                      Featured
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-brand-500/0 group-hover:bg-brand-500/5 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full glass-strong flex items-center justify-center opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-300">
                      <ArrowUpRight className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-white group-hover:text-brand-300 transition-colors">
                      {project.title}
                    </h3>
                    {project.category && (
                      <span className="text-xs text-slate-500 shrink-0 mt-1 px-2 py-0.5 rounded-md bg-white/5">{project.category}</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4 line-clamp-2">
                    {project.short_description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-brand-500/8 text-brand-300 border border-brand-500/10"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2.5 py-1 rounded-lg text-xs text-slate-500">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-4 pt-3 border-t border-white/5">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
                      >
                        <Github className="w-4 h-4" />
                        Code
                      </a>
                    )}
                    {project.live_demo_url && (
                      <a
                        href={project.live_demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-accent-300 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Demo
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-slate-500 text-center py-12">No projects yet.</p>
          )}
        </motion.div>
      </div>

      {/* Project detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
            >
              <div className="relative h-60 overflow-hidden rounded-t-3xl">
                {selected.image_url ? (
                  <img src={selected.image_url} alt={selected.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-500/10 to-accent-500/10">
                    <FolderGit2 className="w-16 h-16 text-slate-600" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full glass-strong text-white hover:bg-white/15 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8">
                <h3 className="font-display text-2xl font-bold mb-2">{selected.title}</h3>
                <p className="text-slate-400 mb-4">{selected.short_description}</p>
                {selected.detailed_description && (
                  <p className="text-slate-300 leading-relaxed mb-6">{selected.detailed_description}</p>
                )}
                <div className="flex flex-wrap gap-2 mb-6">
                  {selected.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium bg-brand-500/8 text-brand-300 border border-brand-500/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3">
                  {selected.github_url && (
                    <a
                      href={selected.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 glass hover:bg-white/10 rounded-xl text-sm font-medium transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      View Code
                    </a>
                  )}
                  {selected.live_demo_url && (
                    <a
                      href={selected.live_demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
