
import { supabase } from "@/integrations/supabase/client";

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
}: SignUpOptions) => {
  return { data: { user: null, session: null }, error: new Error("Jobz is in beta. Register interest to hear when we launch.") };
};
