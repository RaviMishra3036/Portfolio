import { motion } from 'framer-motion';
import { Wrench } from 'lucide-react';
import type { Service } from '@/lib/types';
import * as Icons from 'lucide-react';

export default function Services({ services }: { services: Service[] }) {
  const getIcon = (iconName: string) => {
    const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[iconName];
    return Icon ? <Icon className="w-6 h-6" /> : <Icons.Wrench className="w-6 h-6" />;
  };

  return (
    <section id="services" className="relative py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="section-label mb-5">
            <Wrench className="w-3.5 h-3.5" />
            Services
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-12">
            What I Offer
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.1, duration: 0.5 }}
                whileHover={{ y: -8 }}
                className="group glass-card card-hover rounded-2xl p-7 relative overflow-hidden"
              >
                {/* Hover gradient glow */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500/15 to-accent-500/15 text-brand-400 mb-5 group-hover:scale-110 group-hover:from-brand-500/25 group-hover:to-accent-500/25 transition-all">
                  {getIcon(service.icon)}
                </div>
                <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-brand-300 transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>

          {services.length === 0 && (
            <p className="text-slate-500 text-center py-8">No services added yet.</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
