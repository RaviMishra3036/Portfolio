import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type {
  Profile, Skill, Project, Education, Experience, Certification,
  Service, SocialLink, Achievement, SiteSettings
} from '@/lib/types';

const PORTFOLIO_CACHE_KEY = 'portfolio-data-cache-v1';
const PORTFOLIO_REQUEST_TIMEOUT = 5000;

interface PortfolioSnapshot {
  profile: Profile | null;
  skills: Skill[];
  projects: Project[];
  education: Education[];
  experience: Experience[];
  certifications: Certification[];
  services: Service[];
  socialLinks: SocialLink[];
  achievements: Achievement[];
  settings: SiteSettings | null;
}

function readCachedPortfolio(): PortfolioSnapshot | null {
  try {
    const cached = localStorage.getItem(PORTFOLIO_CACHE_KEY);
    return cached ? JSON.parse(cached) as PortfolioSnapshot : null;
  } catch {
    return null;
  }
}

function cachePortfolio(snapshot: PortfolioSnapshot) {
  try {
    localStorage.setItem(PORTFOLIO_CACHE_KEY, JSON.stringify(snapshot));
  } catch {
    // Keep the online experience working when storage is unavailable or full.
  }
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      window.setTimeout(() => reject(new Error('Portfolio request timed out')), timeoutMs);
    }),
  ]);
}

export function usePortfolioData() {
  const cached = readCachedPortfolio();
  const [profile, setProfile] = useState<Profile | null>(cached?.profile || null);
  const [skills, setSkills] = useState<Skill[]>(cached?.skills || []);
  const [projects, setProjects] = useState<Project[]>(cached?.projects || []);
  const [education, setEducation] = useState<Education[]>(cached?.education || []);
  const [experience, setExperience] = useState<Experience[]>(cached?.experience || []);
  const [certifications, setCertifications] = useState<Certification[]>(cached?.certifications || []);
  const [services, setServices] = useState<Service[]>(cached?.services || []);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(cached?.socialLinks || []);
  const [achievements, setAchievements] = useState<Achievement[]>(cached?.achievements || []);
  const [settings, setSettings] = useState<SiteSettings | null>(cached?.settings || null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let disposed = false;
    let latestRequestId = 0;

    async function fetchAll() {
      const requestId = ++latestRequestId;
      let results;

      try {
        results = await withTimeout(Promise.all([
          supabase.from('profile').select('*').maybeSingle(),
          supabase.from('skills').select('*').order('display_order'),
          supabase.from('projects').select('*').order('created_at', { ascending: false }),
          supabase.from('education').select('*').order('display_order'),
          supabase.from('experience').select('*').order('display_order'),
          supabase.from('certifications').select('*').order('display_order'),
          supabase.from('services').select('*').order('display_order'),
          supabase.from('social_links').select('*').order('display_order'),
          supabase.from('achievements').select('*').order('display_order'),
          supabase.from('site_settings').select('*').order('updated_at', { ascending: false }).limit(1).maybeSingle(),
        ]), PORTFOLIO_REQUEST_TIMEOUT);
      } catch {
        if (disposed || requestId !== latestRequestId) return;
        const snapshot = readCachedPortfolio();
        if (snapshot) {
          setProfile(snapshot.profile);
          setSkills(snapshot.skills);
          setProjects(snapshot.projects);
          setEducation(snapshot.education);
          setExperience(snapshot.experience);
          setCertifications(snapshot.certifications);
          setServices(snapshot.services);
          setSocialLinks(snapshot.socialLinks);
          setAchievements(snapshot.achievements);
          setSettings(snapshot.settings);
          setLoadError(false);
        } else {
          setLoadError(true);
        }
        setLoading(false);
        return;
      }

      if (disposed || requestId !== latestRequestId) return;

      const [
        { data: p }, { data: s }, { data: pr }, { data: ed },
        { data: ex }, { data: c }, { data: sv }, { data: sl },
        { data: ac }, { data: st }
      ] = results;
      const hasRequestError = results.some(({ error }) => error);
      if (hasRequestError && !readCachedPortfolio()) {
        setLoadError(true);
        setLoading(false);
        return;
      }

      const onlineData = [p, s, pr, ed, ex, c, sv, sl, ac, st];
      const snapshot = readCachedPortfolio();
      if (onlineData.every((value) => value === null) && snapshot) {
        setProfile(snapshot.profile);
        setSkills(snapshot.skills);
        setProjects(snapshot.projects);
        setEducation(snapshot.education);
        setExperience(snapshot.experience);
        setCertifications(snapshot.certifications);
        setServices(snapshot.services);
        setSocialLinks(snapshot.socialLinks);
        setAchievements(snapshot.achievements);
        setSettings(snapshot.settings);
        setLoadError(false);
        setLoading(false);
        return;
      }

      setProfile(p as Profile | null);
      setSkills((s as Skill[]) || []);
      setProjects((pr as Project[]) || []);
      setEducation((ed as Education[]) || []);
      setExperience((ex as Experience[]) || []);
      setCertifications((c as Certification[]) || []);
      setServices((sv as Service[]) || []);
      const uniqueSocialLinks = (sl as SocialLink[] || []).filter((link, index, links) => (
        links.findIndex((candidate) => candidate.platform === link.platform) === index
      ));
      setSocialLinks(uniqueSocialLinks);
      setAchievements((ac as Achievement[]) || []);
      setSettings(st as SiteSettings | null);
      setLoadError(false);
      cachePortfolio({
        profile: p as Profile | null,
        skills: (s as Skill[]) || [],
        projects: (pr as Project[]) || [],
        education: (ed as Education[]) || [],
        experience: (ex as Experience[]) || [],
        certifications: (c as Certification[]) || [],
        services: (sv as Service[]) || [],
        socialLinks: uniqueSocialLinks,
        achievements: (ac as Achievement[]) || [],
        settings: st as SiteSettings | null,
      });
      setLoading(false);
    }

    void fetchAll();

    const refreshTimer = window.setInterval(fetchAll, 3000);
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') void fetchAll();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const channel = supabase
      .channel('portfolio-data-sync')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        void fetchAll();
      })
      .subscribe();

    return () => {
      disposed = true;
      window.clearInterval(refreshTimer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      void supabase.removeChannel(channel);
    };
  }, []);

  return {
    profile, skills, projects, education, experience,
    certifications, services, socialLinks, achievements, settings, loading, loadError,
  };
}
