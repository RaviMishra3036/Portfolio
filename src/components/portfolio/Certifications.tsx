import { motion } from 'framer-motion';
import { Award, ExternalLink } from 'lucide-react';
import type { Certification as Cert } from '@/lib/types';

export default function Certifications({ certifications }: { certifications: Cert[] }) {
  return (
    <section id="certifications" className="relative py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="section-label mb-5">
            <Award className="w-3.5 h-3.5" />
            Certifications
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-12">
            Professional Certifications
          </h2>

          <div className="grid sm:grid-cols-2 gap-5">
            {certifications.map((cert, i) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 2) * 0.1, duration: 0.5 }}
                whileHover={{ y: -6 }}
                className="group glass-card card-hover rounded-2xl p-6 flex items-start gap-4 relative overflow-hidden"
              >
                <div className="absolute -top-16 -right-16 w-32 h-32 bg-accent-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-12 h-12 shrink-0 flex items-center justify-center rounded-xl bg-accent-500/10 text-accent-400 group-hover:scale-110 transition-transform">
                  <Award className="w-6 h-6" />
                </div>
                <div className="flex-1 relative">
                  <h3 className="font-semibold text-white mb-1">{cert.name}</h3>
                  <p className="text-sm text-brand-300 mb-1">{cert.issuer}</p>
                  {cert.issue_date && (
                    <p className="text-xs text-slate-500 mb-2">Issued: {cert.issue_date}</p>
                  )}
                  {cert.credential_url && (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-accent-400 hover:text-accent-300 transition-colors"
                    >
                      View Credential
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {certifications.length === 0 && (
            <p className="text-slate-500 text-center py-8">No certifications added yet.</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
