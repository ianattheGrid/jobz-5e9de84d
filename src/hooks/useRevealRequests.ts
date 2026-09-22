import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";

export interface RevealRequest {
  id: string;
  candidate_id: string;
  employer_id: string;
  job_id: number | null;
  note: string | null;
  status: string;
  created_at: string;
  company_name?: string | null;
  job_title?: string | null;
}

/** Employer side: ask a candidate to share their full profile for one vacancy. */
export const useSendRevealRequest = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sending, setSending] = useState<string | null>(null);

  const send = async (candidateId: string, jobId: number | null, note: string) => {
    if (!user) return false;
    setSending(candidateId);
    try {
      const { error } = await supabase.from("candidate_reveal_requests").insert({
        candidate_id: candidateId,
        employer_id: user.id,
        job_id: jobId,
        note: note?.trim() ? note.trim().slice(0, 500) : null,
      });

      if (error) throw error;

      toast({
        title: "Request sent",
        description: "The candidate decides whether to share their details.",
      });
      return true;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Could not send the request",
        description: error?.message || "Please try again.",
      });
      return false;
    } finally {
      setSending(null);
    }
  };

  return { send, sending };
};

/** Candidate side: see who has asked, and share or decline. */
export const useMyRevealRequests = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<RevealRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const { data } = await supabase
      .from("candidate_reveal_requests")
      .select("*")
      .eq("candidate_id", user.id)
      .order("created_at", { ascending: false });

    const rows = (data || []) as any[];

    const employerIds = [...new Set(rows.map((r) => r.employer_id))];
    const jobIds = [...new Set(rows.map((r) => r.job_id).filter(Boolean))];

    const [{ data: employers }, { data: jobs }] = await Promise.all([
      employerIds.length
        ? supabase.from("employer_profiles").select("id, company_name").in("id", employerIds)
        : Promise.resolve({ data: [] as any[] }),
      jobIds.length
        ? supabase.from("jobs").select("id, title").in("id", jobIds as number[])
        : Promise.resolve({ data: [] as any[] }),
    ]);

    setRequests(
      rows.map((r) => ({
        ...r,
        company_name: employers?.find((e: any) => e.id === r.employer_id)?.company_name ?? null,
        job_title: jobs?.find((j: any) => j.id === r.job_id)?.title ?? null,
      }))
    );
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const respond = async (id: string, status: "shared" | "declined") => {
    const { error } = await supabase
      .from("candidate_reveal_requests")
      .update({ status, responded_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Could not save your answer",
        description: error.message,
      });
      return;
    }

    toast({
      title: status === "shared" ? "Details shared" : "Request declined",
      description:
        status === "shared"
          ? "This company can now see your full profile."
          : "Nothing has been shared with this company.",
    });
    load();
  };

  const block = async (employerId: string) => {
    if (!user) return;
    const { data } = await supabase
      .from("candidate_profiles")
      .select("board_blocked_companies")
      .eq("id", user.id)
      .maybeSingle();

    const current = ((data as any)?.board_blocked_companies || []) as string[];
    if (current.includes(employerId)) return;

    await supabase
      .from("candidate_profiles")
      .update({ board_blocked_companies: [...current, employerId] } as any)
      .eq("id", user.id);

    toast({
      title: "Company blocked",
      description: "They will not see you in any match results.",
    });
    load();
  };

  return { requests, loading, respond, block, reload: load };
};
