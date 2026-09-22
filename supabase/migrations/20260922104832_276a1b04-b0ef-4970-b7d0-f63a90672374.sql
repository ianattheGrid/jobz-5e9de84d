select cron.schedule(
  'fetch-adzuna-jobs-nightly',
  '30 0 * * *',
  $$
  select net.http_post(
    url := 'https://lfwwhyjtbkfibxzefvkn.supabase.co/functions/v1/fetch-adzuna-jobs',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);