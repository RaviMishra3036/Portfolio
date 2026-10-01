import { motion } from 'framer-motion';
import { Heart, Terminal } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative py-6 px-6 border-t border-white/5">
      {/* Gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-2.5 mb-3"
        >
          <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/20 to-accent-500/20 border border-brand-500/20">
            <Terminal className="w-4 h-4 text-brand-400" />
          </div>
          <span className="font-display text-lg font-bold gradient-text">Ravi Kumar Mishra</span>
        </motion.div>

        {/* <p className="text-sm text-slate-500 flex items-center justify-center gap-1.5">
          Built with <Heart className="w-3.5 h-3.5 text-red-400 fill-current" /> using React & Supabase
        </p> */}
        <p className="text-xs text-slate-600 mt-2">© {new Date().getFullYear()} Ravi Kumar Mishra. All rights reserved.</p>
      </div>
    </footer>
  );
}
