/*
# Fix index typo and seed initial portfolio data

1. Fix: Drop the misspelled index on projects(featured) and create the correct one on projects(featured) -> projects(featured)
2. Seed: Insert initial data into profile, skills, projects, education, experience, certifications, services, social_links, site_settings, achievements
*/

DROP INDEX IF EXISTS idx_projects_featured;
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
