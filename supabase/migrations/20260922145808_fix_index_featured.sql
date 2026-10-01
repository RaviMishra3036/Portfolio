/*
# Fix index: projects.featured column name

The column is "featured" not "feature". Drop the bad index and create the correct one.
*/
DROP INDEX IF EXISTS idx_projects_featured;
DROP INDEX IF EXISTS idx_projects_feature;
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
