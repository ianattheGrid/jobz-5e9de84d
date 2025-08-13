
import { supabase } from "@/integrations/supabase/client";

export const fetchUserProfile = async (userId: string, userType: string) => {
  const profileTable = 
    userType === 'employer' ? 'employer_profiles' :
    userType === 'candidate' ? 'candidate_profiles' :
    userType === 'vr' ? 'virtual_recruiter_profiles' : null;
    
  if (!profileTable) {
    return null;
  }

  try {
    const { data: profile, error } = await supabase
      .from(profileTable)
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching ${userType} profile:`, error);
      return null; // Don't throw error, just return null
    }

    console.log(`Profile found for ${userType}:`, !!profile);
    return profile;
  } catch (error) {
    console.error(`Exception fetching ${userType} profile:`, error);
    return null; // Don't throw error, just return null
  }
};
