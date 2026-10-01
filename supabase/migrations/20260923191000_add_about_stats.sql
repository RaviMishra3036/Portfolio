-- Store the About Me statistic cards alongside the independent About text.
ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS about_stats jsonb;

UPDATE site_settings
SET about_stats = '[
  {"value":"Full Stack","label":"Developer"},
  {"value":"30+","label":"Projects Completed"},
  {"value":"15+","label":"Technologies"}
]'::jsonb
WHERE about_stats IS NULL;
