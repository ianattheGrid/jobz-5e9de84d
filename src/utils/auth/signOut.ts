
import { supabase } from "@/integrations/supabase/client";

export const signOut = async () => {
  return await supabase.auth.signOut();
};
