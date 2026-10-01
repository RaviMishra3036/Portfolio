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
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-brand-400" />
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
