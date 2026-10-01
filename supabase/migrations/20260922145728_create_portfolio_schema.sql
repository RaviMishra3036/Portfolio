/*
# Create Portfolio Database Schema

1. Overview
This migration creates the complete schema for a 3D Personal Portfolio with Admin Dashboard.
The app has a sign-in screen (admin login), so policies use authenticated-only access for admin operations.
Public portfolio data (profile, projects, skills, education, experience, certifications, services, social_links, resume, site_settings) is readable by everyone (anon + authenticated) but writable only by authenticated users.
Messages can be inserted by anyone (contact form) but read/updated/deleted only by authenticated users.

2. New Tables
- profile: single-row table with personal info (name, title, bio, photo URL, resume URL)
- skills: skill entries with category, proficiency, icon, display order
- projects: portfolio projects with title, descriptions, tech, image, links, category, featured flag
- education: education entries with degree, institution, period, description
- experience: work experience with position, company, period, description
- certifications: certification entries with name, issuer, date, URL
- services: service offerings with title, description, icon
- social_links: social media links (GitHub, LinkedIn, Instagram, YouTube, Twitter, Email)
- messages: contact form submissions with name, email, phone, subject, message, read status
- resume: resume file entries with URL, upload date
- site_settings: site-wide settings (theme, analytics, etc.)

3. Security
- RLS enabled on all tables.
- Public read access (anon + authenticated) on portfolio content tables.
- Write access (insert/update/delete) restricted to authenticated users only.
- Messages: anyone can insert (contact form), only authenticated can read/update/delete.
*/

-- Profile table (single row)
CREATE TABLE IF NOT EXISTS profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Your Name',
  title text NOT NULL DEFAULT 'Software Developer',
  bio text NOT NULL DEFAULT 'Passionate full-stack developer...',
  photo_url text,
  resume_url text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profile ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_profile" ON profile;
CREATE POLICY "public_read_profile" ON profile FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_profile" ON profile;
CREATE POLICY "auth_insert_profile" ON profile FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_profile" ON profile;
CREATE POLICY "auth_update_profile" ON profile FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_profile" ON profile;
CREATE POLICY "auth_delete_profile" ON profile FOR DELETE
  TO authenticated USING (true);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  proficiency integer NOT NULL DEFAULT 80 CHECK (proficiency >= 0 AND proficiency <= 100),
  icon text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_skills" ON skills;
CREATE POLICY "public_read_skills" ON skills FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_skills" ON skills;
CREATE POLICY "auth_insert_skills" ON skills FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_skills" ON skills;
CREATE POLICY "auth_update_skills" ON skills FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_skills" ON skills;
CREATE POLICY "auth_delete_skills" ON skills FOR DELETE
  TO authenticated USING (true);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  short_description text NOT NULL,
  detailed_description text,
  technologies text[] DEFAULT '{}',
  image_url text,
  github_url text,
  live_demo_url text,
  category text,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_projects" ON projects;
CREATE POLICY "public_read_projects" ON projects FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_projects" ON projects;
CREATE POLICY "auth_insert_projects" ON projects FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_projects" ON projects;
CREATE POLICY "auth_update_projects" ON projects FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_projects" ON projects;
CREATE POLICY "auth_delete_projects" ON projects FOR DELETE
  TO authenticated USING (true);

-- Education table
CREATE TABLE IF NOT EXISTS education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  degree text NOT NULL,
  institution text NOT NULL,
  start_date text,
  end_date text,
  description text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE education ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_education" ON education;
CREATE POLICY "public_read_education" ON education FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_education" ON education;
CREATE POLICY "auth_insert_education" ON education FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_education" ON education;
CREATE POLICY "auth_update_education" ON education FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_education" ON education;
CREATE POLICY "auth_delete_education" ON education FOR DELETE
  TO authenticated USING (true);

-- Experience table
CREATE TABLE IF NOT EXISTS experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  position text NOT NULL,
  company text NOT NULL,
  start_date text,
  end_date text,
  description text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE experience ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_experience" ON experience;
CREATE POLICY "public_read_experience" ON experience FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_experience" ON experience;
CREATE POLICY "auth_insert_experience" ON experience FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_experience" ON experience;
CREATE POLICY "auth_update_experience" ON experience FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_experience" ON experience;
CREATE POLICY "auth_delete_experience" ON experience FOR DELETE
  TO authenticated USING (true);

-- Certifications table
CREATE TABLE IF NOT EXISTS certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  issuer text NOT NULL,
  issue_date text,
  credential_url text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_certs" ON certifications;
CREATE POLICY "public_read_certs" ON certifications FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_certs" ON certifications;
CREATE POLICY "auth_insert_certs" ON certifications FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_certs" ON certifications;
CREATE POLICY "auth_update_certs" ON certifications FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_certs" ON certifications;
CREATE POLICY "auth_delete_certs" ON certifications FOR DELETE
  TO authenticated USING (true);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  icon text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_services" ON services;
CREATE POLICY "public_read_services" ON services FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_services" ON services;
CREATE POLICY "auth_insert_services" ON services FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_services" ON services;
CREATE POLICY "auth_update_services" ON services FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_services" ON services;
CREATE POLICY "auth_delete_services" ON services FOR DELETE
  TO authenticated USING (true);

-- Social links table
CREATE TABLE IF NOT EXISTS social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  url text NOT NULL,
  icon text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_social" ON social_links;
CREATE POLICY "public_read_social" ON social_links FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_social" ON social_links;
CREATE POLICY "auth_insert_social" ON social_links FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_social" ON social_links;
CREATE POLICY "auth_update_social" ON social_links FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_social" ON social_links;
CREATE POLICY "auth_delete_social" ON social_links FOR DELETE
  TO authenticated USING (true);

-- Messages table (contact form submissions)
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Anyone can insert messages (contact form)
DROP POLICY IF EXISTS "public_insert_messages" ON messages;
CREATE POLICY "public_insert_messages" ON messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Only authenticated (admin) can read messages
DROP POLICY IF EXISTS "auth_read_messages" ON messages;
CREATE POLICY "auth_read_messages" ON messages FOR SELECT
  TO authenticated USING (true);

-- Only authenticated can update (mark as read)
DROP POLICY IF EXISTS "auth_update_messages" ON messages;
CREATE POLICY "auth_update_messages" ON messages FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- Only authenticated can delete messages
DROP POLICY IF EXISTS "auth_delete_messages" ON messages;
CREATE POLICY "auth_delete_messages" ON messages FOR DELETE
  TO authenticated USING (true);

-- Resume table (track uploaded resumes)
CREATE TABLE IF NOT EXISTS resume (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_url text NOT NULL,
  file_name text,
  is_active boolean NOT NULL DEFAULT true,
  uploaded_at timestamptz DEFAULT now()
);

ALTER TABLE resume ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_resume" ON resume;
CREATE POLICY "public_read_resume" ON resume FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_resume" ON resume;
CREATE POLICY "auth_insert_resume" ON resume FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_resume" ON resume;
CREATE POLICY "auth_update_resume" ON resume FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_resume" ON resume;
CREATE POLICY "auth_delete_resume" ON resume FOR DELETE
  TO authenticated USING (true);

-- Site settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  theme text NOT NULL DEFAULT 'dark',
  site_title text NOT NULL DEFAULT 'Portfolio',
  meta_description text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_settings" ON site_settings;
CREATE POLICY "public_read_settings" ON site_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_settings" ON site_settings;
CREATE POLICY "auth_insert_settings" ON site_settings FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_settings" ON site_settings;
CREATE POLICY "auth_update_settings" ON site_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_settings" ON site_settings;
CREATE POLICY "auth_delete_settings" ON site_settings FOR DELETE
  TO authenticated USING (true);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  date text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_achievements" ON achievements;
CREATE POLICY "public_read_achievements" ON achievements FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_achievements" ON achievements;
CREATE POLICY "auth_insert_achievements" ON achievements FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_achievements" ON achievements;
CREATE POLICY "auth_update_achievements" ON achievements FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_achievements" ON achievements;
CREATE POLICY "auth_delete_achievements" ON achievements FOR DELETE
  TO authenticated USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_skills_display_order ON skills(display_order);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_education_display_order ON education(display_order);
CREATE INDEX IF NOT EXISTS idx_experience_display_order ON experience(display_order);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read);
