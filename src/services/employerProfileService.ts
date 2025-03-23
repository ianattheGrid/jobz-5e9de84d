
import { supabase } from "@/integrations/supabase/client";
import type { EmployerProfile, CompanyGalleryImage } from "@/types/employer";

/**
 * Fetches employer profile data by ID
 */
export async function fetchEmployerProfile(employerId: string): Promise<EmployerProfile | null> {
  const { data, error } = await supabase
    .from('employer_profiles')
    .select('*')
    .eq('id', employerId)
    .single();
    
  if (error) {
    console.error("Error fetching employer profile:", error);
    throw error;
  }
  
  return data ? {
    id: data.id,
    company_name: data.company_name,
    company_website: data.company_website,
    company_logo_url: data.company_logo_url,
    profile_picture_url: data.profile_picture_url,
    full_name: data.full_name,
    job_title: data.job_title,
    company_size: data.company_size,
    is_sme: data.is_sme,
    company_description: data.company_description,
    office_amenities: data.office_amenities,
    nearby_amenities: data.nearby_amenities,
    created_at: data.created_at,
    updated_at: data.updated_at
  } : null;
}

/**
 * Fetches company gallery images by employer ID
 */
export async function fetchGalleryImages(employerId: string): Promise<CompanyGalleryImage[]> {
  const { data, error } = await supabase
    .from('company_gallery')
    .select('*')
    .eq('employer_id', employerId);
    
  if (error) {
    console.error("Error fetching gallery images:", error);
    throw error;
  }
  
  return data ? data.map(item => ({
    id: item.id,
    employer_id: item.employer_id,
    image_url: item.image_url,
    created_at: item.created_at
  })) : [];
}

/**
 * Checks if there's a match between the current user and the employer
 */
export async function checkEmployerMatch(employerId: string): Promise<boolean> {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData?.session?.user?.id;
  
  if (!userId) {
    return false;
  }
  
  const { data, error } = await supabase
    .from('applications')
    .select('id')
    .eq('applicant_id', userId)
    .eq('employer_id', employerId)
    .eq('status', 'matched');
    
  if (error) {
    console.error("Error checking match status:", error);
    throw error;
  }
  
  return data && data.length > 0;
}
