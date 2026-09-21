import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { matchReasonsForApplication } from "@/utils/matching/matchReasons";

interface Props {
  candidateId: string;
  jobId: number;
}

/**
 * Says in plain words why this person fits the role, rather than leaving the
 * employer to open every profile. Read-only, built from the existing profile.
 */
export const ApplicationFitReasons = ({ candidateId, jobId }: Props) => {
  const [reasons, setReasons] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const [{ data: candidate }, { data: job }] = await Promise.all([
        supabase.from("candidate_profiles").select("*").eq("id", candidateId).maybeSingle(),
        supabase.from("jobs").select("*").eq("id", jobId).maybeSingle(),
      ]);
      if (cancelled) return;
      setReasons(matchReasonsForApplication(candidate, job));
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [candidateId, jobId]);

  if (reasons.length === 0) return null;

  return (
    <div className="mt-2 space-y-1">
      {reasons.map((reason, i) => (
        <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
          <Check className="h-3.5 w-3.5 mt-0.5 text-emerald-500 shrink-0" />
          <span>{reason}</span>
        </div>
      ))}
    </div>
  );
};

export default ApplicationFitReasons;
