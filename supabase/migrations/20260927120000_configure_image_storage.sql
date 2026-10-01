-- Configure portfolio image storage buckets for profile and project uploads.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('profile', 'profile', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('projects', 'projects', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public can view portfolio images" ON storage.objects;
CREATE POLICY "Public can view portfolio images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id IN ('profile', 'projects'));

DROP POLICY IF EXISTS "Authenticated users can upload portfolio images" ON storage.objects;
CREATE POLICY "Authenticated users can upload portfolio images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id IN ('profile', 'projects'));

DROP POLICY IF EXISTS "Authenticated users can update portfolio images" ON storage.objects;
CREATE POLICY "Authenticated users can update portfolio images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id IN ('profile', 'projects'))
WITH CHECK (bucket_id IN ('profile', 'projects'));

DROP POLICY IF EXISTS "Authenticated users can delete portfolio images" ON storage.objects;
CREATE POLICY "Authenticated users can delete portfolio images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id IN ('profile', 'projects'));
