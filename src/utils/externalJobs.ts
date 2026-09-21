import { supabase } from "@/integrations/supabase/client";

export interface FoundAdvert {
  id: string;
  job_title: string;
  location: string | null;
  job_url: string;
  salary_min?: number | null;
  salary_max?: number | null;
  target_companies?: {
    company_name: string | null;
    website: string | null;
    industry_sector?: string | null;
  } | null;
}

/**
 * Notes that somebody opened this advert. The advert and the date only —
 * used to tell the company how much interest their role is getting here.
 * One row per person per advert per day; repeats are silently ignored.
 */
export const recordAdvertView = async (jobId: string, candidateId?: string | null) => {
  try {
    await supabase
      .from("external_job_views")
      .insert({ external_job_id: jobId, candidate_id: candidateId ?? null });
  } catch {
    /* never block anyone on this */
  }
};

/** Opens the company's own advert, counting the visit first. */
export const openAdvert = (job: FoundAdvert, candidateId?: string | null) => {
  void recordAdvertView(job.id, candidateId);
  window.open(job.job_url, "_blank", "noopener,noreferrer");
};

/** Sign-up link that pre-fills the company's own details. */
export const advertClaimLink = (job: FoundAdvert) => {
  const params = new URLSearchParams({
    claim: job.id,
    company: job.target_companies?.company_name || "",
    site: job.target_companies?.website || "",
  });
  return `/employer/signup?${params.toString()}`;
};
