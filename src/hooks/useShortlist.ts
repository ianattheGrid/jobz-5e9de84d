import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface ShortlistEntry {
  id: string;
  candidate_id: string;
  job_id: number | null;
  tags: string[];
  note: string | null;
  created_at: string;
  candidate?: {
    full_name: string | null;
    job_title: string | null;
    desired_job_title: string | null;
    years_experience: number | null;
    location: string[] | null;
    required_skills: string[] | null;
    availability_status: string | null;
  } | null;
}

/**
 * A single "saved people" list per employer, with private tags and notes.
 * Nothing here is visible to the candidate.
 */
export const useShortlist = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [shortlistId, setShortlistId] = useState<string | null>(null);
  const [entries, setEntries] = useState<ShortlistEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const ensureShortlist = useCallback(async () => {
    if (!user) return null;

    const { data: existing } = await supabase
      .from("employer_shortlists")
      .select("id")
      .eq("employer_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (existing) return existing.id;

    const { data: created, error } = await supabase
      .from("employer_shortlists")
      .insert({ employer_id: user.id, name: "My shortlist" })
      .select("id")
      .single();

    if (error) {
      console.error("Could not create shortlist", error);
      return null;
    }
    return created.id;
  }, [user]);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const id = await ensureShortlist();
    setShortlistId(id);
    if (!id) {
      setLoading(false);
      return;
    }

    const { data: rows } = await supabase
      .from("employer_shortlist_entries")
      .select("id, candidate_id, job_id, tags, note, created_at")
      .eq("shortlist_id", id)
      .order("created_at", { ascending: false });

    const list = (rows || []) as ShortlistEntry[];

    if (list.length) {
      const { data: profiles } = await supabase
        .from("candidate_profiles")
        .select(
          "id, full_name, job_title, desired_job_title, years_experience, location, required_skills, availability_status",
        )
        .in("id", list.map((r) => r.candidate_id));

      const byId = new Map((profiles || []).map((p: any) => [p.id, p]));
      list.forEach((r) => {
        r.candidate = byId.get(r.candidate_id) ?? null;
      });
    }

    setEntries(list);
    setLoading(false);
  }, [user, ensureShortlist]);

  useEffect(() => {
    load();
  }, [load]);

  const add = async (candidateId: string, jobId?: number | null) => {
    if (!user) return;
    const id = shortlistId ?? (await ensureShortlist());
    if (!id) return;

    const { error } = await supabase.from("employer_shortlist_entries").insert({
      shortlist_id: id,
      employer_id: user.id,
      candidate_id: candidateId,
      job_id: jobId ?? null,
    });

    if (error && !error.message.includes("duplicate")) {
      toast({ variant: "destructive", title: "Couldn't save", description: error.message });
      return;
    }

    toast({ title: "Saved to your shortlist", description: "Find them again under Shortlist." });
    load();
  };

  const remove = async (entryId: string) => {
    await supabase.from("employer_shortlist_entries").delete().eq("id", entryId);
    setEntries((prev) => prev.filter((e) => e.id !== entryId));
  };

  const updateEntry = async (entryId: string, patch: { note?: string; tags?: string[] }) => {
    const { error } = await supabase.from("employer_shortlist_entries").update(patch).eq("id", entryId);
    if (error) {
      toast({ variant: "destructive", title: "Couldn't save your note", description: error.message });
      return;
    }
    setEntries((prev) => prev.map((e) => (e.id === entryId ? { ...e, ...patch } : e)));
  };

  const savedIds = new Set(entries.map((e) => e.candidate_id));

  return { entries, savedIds, loading, add, remove, updateEntry, reload: load };
};
