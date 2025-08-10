-- Secure CV storage: make bucket private and add RLS policies on storage.objects

-- Make bucket private (idempotent)
update storage.buckets
set public = false
where id = 'cvs';

-- Ensure RLS is enabled on storage.objects (it is by default, but keep for clarity)
alter table if exists storage.objects enable row level security;

-- Drop existing policies for cvs bucket if they exist to avoid duplicates
-- Note: policy names must be unique per table
DO $$
BEGIN
  PERFORM 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'cvs_insert_own';
  IF FOUND THEN EXECUTE 'DROP POLICY "cvs_insert_own" ON storage.objects'; END IF;
  PERFORM 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'cvs_select_own';
  IF FOUND THEN EXECUTE 'DROP POLICY "cvs_select_own" ON storage.objects'; END IF;
  PERFORM 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'cvs_update_own';
  IF FOUND THEN EXECUTE 'DROP POLICY "cvs_update_own" ON storage.objects'; END IF;
  PERFORM 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'cvs_delete_own';
  IF FOUND THEN EXECUTE 'DROP POLICY "cvs_delete_own" ON storage.objects'; END IF;
END$$;

-- Create policies: authenticated users can manage files within folder named by their user id
create policy "cvs_insert_own" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'cvs'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "cvs_select_own" on storage.objects
for select to authenticated
using (
  bucket_id = 'cvs'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "cvs_update_own" on storage.objects
for update to authenticated
using (
  bucket_id = 'cvs'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'cvs'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "cvs_delete_own" on storage.objects
for delete to authenticated
using (
  bucket_id = 'cvs'
  and (storage.foldername(name))[1] = auth.uid()::text
);
