import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Menu, X, Terminal, Sun, Moon } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Education', href: '#education' },
  { label: 'Projects', href: '#projects' },
  { label: 'Services', href: '#services' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Resume', href: '#resume' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#home');
  const [isLight, setIsLight] = useState(() => localStorage.getItem('theme') === 'light');

  const { scrollYProgress } = useScroll();
  const progressScale = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(`#${entry.target.id}`);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    navLinks.forEach((l) => {
      const el = document.querySelector(l.href);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    setActiveSection(href);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    document.documentElement.dataset.theme = isLight ? 'light' : 'dark';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  }, [isLight]);

  const toggleTheme = () => setIsLight((current) => !current);

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 origin-left z-[60] bg-gradient-to-r from-brand-500 via-accent-500 to-brand-500"
        style={{ scaleX: progressScale }}
      />

      <nav
        className="fixed top-0 left-0 right-0 z-50 py-4 isolate"
      >
        <div className={`relative z-10 max-w-7xl mx-auto px-6 flex items-center justify-between glass-strong rounded-full transition-all duration-500 ${scrolled ? 'py-2.5' : 'py-3'}`}>
          <button
            onClick={() => scrollTo('#home')}
            className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight group"
          >
            <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/20 to-accent-500/20 border border-brand-500/20 group-hover:scale-110 transition-transform">
              <Terminal className="w-4 h-4 text-brand-400" />
            </div>
            <span className="text-white font-display text-base sm:text-lg font-bold tracking-tight">RAVI MISHRA</span>
          </button>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className={`relative px-3 py-2 text-sm transition-colors rounded-lg ${
                  activeSection === link.href
                    ? 'text-white'
                    : 'text-slate-200 hover:text-white'
                }`}
              >
                {link.label}
                {activeSection === link.href && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full border border-white/15 bg-white/10 -z-10"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            ))}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
              title={`Switch to ${isLight ? 'dark' : 'light'} mode`}
              className="nav-theme-toggle ml-2 p-2 text-slate-200 hover:text-white rounded-lg transition-all"
            >
              {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>

          {/* Mobile toggle */}
          <div className="relative z-10 lg:hidden flex items-center gap-1">
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
              title={`Switch to ${isLight ? 'dark' : 'light'} mode`}
              className="nav-theme-toggle p-2 text-slate-200 hover:text-white transition-colors"
            >
              {isLight ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-slate-200 hover:text-white transition-colors"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 z-40 lg:hidden glass-strong border-t border-white/5"
          >
            <div className="px-6 py-4 flex flex-col gap-1 max-h-[80vh] overflow-y-auto">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className={`px-4 py-3 text-left text-sm rounded-lg transition-colors ${
                    activeSection === link.href
                      ? 'text-white bg-white/5'
                      : 'text-slate-200 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
