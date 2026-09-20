import { supabase } from "@/integrations/supabase/client";
import { clearInviteCode, readInviteCode } from "./inviteStorage";

/**
 * Credits whoever shared the invite link once the new person has an account.
 * Silent on failure — a missing credit must never block a signup.
 */
export const recordInviteSignup = async (newUserId: string, role: string) => {
  const code = readInviteCode();
  if (!code) return;

  try {
    const { data: inviter } = await supabase
      .from("invite_codes")
      .select("owner_id")
      .eq("code", code)
      .maybeSingle();

    await supabase.from("invite_signups").insert({
      code,
      inviter_id: inviter?.owner_id ?? null,
      new_user_id: newUserId,
      new_user_role: role,
    });
  } catch (error) {
    console.error("Could not record invite signup:", error);
  } finally {
    clearInviteCode();
  }
};
