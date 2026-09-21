import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders } from '../_shared/cors.ts';

interface CompanyToScrape {
  id: string;
  company_name: string;
  careers_page_url: string;
  ats_type: string | null;
  location: string | null;
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

const FIRECRAWL_API_KEY = Deno.env.get('FIRECRAWL_API_KEY');
const FIRECRAWL_V2 = 'https://api.firecrawl.dev/v2';

/** How many careers pages we'll pay to render in one run. */
const RENDER_LIMIT = 6;
/** How many companies one run reads — keeps each run inside its time limit. */
const COMPANY_LIMIT = 6;
/** How many adverts we'll take from any one company in a single run. */
const PER_COMPANY_LIMIT = 15;

let rendersUsed = 0;
let searchPaused: string | null = null;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// --- Where is this role? ----------------------------------------------------

const NEAR_BRISTOL = [
  'bristol', 'bath', 'portishead', 'clevedon', 'thornbury', 'yate', 'keynsham',
  'nailsea', 'weston-super-mare', 'weston super mare', 'filton', 'avonmouth',
  'aztec west', 'bradley stoke', 'kingswood', 'hanham', 'long ashton',
  'backwell', 'chipping sodbury', 'emersons green', 'severn beach', 'pill',
  'winterbourne', 'frampton cotterell', 'almondsbury', 'patchway', 'shirehampton',
];

const BRISTOL_POSTCODE_PATTERN = /\bbs\s?([1-9]|[1-4][0-9]|80|99)\b/i;

function isNearBristol(text: string | null | undefined): boolean {
  if (!text) return false;
  const lower = text.toLowerCase();
  if (NEAR_BRISTOL.some((place) => lower.includes(place))) return true;
  return BRISTOL_POSTCODE_PATTERN.test(lower);
}

/** Hiring systems used by employers who advertise all over the world. */
const NATIONWIDE_SYSTEMS = /(myworkdayjobs|greenhouse|lever\.co|ashbyhq|smartrecruiters|teamtailor|successfactors|taleo|icims)/i;

/** Keep the board a Bristol board. */
function jobIsLocal(job: ScrapedJob, company: CompanyToScrape): boolean {
  return jobIsLocalInner(job, company);
}

/** How many adverts we'll open to check where the job actually is. */
const PLACE_CHECK_LIMIT = 25;
let placeChecks = 0;

/**
 * When the listing doesn't say where the job is, open the advert itself and
 * look for Bristol or a BS postcode. Keeps national employers' adverts out.
 */
async function confirmLocal(job: ScrapedJob, company: CompanyToScrape): Promise<boolean> {
  if ((job.location || '').trim()) return isNearBristol(job.location);
  if (isNearBristol(job.job_url) || isNearBristol(job.job_title)) return true;

  if (placeChecks >= PLACE_CHECK_LIMIT) return false;
  placeChecks++;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(job.job_url, {
      headers: { 'User-Agent': 'JobzBot/1.0 (+https://jobz.dgrid.co)' },
      redirect: 'follow',
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return false;
    const html = (await res.text()).replace(/<[^>]*>/g, ' ');
    if (!isNearBristol(html)) return false;
    job.location = 'Bristol';
    return true;
  } catch {
    return false;
  }
}

function jobIsLocalInner(job: ScrapedJob, company: CompanyToScrape): boolean {
  const roleLocation = (job.location || '').trim();
  if (roleLocation) return isNearBristol(roleLocation);
  if (isNearBristol(job.job_url) || isNearBristol(job.job_title)) return true;
  // No place given. A big employer's worldwide careers system could mean
  // anywhere, so we leave it out; a local company's own site we trust.
  if (NATIONWIDE_SYSTEMS.test(job.job_url)) return false;
  return isNearBristol(company.location ?? '');
}

// --- Which hiring system does this company use? -----------------------------

type AtsKind = 'greenhouse' | 'lever' | 'ashby' | 'smartrecruiters' | 'workday' | 'teamtailor' | null;

interface AtsMatch {
  kind: AtsKind;
  token?: string;
}

/** Work out the hiring system, and the company's handle inside it, from the careers link. */
function detectAts(url: string): AtsMatch {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { kind: null };
  }

  const host = parsed.hostname.toLowerCase();
  const first = parsed.pathname.split('/').filter(Boolean)[0];

  if (host.includes('greenhouse.io')) return { kind: 'greenhouse', token: first };
  if (host.includes('lever.co')) return { kind: 'lever', token: first };
  if (host.includes('ashbyhq.com')) return { kind: 'ashby', token: first };
  if (host.includes('smartrecruiters.com')) return { kind: 'smartrecruiters', token: first };
  if (host.includes('myworkdayjobs.com')) return { kind: 'workday' };
  if (host.includes('teamtailor.com')) return { kind: 'teamtailor' };
  return { kind: null };
}

async function getJson(url: string): Promise<any | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10_000);
    const response = await fetch(url, {
      headers: { 'User-Agent': 'JobzBot/1.0 (+https://jobz.dgrid.co)', Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error(`JSON fetch failed for ${url}:`, (error as Error).message);
    return null;
  }
}

/** Ask the hiring system itself for the company's list of roles. */
async function fetchFromAts(company: CompanyToScrape, ats: AtsMatch): Promise<ScrapedJob[]> {
  const jobs: ScrapedJob[] = [];
  const token = ats.token;
  if (!token) return jobs;

  if (ats.kind === 'greenhouse') {
    const payload = await getJson(`https://boards-api.greenhouse.io/v1/boards/${token}/jobs`);
    for (const job of payload?.jobs ?? []) {
      jobs.push({
        company_id: company.id,
        job_title: job.title ?? '',
        job_description: '',
        location: job.location?.name ?? '',
        job_url: job.absolute_url ?? '',
        posting_date: job.updated_at ?? undefined,
      });
    }
  }

  if (ats.kind === 'lever') {
    const payload = await getJson(`https://api.lever.co/v0/postings/${token}?mode=json`);
    for (const job of Array.isArray(payload) ? payload : []) {
      jobs.push({
        company_id: company.id,
        job_title: job.text ?? '',
        job_description: '',
        location: job.categories?.location ?? '',
        job_url: job.hostedUrl ?? '',
      });
    }
  }

  if (ats.kind === 'ashby') {
    const payload = await getJson(`https://api.ashbyhq.com/posting-api/job-board/${token}`);
    for (const job of payload?.jobs ?? []) {
      jobs.push({
        company_id: company.id,
        job_title: job.title ?? '',
        job_description: '',
        location: job.location ?? '',
        job_url: job.jobUrl ?? '',
      });
    }
  }

  if (ats.kind === 'smartrecruiters') {
    const payload = await getJson(`https://api.smartrecruiters.com/v1/companies/${token}/postings?limit=100`);
    for (const job of payload?.content ?? []) {
      const city = job.location?.city ?? '';
      jobs.push({
        company_id: company.id,
        job_title: job.name ?? '',
        job_description: '',
        location: city,
        job_url: job.ref ? `https://jobs.smartrecruiters.com/${token}/${job.id}` : '',
      });
    }
  }

  return jobs.filter((job) => job.job_title && job.job_url);
}

// --- Rendering pages that build their job list in the browser ---------------

/** Read a careers page the way a browser sees it, once the list has loaded. */
async function renderCareersPage(url: string): Promise<{ html: string; links: string[] } | null> {
  if (!FIRECRAWL_API_KEY || searchPaused || rendersUsed >= RENDER_LIMIT) return null;
  rendersUsed++;

  try {
    await sleep(7000);
    const response = await fetch(`${FIRECRAWL_V2}/scrape`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, formats: ['html', 'links'], onlyMainContent: false, waitFor: 4000 }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`Render failed [${response.status}] for ${url}: ${body.slice(0, 200)}`);
      if ([402, 403, 429].includes(response.status)) {
        searchPaused = `Page reading stopped: ${response.status}`;
      }
      return null;
    }

    const payload = await response.json();
    const html = payload?.html ?? payload?.data?.html ?? '';
    const links = payload?.links ?? payload?.data?.links ?? [];
    return { html: typeof html === 'string' ? html : '', links: Array.isArray(links) ? links : [] };
  } catch (error) {
    console.error(`Render error for ${url}:`, (error as Error).message);
    return null;
  }
}

/** Tidy up a link's words so the board reads like a job title, not page furniture. */
function tidyTitle(raw: string): string {
  let text = raw
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&#39;|&apos;|&rsquo;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&#\d+;/g, ' ')
    .replace(/\u00a0/g, ' ')
    .replace(/\bXMLNAME\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Workday and friends tack the place and date onto the end of the link text.
  text = text.replace(/\s+\d{1,2}\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}$/i, '');
  return text.replace(/\s+/g, ' ').trim();
}

/** Some hiring systems hide the place in the link itself: /job/Bristol-Area/... */
function locationFromUrl(url: string): string {
  const match = url.match(/\/job\/([^/]+)\//i);
  if (!match) return '';
  return decodeURIComponent(match[1]).replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Turn a rendered page's links into candidate adverts. */
function jobsFromLinks(links: string[], html: string, company: CompanyToScrape): ScrapedJob[] {
  const titles = new Map<string, string>();
  const anchor = /<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let match: RegExpExecArray | null;
  while ((match = anchor.exec(html)) !== null) {
    const text = match[2].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    if (text.length >= 4) titles.set(match[1], text);
  }

  const seen = new Set<string>();
  const jobs: ScrapedJob[] = [];

  for (const link of links) {
    if (typeof link !== 'string' || seen.has(link)) continue;
    seen.add(link);

    let title = titles.get(link) ?? '';
    if (!title) {
      for (const [href, text] of titles) {
        if (link.endsWith(href) || href.endsWith(link)) {
          title = text;
          break;
        }
      }
    }
    if (!title) {
      const slug = link.split('?')[0].split('/').filter(Boolean).pop() ?? '';
      title = slug.replace(/[-_]+/g, ' ').replace(/\b\d{4,}\b/g, '').trim();
      title = title.replace(/\b\w/g, (c) => c.toUpperCase());
    }
    title = tidyTitle(title);
    if (!title) continue;

    jobs.push({
      company_id: company.id,
      job_title: title.slice(0, 120),
      job_description: '',
      location: locationFromUrl(link),
      job_url: link,
    });
  }


  return jobs;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    rendersUsed = 0;
    searchPaused = null;

    console.log('Starting external job scraping...');

    // Get companies that need scraping (haven't been scraped in the last 24 hours or never scraped)
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - 24);

    const { data: companies, error: companiesError } = await supabase
      .from('target_companies')
      .select('id, company_name, careers_page_url, ats_type, location')
      .eq('is_active', true)
      .is('excluded_reason', null)
      .or(`last_scraped_at.is.null,last_scraped_at.lt.${cutoffTime.toISOString()}`)
      .order('last_scraped_at', { ascending: true, nullsFirst: true })
      .limit(COMPANY_LIMIT);

    if (companiesError) {
      console.error('Error fetching companies:', companiesError);
      throw companiesError;
    }

    console.log(`Found ${companies?.length || 0} companies to scrape`);

    let totalJobsScraped = 0;
    let skippedNotLocal = 0;
    const scrapedJobs: ScrapedJob[] = [];

    for (const company of companies || []) {
      console.log(`Scraping ${company.company_name}...`);

      try {
        const found = await scrapeCompanyJobs(company, supabase);
        // Only keep things that actually read like a vacancy, that are near
        // Bristol, and never let one careers page flood the board.
        const vacancies = found.filter(isRealVacancy);
        const local: ScrapedJob[] = [];
        for (const job of vacancies) {
          if (local.length >= PER_COMPANY_LIMIT) break;
          if (await confirmLocal(job, company)) local.push(job);
          else skippedNotLocal++;
        }
        const jobs = local;
        console.log(
          `${company.company_name}: ${found.length} links, ${vacancies.length} vacancies, ${jobs.length} local`,
        );

        for (const job of jobs) {
          // Check if job already exists (by URL)
          const { data: existingJob } = await supabase
            .from('external_jobs')
            .select('id')
            .eq('job_url', job.job_url)
            .maybeSingle();

          if (!existingJob) {
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
            } else {
              scrapedJobs.push(job);
            }
          }
        }

        await supabase
          .from('target_companies')
          .update({ last_scraped_at: new Date().toISOString() })
          .eq('id', company.id);
      } catch (error) {
        console.error(`Error scraping ${company.company_name}:`, error);
      }

      if (searchPaused) {
        console.warn(searchPaused);
        break;
      }
    }

    console.log(`Scraping complete. Total new jobs: ${totalJobsScraped}`);

    return new Response(
      JSON.stringify({
        success: true,
        companies_scraped: companies?.length || 0,
        total_jobs_found: totalJobsScraped,
        skipped_not_local: skippedNotLocal,
        paused: searchPaused,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in scrape-external-jobs:', error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

async function scrapeCompanyJobs(company: CompanyToScrape, supabase: any): Promise<ScrapedJob[]> {
  // 1. If they use a known hiring system, ask it directly — clean, complete lists.
  const ats = detectAts(company.careers_page_url);
  if (ats.kind && ats.kind !== company.ats_type) {
    await supabase.from('target_companies').update({ ats_type: ats.kind }).eq('id', company.id);
  }

  if (ats.kind && ats.kind !== 'workday' && ats.kind !== 'teamtailor') {
    const fromAts = await fetchFromAts(company, ats);
    if (fromAts.length > 0) {
      console.log(`${company.company_name}: ${fromAts.length} roles from ${ats.kind}`);
      return fromAts;
    }
  }

  // 2. Otherwise read the page itself.
  let html = '';
  let finalUrl = company.careers_page_url;

  try {
    const response = await fetch(company.careers_page_url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      redirect: 'follow',
    });

    if (response.ok) {
      html = await response.text();
      finalUrl = response.url || company.careers_page_url;
    } else {
      console.error(`Failed to fetch ${company.careers_page_url}: ${response.status}`);
    }
  } catch (error) {
    console.error(`Fetch error for ${company.company_name}:`, (error as Error).message);
  }

  let jobs: ScrapedJob[] = [];
  if (html) {
    if (company.ats_type === 'greenhouse') jobs = parseGreenhouseJobs(html, company, finalUrl);
    else if (company.ats_type === 'lever') jobs = parseLeverJobs(html, company, finalUrl);
    else if (company.ats_type === 'workday') jobs = parseWorkdayJobs(html, company, finalUrl);
    else jobs = parseGenericJobs(html, company, finalUrl);
  }

  // 3. Nothing readable? The list is almost certainly loaded in the browser.
  //    Render it properly and read that instead.
  if (jobs.filter(isRealVacancy).length === 0) {
    const rendered = await renderCareersPage(company.careers_page_url);
    if (rendered) {
      jobs = jobsFromLinks(rendered.links, rendered.html, company);
      console.log(`${company.company_name}: ${jobs.length} links after rendering`);
    }
  }

  return jobs;
}

function parseGreenhouseJobs(html: string, company: CompanyToScrape, baseUrl: string): ScrapedJob[] {
  const jobs: ScrapedJob[] = [];
  const jobPattern = /<div[^>]*class="opening"[^>]*>[\s\S]*?<a[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>[\s\S]*?<span[^>]*class="location"[^>]*>(.*?)<\/span>/gi;

  let match;
  while ((match = jobPattern.exec(html)) !== null) {
    const jobUrl = match[1].startsWith('http') ? match[1] : `${baseUrl}${match[1]}`;
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

function parseLeverJobs(html: string, company: CompanyToScrape, _baseUrl: string): ScrapedJob[] {
  const jobs: ScrapedJob[] = [];
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

function parseWorkdayJobs(html: string, company: CompanyToScrape, baseUrl: string): ScrapedJob[] {
  const jobs: ScrapedJob[] = [];
  const jobPattern = /<a[^>]*aria-label="([^"]+)"[^>]*href="([^"]+)"[^>]*>[\s\S]*?<div[^>]*data-automation-id="compositeLocation"[^>]*>(.*?)<\/div>/gi;

  let match;
  while ((match = jobPattern.exec(html)) !== null) {
    const jobUrl = match[2].startsWith('http') ? match[2] : `${new URL(baseUrl).origin}${match[2]}`;
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

/** Page headings and section names that keep getting mistaken for vacancies. */
const NON_ROLE_PATTERNS: RegExp[] = [
  /^(our|the)\s/i,
  /^what\s/i,
  /^why\s/i,
  /^how\s/i,
  /^working at\b/i,
  /^life at\b/i,
  /^belonging\b/i,
  /^rewards?\b/i,
  /^benefits\b/i,
  /^locations?\b/i,
  /^adjustments?\b/i,
  /^diversity\b/i,
  /^inclusion\b/i,
  /^early careers?\b/i,
  /^experienced professionals\b/i,
  /^graduate (scheme|programme)s?\b/i,
  /^apprenticeships?\b/i,
  /\bcareers? (in|at|home)\b/i,
  /\blatest vacanc/i,
  /\bcurrent vacanc/i,
  /\bjob search\b/i,
  /\bsearch results\b/i,
  /\bagenda\b/i,
  /\bstories\b/i,
  /\bblog\b/i,
  /\bnews\b/i,
  /\bevents?\b/i,
  /\bfaqs?\b/i,
  /\bour people\b/i,
  /\bmeet the team\b/i,
  /\bcookie|privacy|terms\b/i,
  /\bsign in|log ?in|register\b/i,
  /^skip to\b/i,
  /\bsaved (jobs?|vacanc)/i,
  /\bfind your\b/i,
  /\bchoose (a )?(country|region|location)\b/i,
  /^discover\b/i,
  /^jumpstart\b/i,
  /\bmore tips\b/i,
  /^work at\b/i,
  /^view (job|vacanc|role)/i,
  /^apply\b/i,
  /^students? and graduates?\b/i,
];

/** Addresses that are a listing page or a site control, never one advert. */
const NON_ADVERT_URL = /(search-results|savedvacancies|choose-country|search|page=)/i;

/** Files and pictures are never a vacancy. */
const FILE_ENDING = /\.(jpe?g|png|gif|svg|webp|pdf|docx?|zip|mp4)$/i;

/** Words that make a line of text read like an actual job. */
const ROLE_WORDS = /\b(manager|director|engineer|developer|designer|analyst|coordinator|specialist|lead|senior|junior|assistant|officer|executive|administrator|consultant|technician|supervisor|architect|scientist|researcher|apprentice|graduate|trainee|teacher|teaching|tutor|lecturer|nurse|carer|care worker|support worker|chef|driver|cleaner|receptionist|accountant|bookkeeper|solicitor|paralegal|surveyor|electrician|plumber|fitter|operative|warehouse|sales|advisor|adviser|agent|buyer|planner|controller|auditor|marketer|copywriter|editor|producer|animator|programmer|tester|nursery|practitioner|therapist|technologist|partner|associate|intern|placement|head of|sous|barista|bartender|porter|steward|paramedic|pharmacist|dentist|doctor|vet)\b/i;

/**
 * Is this a single advert, or just another page on the careers site?
 * A real advert has a role-sounding title and a link that points at one posting.
 */
function isRealVacancy(job: ScrapedJob): boolean {
  const title = (job.job_title || '').replace(/&#\d+;/g, "'").trim();
  if (title.length < 4 || title.length > 100) return false;
  if (NON_ROLE_PATTERNS.some((p) => p.test(title))) return false;

  const url = job.job_url || '';
  if (/javascript:|^#|mailto:/i.test(url)) return false;
  // Adverts written for another country's site are never Bristol jobs.
  if (/\/(en-us|en_us|us|en-ca|en-au|fr-fr|de-de)\//i.test(url)) return false;

  let path = '';
  try {
    path = new URL(url).pathname.replace(/\/+$/, '');
  } catch {
    return false;
  }

  const lastPart = path.split('/').filter(Boolean).pop() || '';
  if (NON_ADVERT_URL.test(lastPart) || FILE_ENDING.test(lastPart)) return false;
  if (/savedvacancies|[?&]page=/i.test(url) || url.includes('#')) return false;

  // A specific posting: its own reference number, or its own slug under a
  // jobs-only part of the site. Either way it has to read like a job.
  const hasId = /\/\d{3,}(\/|$|[-_])/.test(path)
    || /[?&](jobid|id|req|requisition|gh_jid)=/i.test(url)
    || /\b[A-Z]{2}\d{5,}\b/.test(url);
  const underJobsPath = /\/(job|jobs|vacancy|vacancies|opening|openings|position|positions|role|roles)\//i.test(path);
  const hasOwnSlug = lastPart.split('-').length >= 3;
  const readsLikeRole = ROLE_WORDS.test(title);

  if (hasId && (underJobsPath || readsLikeRole)) return true;
  return underJobsPath && hasOwnSlug && readsLikeRole;
}

function parseGenericJobs(html: string, company: CompanyToScrape, baseUrl: string): ScrapedJob[] {
  const jobs: ScrapedJob[] = [];

  const excludedPhrases = [
    'see our', 'view all', 'see all', 'browse', 'search', 'apply now',
    'learn more', 'find out', 'click here', 'read more', 'explore',
    'current vacancies', 'available positions', 'open roles', 'join us',
    'careers home', 'back to', 'download', 'contact', 'about'
  ];

  const jobKeywords = [
    'manager', 'director', 'engineer', 'developer', 'designer', 'analyst',
    'coordinator', 'specialist', 'lead', 'senior', 'junior', 'assistant',
    'officer', 'executive', 'administrator', 'consultant', 'technician',
    'supervisor', 'head of', 'architect', 'scientist', 'researcher'
  ];

  const jobLinkPattern = /<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi;

  let match;
  const foundUrls = new Set<string>();

  while ((match = jobLinkPattern.exec(html)) !== null) {
    const href = match[1];
    const linkText = match[2].replace(/<[^>]*>/g, '').trim();

    if (!linkText || linkText.length < 10 || linkText.length > 150) continue;

    const lowerLinkText = linkText.toLowerCase();
    if (excludedPhrases.some(phrase => lowerLinkText.includes(phrase))) continue;

    if (href.match(/\.(pdf|doc|docx|jpg|png|gif)$/i) ||
        href.match(/\/(about|contact|privacy|terms|cookie)/i)) {
      continue;
    }

    const isJobUrl = href.match(/\/(job|position|career|vacancy|vacancies|opening|role)s?[\/\-_]/i);
    const hasJobKeyword = jobKeywords.some(keyword => lowerLinkText.includes(keyword));
    if (!isJobUrl && !hasJobKeyword) continue;

    let url: string;
    try {
      url = new URL(href, baseUrl).toString();
    } catch {
      continue;
    }

    if (!foundUrls.has(url)) {
      foundUrls.add(url);
      jobs.push({
        company_id: company.id,
        job_title: linkText,
        job_description: '',
        location: '',
        job_url: url,
      });
    }
  }

  console.log(`Generic parser found ${jobs.length} potential jobs for ${company.company_name}`);
  return jobs;
}
