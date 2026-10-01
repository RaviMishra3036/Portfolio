import { motion } from 'framer-motion';
import { FileText, Download, Eye } from 'lucide-react';
import type { Profile } from '@/lib/types';

export default function ResumeSection({ profile }: { profile: Profile | null }) {
  return (
    <section id="resume" className="relative py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="section-label mb-5">
            <FileText className="w-3.5 h-3.5" />
            Resume
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-12">
            Download My Resume
          </h2>

          <div className="glass-card rounded-3xl p-8 sm:p-14 text-center relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl" />

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="w-24 h-24 mx-auto flex items-center justify-center rounded-3xl bg-gradient-to-br from-brand-500/15 to-accent-500/15 text-brand-400 mb-6 border border-brand-500/10"
            >
              <FileText className="w-12 h-12" />
            </motion.div>
            <h3 className="text-xl font-semibold text-white mb-2">My Professional Resume</h3>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Download my complete resume to learn more about my experience, skills, and qualifications.
            </p>
            {profile?.resume_url ? (
              <div className="flex gap-3 justify-center">
                <a
                  href={profile.resume_url}
                  download
                  className="btn-primary group flex items-center gap-2 px-8 py-3.5 text-white font-medium rounded-xl shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-0.5"
                >
                  <Download className="w-5 h-5" />
                  Download
                </a>
                <a
                  href={profile.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost flex items-center gap-2 px-8 py-3.5 glass-strong hover:bg-white/10 text-white font-medium rounded-xl hover:-translate-y-0.5"
                >
                  <Eye className="w-5 h-5" />
                  View
                </a>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Resume will be available soon.</p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
