-- Storage bucket for project images uploaded from the admin panel.

INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "public_read_project_images" ON storage.objects;
CREATE POLICY "public_read_project_images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'project-images');

DROP POLICY IF EXISTS "auth_upload_project_images" ON storage.objects;
CREATE POLICY "auth_upload_project_images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'project-images');

DROP POLICY IF EXISTS "auth_delete_project_images" ON storage.objects;
CREATE POLICY "auth_delete_project_images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'project-images');