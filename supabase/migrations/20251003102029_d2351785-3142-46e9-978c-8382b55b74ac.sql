-- Update Aardman's careers page URL to point directly to their jobs listing page
UPDATE target_companies
SET careers_page_url = 'https://jobs.aardman.com/vacancies/vacancy-search-results.aspx'
WHERE company_name LIKE '%Aardman%';