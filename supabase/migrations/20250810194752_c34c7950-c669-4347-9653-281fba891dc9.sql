-- Enable required extensions (idempotent)
create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

-- Schedule nightly run at 02:00 UTC to invoke the nightly-e2e function
select cron.schedule(
  'nightly-e2e-02utc',
  '0 2 * * *',
  $$
  select net.http_post(
      url:='https://lfwwhyjtbkfibxzefvkn.supabase.co/functions/v1/nightly-e2e',
      headers:='{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxmd3doeWp0YmtmaWJ4emVmdmtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwNTI1MjQsImV4cCI6MjA0ODYyODUyNH0.R2Zb2y2A6GRkCrZXLcU_h1drMWI9NUZ8tXPUgCdPNAM"}'::jsonb,
      body:='{"trigger":"cron"}'::jsonb
  );
  $$
);
