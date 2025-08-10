-- Make CV bucket private and add strict RLS policies for candidates
-- Note: We remove any existing policies on 'cvs' to avoid duplicates, then recreate minimal secure ones

-- Ensure bucket exists and set to private
update storage.buckets
set public = false
where id = 'cvs';

-- Remove existing policies for the cvs bucket (idempotent)
delete from storage.policies where bucket_id = 'cvs';

-- Create RLS policies for cvs bucket: candidates can manage files in a folder named by their user id
-- INSERT
insert into storage.policies (name, definition, bucket_id)
values (
  'Candidates can upload their own CV',
  '(bucket_id = ''cvs'' AND auth.role() = ''authenticated'' AND (storage.foldername(name))[1] = auth.uid()::text)',
  'cvs'
);

-- SELECT (read)
insert into storage.policies (name, definition, bucket_id)
values (
  'Candidates can read their own CV',
  '(bucket_id = ''cvs'' AND auth.role() = ''authenticated'' AND (storage.foldername(name))[1] = auth.uid()::text)',
  'cvs'
);

-- UPDATE
insert into storage.policies (name, definition, bucket_id)
values (
  'Candidates can update their own CV',
  '(bucket_id = ''cvs'' AND auth.role() = ''authenticated'' AND (storage.foldername(name))[1] = auth.uid()::text)',
  'cvs'
);

-- DELETE
insert into storage.policies (name, definition, bucket_id)
values (
  'Candidates can delete their own CV',
  '(bucket_id = ''cvs'' AND auth.role() = ''authenticated'' AND (storage.foldername(name))[1] = auth.uid()::text)',
  'cvs'
);
