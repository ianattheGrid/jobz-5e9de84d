import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders } from '../_shared/cors.ts';

interface CompanyToScrape {
  id: string;
  company_name: string;
  careers_page_url: string;
  ats_type: string | null;
}

interface ScrapedJob {
  company_id: string;
  job_title: string;
  job_description: string;
  location: string;
  job_url: string;
  salary_min?: number;
  salary_max?: number;
  contract_type?: string;
  posting_date?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting external job scraping...');

    // Get companies that need scraping (haven't been scraped in the last 24 hours or never scraped)
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - 24);

    const { data: companies, error: companiesError } = await supabase
      .from('target_companies')
      .select('id, company_name, careers_page_url, ats_type')
      .eq('is_active', true)
      .or(`last_scraped_at.is.null,last_scraped_at.lt.${cutoffTime.toISOString()}`);

    if (companiesError) {
      console.error('Error fetching companies:', companiesError);
      throw companiesError;
    }

    console.log(`Found ${companies?.length || 0} companies to scrape`);

    let totalJobsScraped = 0;
    const scrapedJobs: ScrapedJob[] = [];

    for (const company of companies || []) {
      console.log(`Scraping ${company.company_name}...`);
      
      try {
        const jobs = await scrapeCompanyJobs(company);
        console.log(`Found ${jobs.length} jobs for ${company.company_name}`);
        
        for (const job of jobs) {
          // Check if job already exists (by URL)
          const { data: existingJob } = await supabase
            .from('external_jobs')
            .select('id')
            .eq('job_url', job.job_url)
            .maybeSingle();

          if (!existingJob) {
            // Insert new job
            const { error: insertError } = await supabase
              .from('external_jobs')
              .insert({
                ...job,
                scraped_at: new Date().toISOString(),
              });

            if (insertError) {
              console.error(`Error inserting job: ${insertError.message}`);
            } else {
              totalJobsScraped++;
              scrapedJobs.push(job);
            }
          } else {
            // Update existing job
            const { error: updateError } = await supabase
              .from('external_jobs')
              .update({
                job_title: job.job_title,
                job_description: job.job_description,
                location: job.location,
                is_active: true,
                scraped_at: new Date().toISOString(),
              })
              .eq('id', existingJob.id);

            if (updateError) {
              console.error(`Error updating job: ${updateError.message}`);
            }
          }
        }

        // Update last_scraped_at for company
        await supabase
          .from('target_companies')
          .update({ last_scraped_at: new Date().toISOString() })
          .eq('id', company.id);

      } catch (error) {
        console.error(`Error scraping ${company.company_name}:`, error);
      }
    }

    // Mark jobs as inactive if they weren't found in latest scrape
    const jobUrls = scrapedJobs.map(j => j.job_url);
    if (jobUrls.length > 0) {
      await supabase
        .from('external_jobs')
        .update({ is_active: false })
        .not('job_url', 'in', `(${jobUrls.join(',')})`)
        .lt('scraped_at', cutoffTime.toISOString());
    }

    console.log(`Scraping complete. Total new jobs: ${totalJobsScraped}`);

    return new Response(
      JSON.stringify({
        success: true,
        companies_scraped: companies?.length || 0,
        total_jobs_found: totalJobsScraped,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in scrape-external-jobs:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

async function scrapeCompanyJobs(company: CompanyToScrape): Promise<ScrapedJob[]> {
  const jobs: ScrapedJob[] = [];

  try {
    const response = await fetch(company.careers_page_url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch ${company.careers_page_url}: ${response.status}`);
      return jobs;
    }

    const html = await response.text();

    // Parse based on ATS type or generic scraping
    if (company.ats_type === 'greenhouse') {
      return parseGreenhouseJobs(html, company);
    } else if (company.ats_type === 'lever') {
      return parseLeverJobs(html, company);
    } else if (company.ats_type === 'workday') {
      return parseWorkdayJobs(html, company);
    } else {
      // Generic parsing for custom career pages
      return parseGenericJobs(html, company);
    }
  } catch (error) {
    console.error(`Error scraping ${company.company_name}:`, error);
    return jobs;
  }
}

function parseGreenhouseJobs(html: string, company: CompanyToScrape): ScrapedJob[] {
  const jobs: ScrapedJob[] = [];
  
  // Greenhouse typically uses a specific structure
  // Look for job listings in the HTML
  const jobPattern = /<div[^>]*class="opening"[^>]*>[\s\S]*?<a[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>[\s\S]*?<span[^>]*class="location"[^>]*>(.*?)<\/span>/gi;
  
  let match;
  while ((match = jobPattern.exec(html)) !== null) {
    const jobUrl = match[1].startsWith('http') ? match[1] : `${company.careers_page_url}${match[1]}`;
    jobs.push({
      company_id: company.id,
      job_title: match[2].trim(),
      job_description: '',
      location: match[3].trim(),
      job_url: jobUrl,
    });
  }

  return jobs;
}

function parseLeverJobs(html: string, company: CompanyToScrape): ScrapedJob[] {
  const jobs: ScrapedJob[] = [];
  
  // Lever uses a different structure
  const jobPattern = /<a[^>]*class="posting-title"[^>]*href="([^"]+)"[^>]*>[\s\S]*?<h5[^>]*>(.*?)<\/h5>[\s\S]*?<span[^>]*class="posting-categories-location"[^>]*>(.*?)<\/span>/gi;
  
  let match;
  while ((match = jobPattern.exec(html)) !== null) {
    jobs.push({
      company_id: company.id,
      job_title: match[2].trim(),
      job_description: '',
      location: match[3].trim(),
      job_url: match[1],
    });
  }

  return jobs;
}

function parseWorkdayJobs(html: string, company: CompanyToScrape): ScrapedJob[] {
  const jobs: ScrapedJob[] = [];
  
  // Workday typically loads jobs via API, but we can try to find job links
  const jobPattern = /<a[^>]*aria-label="([^"]+)"[^>]*href="([^"]+)"[^>]*>[\s\S]*?<div[^>]*data-automation-id="compositeLocation"[^>]*>(.*?)<\/div>/gi;
  
  let match;
  while ((match = jobPattern.exec(html)) !== null) {
    const jobUrl = match[2].startsWith('http') ? match[2] : `${new URL(company.careers_page_url).origin}${match[2]}`;
    jobs.push({
      company_id: company.id,
      job_title: match[1].trim(),
      job_description: '',
      location: match[3].trim(),
      job_url: jobUrl,
    });
  }

  return jobs;
}

function parseGenericJobs(html: string, company: CompanyToScrape): ScrapedJob[] {
  const jobs: ScrapedJob[] = [];
  
  // Generic approach: look for common patterns
  // Look for links that might be job postings (containing keywords like "job", "position", "career", "vacancy")
  const jobLinkPattern = /<a[^>]*href="([^"]*(?:job|position|career|vacancy|opening)[^"]*)"[^>]*>(.*?)<\/a>/gi;
  
  let match;
  const foundUrls = new Set<string>();
  
  while ((match = jobLinkPattern.exec(html)) !== null) {
    const url = match[1].startsWith('http') ? match[1] : `${new URL(company.careers_page_url).origin}${match[1]}`;
    
    if (!foundUrls.has(url)) {
      foundUrls.add(url);
      
      // Try to extract job title from link text or nearby heading
      const titleMatch = match[2].replace(/<[^>]*>/g, '').trim();
      
      if (titleMatch && titleMatch.length > 5 && titleMatch.length < 150) {
        jobs.push({
          company_id: company.id,
          job_title: titleMatch,
          job_description: '',
          location: 'Bristol', // Default to Bristol for now
          job_url: url,
        });
      }
    }
  }

  return jobs;
}
