import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  explainCandidateMatch,
  type MatchExplanation,
} from "@/components/candidate-search/searchCriteria";
import { criteriaFromJob } from "@/utils/matching/matchReasons";

export interface JobMatch {
  candidate_id: string;
  job_title: string | null;
  desired_job_title: string | null;
  years_experience: number | null;
  years_in_current_title: number | null;
  min_salary: number | null;
  max_salary: number | null;
  required_skills: string[] | null;
  additional_skills: string | null;
  required_qualifications: string[] | null;
  security_clearance: string | null;
  commission_percentage: number | null;
  workArea: string | null;
  itSpecialization: string | null;
  location: string[] | null;
  home_postcode: string | null;
  availability_status: string | null;
  personal_statement: string | null;
  updated_at: string | null;
  reveal_status: string;
  explanation: MatchExplanation;
}

/**
 * Match-led candidate discovery. Candidates are never browsed as a list — they
 * are only ever returned against one of the employer's own vacancies, already
 * anonymised by the database, and ranked with a plain-English reason.
 */
export const useJobMatches = (jobId: number | null) => {
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [job, setJob] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [notVerified, setNotVerified] = useState(false);

  const load = useCallback(async () => {
    if (!jobId) {
      setMatches([]);
      setJob(null);
      return;
    }

    setLoading(true);
    setNotVerified(false);

    try {
      const [{ data: jobRow }, { data: verification }] = await Promise.all([
        supabase.from("jobs").select("*").eq("id", jobId).maybeSingle(),
        supabase.auth.getUser().then(async ({ data }) =>
          data.user
            ? supabase
                .from("employer_profiles")
                .select("verification_status")
                .eq("id", data.user.id)
                .maybeSingle()
            : { data: null }
        ),
      ]);

      setJob(jobRow ?? null);

      if (verification?.data && (verification.data as any).verification_status !== "verified") {
        setNotVerified(true);
        setMatches([]);
        return;
      }

      const { data, error } = await supabase.rpc("get_candidate_matches_for_job", {
        _job_id: jobId,
      });

      if (error) throw error;

      const criteria = criteriaFromJob(jobRow);

      const scored = (data || []).map((row: any) => ({
        ...row,
        explanation: explainCandidateMatch(row, criteria),
      })) as JobMatch[];

      scored.sort((a, b) => b.explanation.score - a.explanation.score);

      // Someone from a completely different line of work is not a match, however
      // close to the office they live. Keep the list honest and short.
      const jobArea = (jobRow as any)?.work_area?.toLowerCase?.() ?? null;
      const sameField = (m: JobMatch) =>
        !jobArea || !m.workArea || m.workArea.toLowerCase() === jobArea;

      setMatches(scored.filter((m) => sameField(m) && m.explanation.score >= 40));
    } catch (err) {
      console.error("Failed to load matches for job:", err);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    load();
  }, [load]);

  return { matches, job, loading, notVerified, reload: load };
};
