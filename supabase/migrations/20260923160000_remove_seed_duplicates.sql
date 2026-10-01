-- Remove duplicate seed rows and prevent the same seed data from appearing repeatedly.

DELETE FROM profile
WHERE id <> (
  SELECT id
  FROM profile
  ORDER BY updated_at DESC NULLS LAST, id DESC
  LIMIT 1
);

CREATE UNIQUE INDEX IF NOT EXISTS profile_single_row_unique
  ON profile ((true));

DELETE FROM social_links a
USING social_links b
WHERE a.id > b.id AND lower(trim(a.platform)) = lower(trim(b.platform));

CREATE UNIQUE INDEX IF NOT EXISTS social_links_platform_unique
  ON social_links (lower(trim(platform)));

DELETE FROM skills a
USING skills b
WHERE a.id > b.id
  AND lower(trim(a.name)) = lower(trim(b.name))
  AND lower(trim(a.category)) = lower(trim(b.category));

CREATE UNIQUE INDEX IF NOT EXISTS skills_name_category_unique
  ON skills (lower(trim(name)), lower(trim(category)));

DELETE FROM certifications a
USING certifications b
WHERE a.id > b.id
  AND lower(trim(a.name)) = lower(trim(b.name))
  AND lower(trim(a.issuer)) = lower(trim(b.issuer));

CREATE UNIQUE INDEX IF NOT EXISTS certifications_name_issuer_unique
  ON certifications (lower(trim(name)), lower(trim(issuer)));

DELETE FROM projects a
USING projects b
WHERE a.id > b.id AND lower(trim(a.title)) = lower(trim(b.title));

CREATE UNIQUE INDEX IF NOT EXISTS projects_title_unique
  ON projects (lower(trim(title)));

DELETE FROM education a
USING education b
WHERE a.id > b.id
  AND lower(trim(a.degree)) = lower(trim(b.degree))
  AND lower(trim(a.institution)) = lower(trim(b.institution));

CREATE UNIQUE INDEX IF NOT EXISTS education_degree_institution_unique
  ON education (lower(trim(degree)), lower(trim(institution)));

DELETE FROM services a
USING services b
WHERE a.id > b.id AND lower(trim(a.title)) = lower(trim(b.title));

CREATE UNIQUE INDEX IF NOT EXISTS services_title_unique
  ON services (lower(trim(title)));

DELETE FROM achievements a
USING achievements b
WHERE a.id > b.id AND lower(trim(a.title)) = lower(trim(b.title));

CREATE UNIQUE INDEX IF NOT EXISTS achievements_title_unique
  ON achievements (lower(trim(title)));