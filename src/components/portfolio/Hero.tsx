import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Mail, Code2, Server, Layers } from 'lucide-react';
import type { Profile, SocialLink } from '@/lib/types';
import * as Icons from 'lucide-react';

interface HeroProps {
  profile: Profile | null;
  socialLinks: SocialLink[];
}

const titles = ['Java Full Stack Developer', 'Spring Boot', 'Java Backend','Spring Boot','Hibernate','Node.js'];

export default function Hero({ profile, socialLinks }: HeroProps) {
  const [typed, setTyped] = useState('');
  const [titleIdx, setTitleIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [profile?.photo_url]);

  useEffect(() => {
    const fullTitle = titles[titleIdx];
    const speed = deleting ? 50 : 100;

    const timer = setTimeout(() => {
      if (!deleting && typed === fullTitle) {
        setTimeout(() => setDeleting(true), 2000);
        return;
      }
      if (deleting && typed === '') {
        setDeleting(false);
        setTitleIdx((prev) => (prev + 1) % titles.length);
        return;
      }
      setTyped(deleting ? fullTitle.slice(0, typed.length - 1) : fullTitle.slice(0, typed.length + 1));
    }, speed);

    return () => clearTimeout(timer);
  }, [typed, deleting, titleIdx]);

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  const getIcon = (iconName: string) => {
    const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[iconName];
    return Icon ? <Icon className="w-5 h-5" /> : <Icons.Globe className="w-5 h-5" />;
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center px-6 pt-28 pb-16">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="order-2 lg:order-1 text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 text-sm text-slate-300"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-400" />
              </span>
              Available for new opportunities
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-3"
            >
              {profile?.name || 'Your Name'}
            </motion.h1>

            <div className="h-8 mb-6 flex items-center justify-center lg:justify-start">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xl sm:text-2xl font-mono font-medium text-brand-400"
              >
                {typed}
                <span className="animate-blink text-brand-400">|</span>
              </motion.p>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8 text-balance"
            >
              {profile?.bio || 'Passionate developer creating amazing experiences.'}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8"
            >
              <button
                onClick={() => scrollTo('#projects')}
                className="btn-primary group flex items-center gap-2 px-6 py-3 text-white font-medium rounded-xl shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-0.5"
              >
                <span>View Projects</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              {profile?.resume_url ? (
                <a
                  href={profile.resume_url}
                  download
                  className="btn-ghost resume-link-border flex items-center gap-2 px-6 py-3 glass-strong hover:bg-white/10 text-white font-medium rounded-xl hover:-translate-y-0.5"
                >
                  <Download className="w-4 h-4" />
                  Resume
                </a>
              ) : (
                <button
                  onClick={() => scrollTo('#resume')}
                  className="btn-ghost flex items-center gap-2 px-6 py-3 glass-strong hover:bg-white/10 text-white font-medium rounded-xl hover:-translate-y-0.5"
                >
                  <Download className="w-4 h-4" />
                  Resume
                </button>
              )}
              <button
                onClick={() => scrollTo('#contact')}
                className="btn-ghost flex items-center gap-2 px-6 py-3 glass-strong hover:bg-white/10 text-white font-medium rounded-xl hover:-translate-y-0.5"
              >
                <Mail className="w-4 h-4" />
                Contact
              </button>
            </motion.div>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex gap-3 justify-center lg:justify-start"
            >
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-social-link w-11 h-11 flex items-center justify-center glass hover:bg-brand-500/15 text-slate-400 hover:text-brand-300 rounded-xl transition-all hover:-translate-y-1 hover:border-brand-500/20"
                  title={link.platform}
                >
                  {getIcon(link.icon)}
                </a>
              ))}
            </motion.div>
          </motion.div>

          {/* 3D Profile visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <div className="perspective-2000">
              <motion.div
                animate={{ rotateY: [0, 8, 0], rotateX: [0, -5, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="relative preserve-3d"
              >
                {/* Outer orbit ring */}
                <div className="absolute -inset-12 rounded-full border border-brand-500/10 animate-spin-slow" />
                <div className="absolute -inset-8 rounded-full border border-accent-500/10 animate-spin-reverse" />

                {/* Orbiting tech icons */}
                <div className="absolute -inset-12 animate-spin-slow">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 flex items-center justify-center rounded-xl glass-strong text-brand-400">
                    <Code2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="absolute -inset-12 animate-spin-reverse">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-10 flex items-center justify-center rounded-xl glass-strong text-accent-400">
                    <Server className="w-5 h-5" />
                  </div>
                </div>
                <div className="absolute -inset-8 animate-spin-slow">
                  <div className="absolute top-1/2 right-0 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-xl glass-strong text-brand-300">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>

                {/* Glow */}
                <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-brand-500/20 via-accent-500/10 to-transparent blur-2xl animate-pulse-glow" />

                {/* Profile circle */}
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full glass-strong border-2 border-white/10 overflow-hidden glow">
                  {profile?.photo_url && !imageFailed ? (
                    <img
                      src={profile.photo_url}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                      onError={() => setImageFailed(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-500/20 to-accent-500/20">
                      <span className="font-display text-7xl font-bold gradient-text">
                        {profile?.name?.charAt(0) || 'Y'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Floating badges */}
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-1 -right-1 glass-strong px-4 py-2 rounded-2xl text-sm font-semibold text-accent-300 border border-accent-500/20"
                >
                  Fresher
                </motion.div>
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute -bottom-1 -left-1 glass-strong px-4 py-2 rounded-2xl text-sm font-semibold text-brand-300 border border-brand-500/20"
                >
                  Full Stack
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:block"
      >
        <div className="w-6 h-10 border-2 border-slate-600/50 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-slate-500 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
