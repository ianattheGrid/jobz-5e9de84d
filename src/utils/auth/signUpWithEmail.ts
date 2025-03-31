
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
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        user_type: userType,
        full_name: fullName,
        referral_code: referralCode,
      },
    },
  });
};
