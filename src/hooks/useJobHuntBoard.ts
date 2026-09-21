import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Stage = "applied" | "waiting" | "interview" | "no";

export const STAGES: { key: Stage; label: string; hint: string }[] = [
  { key: "applied", label: "Applied", hint: "Sent, nothing back yet" },
  { key: "waiting", label: "Waiting to hear", hint: "They've seen it" },
  { key: "interview", label: "Interview booked", hint: "You're talking to them" },
  { key: "no", label: "No", hint: "Closed — keep it for the record" },
];

export interface BoardItem {
  id: string;
  company: string;
  roleTitle: string;
  jobUrl: string | null;
  source: string | null;
  appliedOn: string;
  stage: Stage;
  notes: string | null;
  onJobz: boolean;
}

/** Jobz application statuses mapped onto the four board columns. */
const stageFromStatus = (status: string): Stage => {
  if (status === "rejected") return "no";
  if (status === "accepted" || status === "matched" || status === "interview") return "interview";
  if (status === "reviewing") return "waiting";
  return "applied";
};

/** Anything untouched for this long gets a gentle "chase them?" nudge. */
export const isStale = (item: BoardItem) => {
  if (item.stage === "no" || item.stage === "interview") return false;
  const days = (Date.now() - new Date(item.appliedOn).getTime()) / 86_400_000;
  return days >= 14;
};

export const useJobHuntBoard = () => {
  const [items, setItems] = useState<BoardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth.user;
      if (!user) throw new Error("Please sign in to see your job hunt.");

      const [jobz, manual] = await Promise.all([
        supabase
          .from("applications")
          .select("id, status, created_at, jobs(title, company)")
          .eq("applicant_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("candidate_job_hunt")
          .select("*")
          .eq("candidate_id", user.id)
          .order("applied_on", { ascending: false }),
      ]);

      if (jobz.error) throw jobz.error;
      if (manual.error) throw manual.error;

      const fromJobz: BoardItem[] = (jobz.data || []).map((a: any) => ({
        id: `jobz-${a.id}`,
        company: a.jobs?.company || "A Jobz employer",
        roleTitle: a.jobs?.title || "Role no longer listed",
        jobUrl: null,
        source: "Jobz",
        appliedOn: a.created_at,
        stage: stageFromStatus(a.status || ""),
        notes: null,
        onJobz: true,
      }));

      const fromBoard: BoardItem[] = (manual.data || []).map((r: any) => ({
        id: r.id,
        company: r.company,
        roleTitle: r.role_title,
        jobUrl: r.job_url,
        source: r.source,
        appliedOn: r.applied_on,
        stage: (r.stage || "applied") as Stage,
        notes: r.notes,
        onJobz: false,
      }));

      setItems([...fromJobz, ...fromBoard]);
    } catch (e: any) {
      setError(e.message || "Could not load your job hunt.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addJob = async (input: {
    company: string;
    roleTitle: string;
    jobUrl?: string;
    source?: string;
    appliedOn: string;
    notes?: string;
  }) => {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) throw new Error("Please sign in first.");

    const { error: insertError } = await supabase.from("candidate_job_hunt").insert({
      candidate_id: auth.user.id,
      company: input.company.trim(),
      role_title: input.roleTitle.trim(),
      job_url: input.jobUrl?.trim() || null,
      source: input.source?.trim() || null,
      applied_on: input.appliedOn,
      notes: input.notes?.trim() || null,
    });
    if (insertError) throw insertError;
    await load();
  };

  const moveJob = async (id: string, stage: Stage) => {
    const { error: updateError } = await supabase
      .from("candidate_job_hunt")
      .update({ stage })
      .eq("id", id);
    if (updateError) throw updateError;
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, stage } : i)));
  };

  const removeJob = async (id: string) => {
    const { error: deleteError } = await supabase.from("candidate_job_hunt").delete().eq("id", id);
    if (deleteError) throw deleteError;
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return { items, loading, error, addJob, moveJob, removeJob, refresh: load };
};
