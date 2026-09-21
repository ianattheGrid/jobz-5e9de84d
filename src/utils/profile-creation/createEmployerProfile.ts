
import { supabase } from "@/integrations/supabase/client";
import { readSource } from "@/utils/growth/source";

export const createEmployerProfile = async (
  userId: string, 
  companyName: string, 
  fullName: string, 
  companyWebsite: string, 
  companySize: number
) => {
  const source = readSource();

  const { error } = await supabase
    .from('employer_profiles')
    .insert({
      id: userId,
      company_name: companyName,
      full_name: fullName,
      company_website: companyWebsite,
      company_size: companySize,
      is_sme: true,
      job_title: 'Not specified',
      ...source
    });

  if (error) throw error;
};
