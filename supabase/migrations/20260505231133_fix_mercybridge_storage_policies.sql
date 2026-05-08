-- Repair MercyBridge document upload access in production.
-- The request-help flow uploads bills to:
--   mercybridge-documents/<auth.uid()>/<timestamp>_<filename>
-- Storage RLS must allow authenticated users to manage objects in their own
-- top-level folder, while keeping the bucket private.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'mercybridge-documents',
  'mercybridge-documents',
  false,
  10485760,
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'application/pdf']::text[]
)
ON CONFLICT (id) DO UPDATE
SET public = false,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp', 'application/pdf']::text[];

DROP POLICY IF EXISTS "Users can upload own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can read own documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can read all documents" ON storage.objects;
DROP POLICY IF EXISTS "mercybridge_documents_select_own" ON storage.objects;
DROP POLICY IF EXISTS "mercybridge_documents_insert_own" ON storage.objects;
DROP POLICY IF EXISTS "mercybridge_documents_update_own" ON storage.objects;
DROP POLICY IF EXISTS "mercybridge_documents_admin_all" ON storage.objects;

CREATE POLICY "mercybridge_documents_select_own" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'mercybridge-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "mercybridge_documents_insert_own" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'mercybridge-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "mercybridge_documents_update_own" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'mercybridge-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'mercybridge-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "mercybridge_documents_delete_own" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'mercybridge-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "mercybridge_documents_admin_all" ON storage.objects
  FOR ALL TO authenticated
  USING (
    bucket_id = 'mercybridge-documents'
    AND is_mercybridge_admin()
  )
  WITH CHECK (
    bucket_id = 'mercybridge-documents'
    AND is_mercybridge_admin()
  );
