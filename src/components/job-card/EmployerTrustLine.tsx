import { useQuery } from "@tanstack/react-query";
import { ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Anonymous trust signals for a job advert: verified, size, time on Jobz,
 * typical response time. Never reveals who the company is.
 */
export const EmployerTrustLine = ({ employerId }: { employerId?: string | null }) => {
  const { data } = useQuery({
    queryKey: ["employer_trust", employerId],
    enabled: !!employerId,
    staleTime: 10 * 60 * 1000,
    queryFn: async () => {
      const { data } = await (supabase.rpc as any)("get_employer_trust", { _employer_id: employerId });
      return (data?.[0] ?? null) as
        | { verified: boolean; company_size: number | null; member_since: string; avg_response_hours: number | null }
        | null;
    },
  });

  if (!data) return null;
  const parts: string[] = [];
  if (data.verified) parts.push("Verified employer");
  if (data.company_size) parts.push(`${data.company_size} staff`);
  if (data.member_since) parts.push(`On Jobz since ${new Date(data.member_since).getFullYear()}`);
  if (data.avg_response_hours != null) {
    const h = Number(data.avg_response_hours);
    parts.push(`Usually replies in ${h < 24 ? `${Math.max(1, h)} hrs` : `${Math.round(h / 24)} days`}`);
  }
  if (!parts.length) return null;

  return (
    <div className="flex items-start gap-2 mt-1 text-xs text-muted-foreground">
      <ShieldCheck className={`h-3.5 w-3.5 mt-0.5 flex-shrink-0 ${data.verified ? "text-primary" : ""}`} />
      <span>{parts.join(" · ")}</span>
    </div>
  );
};
