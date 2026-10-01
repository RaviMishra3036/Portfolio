/*
# Fix index: correct column name is "featured"

Drop any incorrect indexes and create the correct one.
*/
DROP INDEX IF EXISTS idx_projects_featured;
DROP INDEX IF EXISTS idx_projects_feature;
DROP INDEX IF EXISTS idx_projects_feature;
CREATE INDEX IF NOT EXISTS idx_projects_featured_col ON projects(featured);
