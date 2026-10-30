
import { supabase } from "@/integrations/supabase/client";
import type { AuthResponse } from "@supabase/supabase-js";
import { AuthError } from "@supabase/supabase-js";

interface SignUpOptions {
  email: string;
  password: string;
  userType: string;
  fullName: string;
  referralCode?: string;
}

export const signUpWithEmail = async ({ 
  email, 
  password, 
  userType, 
  fullName, 
  referralCode 
}: SignUpOptions): Promise<AuthResponse> => {
  return { data: { user: null, session: null }, error: new AuthError("Jobz is in beta. Register interest to hear when we launch.") };
};
