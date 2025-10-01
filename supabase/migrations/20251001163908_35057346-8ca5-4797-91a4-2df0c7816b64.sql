-- Add unique constraint on company_name to prevent duplicates
ALTER TABLE target_companies 
ADD CONSTRAINT target_companies_company_name_key UNIQUE (company_name);

-- Add major Bristol employers to target_companies table
INSERT INTO target_companies (company_name, careers_page_url, ats_type, location, is_active, last_scraped_at)
VALUES
  ('Hargreaves Lansdown', 'https://www.hl.co.uk/about-us/careers', 'workday', 'Bristol', true, null),
  ('Parmenion', 'https://parmenion.co.uk/careers/our-latest-opportunities/', 'generic', 'Bristol', true, null),
  ('LV= General Insurance', 'https://www.jobs.lv.com/gi/job-search/jobs?loc=Bristol', 'generic', 'Bristol', true, null),
  ('Airbus', 'https://www.airbus.com/en/careers', 'workday', 'Bristol', true, null),
  ('Rolls-Royce', 'https://careers.rolls-royce.com/united-kingdom/search-and-apply', 'generic', 'Bristol', true, null),
  ('Leonardo UK', 'https://careers.uk.leonardo.com/gb/en', 'generic', 'Bristol', true, null),
  ('Burges Salmon', 'https://www.burges-salmon.com/careers/', 'generic', 'Bristol', true, null),
  ('TLT Solicitors', 'https://www.tltsolicitors.com/careers/', 'generic', 'Bristol', true, null),
  ('EY Bristol', 'https://www.ey.com/en_uk/careers/locations/bristol', 'generic', 'Bristol', true, null),
  ('Just Eat Takeaway', 'https://careers.justeattakeaway.com/', 'greenhouse', 'Bristol', true, null)
ON CONFLICT (company_name) DO NOTHING;