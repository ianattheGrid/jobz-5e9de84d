
import { supabase } from "@/integrations/supabase/client";

export const fetchUserProfile = async (userId: string, userType: string) => {
  const profileTable = 
    userType === 'employer' ? 'employer_profiles' :
    userType === 'candidate' ? 'candidate_profiles' :
    userType === 'vr' ? 'virtual_recruiter_profiles' : null;
    
  if (!profileTable) {
    return null;
  }

  const { data: profile, error } = await supabase
    .from(profileTable)
    .select('id')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching ${userType} profile:`, error);
    throw error;
  }

  return profile;
};
