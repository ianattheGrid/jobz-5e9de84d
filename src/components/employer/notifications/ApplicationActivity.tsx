import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Quiet proof this application was deliberate: how many roles this candidate
 * has applied for on Jobz in the last 30 days. Count only — no other detail
 * crosses between employers.
 */
export const ApplicationActivity = ({ candidateId }: { candidateId: string }) => {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const { data, error } = await supabase.rpc("candidate_recent_application_count", {
        _candidate_id: candidateId,
      });
      if (!cancelled && !error && typeof data === "number") setCount(data);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [candidateId]);

  if (count === null) return null;

  return (
    <p className="mt-1 text-xs text-muted-foreground">
      Applied to {count} {count === 1 ? "role" : "roles"} on Jobz in the last 30 days.
    </p>
  );
};
