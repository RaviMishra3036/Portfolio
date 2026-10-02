import { usePortfolioData } from '@/hooks/usePortfolioData';
import Background3D from '@/components/portfolio/Background3D';
import Navbar from '@/components/portfolio/Navbar';
import Hero from '@/components/portfolio/Hero';
import About from '@/components/portfolio/About';
import Skills from '@/components/portfolio/Skills';
import EducationSection from '@/components/portfolio/Education';
import Projects from '@/components/portfolio/Projects';
import Services from '@/components/portfolio/Services';
import Certifications from '@/components/portfolio/Certifications';
import Achievements from '@/components/portfolio/Achievements';
import ResumeSection from '@/components/portfolio/ResumeSection';
import Contact from '@/components/portfolio/Contact';
import Footer from '@/components/portfolio/Footer';
import AIChat from '@/components/portfolio/AIChat';
import { Loader2 } from 'lucide-react';

export default function Portfolio() {
  const {
    profile, skills, projects, education,
    certifications, services, socialLinks, achievements, settings, loading,
  } = usePortfolioData();

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-slate-950 px-6"
        role="status"
        aria-live="polite"
        aria-label="Loading portfolio"
      >
        <div className="w-full max-w-sm text-center">
          <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-brand-400/20" />
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-brand-400 border-r-emerald-400" />
            <Loader2 className="h-8 w-8 animate-spin text-brand-400" aria-hidden="true" />
          </div>
          <h1 className="font-display text-xl font-semibold text-white">Loading portfolio</h1>
          <p className="mt-2 text-sm text-slate-400">
            Your connection is taking a little longer. Please wait...
          </p>
          <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-brand-400 to-emerald-400" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio-page relative min-h-screen">
      <Background3D />
      <Navbar />
      <main>
        <Hero profile={profile} socialLinks={socialLinks} />
        <About settings={settings} />
        <Skills skills={skills} />
        <EducationSection education={education} />
        <Projects projects={projects} />
        <Services services={services} />
        <Certifications certifications={certifications} />
        <Achievements achievements={achievements} />
        <ResumeSection profile={profile} />
        <Contact profile={profile} />
      </main>
      <Footer />
      <AIChat />
    </div>
  );
}
