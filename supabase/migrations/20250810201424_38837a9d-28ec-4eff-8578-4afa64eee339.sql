-- Trigger the run-e2e-smoke edge function once via pg_net (idempotent and non-fatal)
DO $$
BEGIN
  PERFORM net.http_post(
    url := 'https://lfwwhyjtbkfibxzefvkn.supabase.co/functions/v1/run-e2e-smoke',
    headers := '{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxmd3doeWp0YmtmaWJ4emVmdmtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwNTI1MjQsImV4cCI6MjA0ODYyODUyNH0.R2Zb2y2A6GRkCrZXLcU_h1drMWI9NUZ8tXPUgCdPNAM"}'::jsonb,
    body := '{"trigger":"manual"}'::jsonb
  );
EXCEPTION WHEN OTHERS THEN
  -- ignore any errors to avoid breaking deployment
  NULL;
END$$;