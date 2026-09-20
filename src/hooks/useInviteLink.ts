import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const makeCode = () => `JZ-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

/**
 * Gets (or creates) the signed-in person's own invite code and the number of
 * people who have joined through it.
 */
export const useInviteLink = (role: "candidate" | "employer" | "vr") => {
  const [code, setCode] = useState<string | null>(null);
  const [joined, setJoined] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth.user;
      if (!user) throw new Error("Please sign in to get your invite link.");

      const { data: existing, error: readError } = await supabase
        .from("invite_codes")
        .select("code")
        .eq("owner_id", user.id)
        .eq("owner_role", role)
        .maybeSingle();
      if (readError) throw readError;

      let myCode = existing?.code ?? null;

      if (!myCode) {
        const { data: created, error: insertError } = await supabase
          .from("invite_codes")
          .insert({ owner_id: user.id, owner_role: role, code: makeCode() })
          .select("code")
          .single();
        if (insertError) throw insertError;
        myCode = created.code;
      }

      setCode(myCode);

      const { count } = await supabase
        .from("invite_signups")
        .select("id", { count: "exact", head: true })
        .eq("inviter_id", user.id);
      setJoined(count ?? 0);
    } catch (e: any) {
      setError(e.message || "Could not load your invite link.");
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    load();
  }, [load]);

  const url = code ? `${window.location.origin}/join/${code}` : null;

  return { code, url, joined, loading, error, refresh: load };
};
