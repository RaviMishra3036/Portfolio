export interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string;
  photo_url: string | null;
  resume_url: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  icon: string;
  display_order: number;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  short_description: string;
  detailed_description: string | null;
  technologies: string[];
  image_url: string | null;
  github_url: string | null;
  live_demo_url: string | null;
  category: string | null;
  featured: boolean;
  created_at: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  display_order: number;
  created_at: string;
}

export interface Experience {
  id: string;
  position: string;
  company: string;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  display_order: number;
  created_at: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issue_date: string | null;
  credential_url: string | null;
  display_order: number;
  created_at: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  display_order: number;
  created_at: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  display_order: number;
  created_at: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Resume {
  id: string;
  file_url: string;
  file_name: string | null;
  is_active: boolean;
  uploaded_at: string;
}

export interface SiteSettings {
  id: string;
  theme: string;
  site_title: string;
  meta_description: string | null;
  about_text: string | null;
  about_stats: Array<{ value: string; label: string }> | null;
  updated_at: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string | null;
  date: string | null;
  display_order: number;
  created_at: string;
}
