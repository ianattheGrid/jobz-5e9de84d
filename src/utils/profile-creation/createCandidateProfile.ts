
import { supabase } from "@/integrations/supabase/client";
import { readSource } from "@/utils/growth/source";

export const createCandidateProfile = async (userId: string, fullName: string, email: string) => {
  const source = readSource();

  const { error } = await supabase
    .from('candidate_profiles')
    .insert({
      id: userId,
      full_name: fullName,
      email: email,
      job_title: 'Not specified',
      min_salary: 0,
      max_salary: 0,
      years_experience: 0,
      ...source
    });

  if (error) throw error;
};
