-- Keep About Me content independent from profile.bio.
ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS about_text text;

UPDATE site_settings
SET about_text = (
  SELECT bio
  FROM profile
  ORDER BY updated_at DESC
  LIMIT 1
)
WHERE about_text IS NULL;
