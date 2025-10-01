-- Enable pg_cron extension for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule job scraping to run daily at 2 AM UTC
SELECT cron.schedule(
  'daily-job-scraping',
  '0 2 * * *',
  $$
  SELECT
    net.http_post(
        url:='https://lfwwhyjtbkfibxzefvkn.supabase.co/functions/v1/scrape-external-jobs',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxmd3doeWp0YmtmaWJ4emVmdmtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwNTI1MjQsImV4cCI6MjA0ODYyODUyNH0.R2Zb2y2A6GRkCrZXLcU_h1drMWI9NUZ8tXPUgCdPNAM"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);

-- Schedule candidate matching to run daily at 2:30 AM UTC (after scraping)
SELECT cron.schedule(
  'daily-candidate-matching',
  '30 2 * * *',
  $$
  SELECT
    net.http_post(
        url:='https://lfwwhyjtbkfibxzefvkn.supabase.co/functions/v1/match-external-jobs',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxmd3doeWp0YmtmaWJ4emVmdmtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwNTI1MjQsImV4cCI6MjA0ODYyODUyNH0.R2Zb2y2A6GRkCrZXLcU_h1drMWI9NUZ8tXPUgCdPNAM"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);