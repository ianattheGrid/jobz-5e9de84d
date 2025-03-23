
import { supabase } from "@/integrations/supabase/client";
import type { EmployerProfile, CompanyGalleryImage } from "@/types/employer";

/**
 * Fetches employer profile data by ID
 */
export async function fetchEmployerProfile(employerId: string): Promise<EmployerProfile | null> {
  try {
    const { data, error } = await supabase
      .from('employer_profiles')
      .select('*')
      .eq('id', employerId)
      .single();
      
    if (error) {
      console.error("Error fetching employer profile:", error);
      throw error;
    }
    
    return data as EmployerProfile;
  } catch (err) {
    console.error("Error in fetchEmployerProfile:", err);
    return null;
  }
}

/**
 * Fetches company gallery images by employer ID
 */
export async function fetchGalleryImages(employerId: string): Promise<CompanyGalleryImage[]> {
  try {
    const { data, error } = await supabase
      .from('company_gallery')
      .select('*')
      .eq('employer_id', employerId);
      
    if (error) {
      console.error("Error fetching gallery images:", error);
      throw error;
    }
    
    return data as CompanyGalleryImage[];
  } catch (err) {
    console.error("Error in fetchGalleryImages:", err);
    return [];
  }
}

/**
 * Checks if there's a match between the current user and the employer
 */
export async function checkEmployerMatch(employerId: string): Promise<boolean> {
  // Get the current session
  const sessionResponse = await supabase.auth.getSession();
  if (sessionResponse.error) {
    console.error("Session error:", sessionResponse.error);
    return false;
  }
  
  // Get the user ID from the session
  const userId = sessionResponse.data?.session?.user?.id;
  if (!userId) {
    return false;
  }
  
  // Check for a match
  const matchResponse = await supabase
    .from('applications')
    .select('id')
    .eq('applicant_id', userId)
    .eq('employer_id', employerId)
    .eq('status', 'matched');
  
  if (matchResponse.error) {
    console.error("Error checking match status:", matchResponse.error);
    return false;
  }
  
  // Return true if there's at least one match
  return matchResponse.data ? matchResponse.data.length > 0 : false;
}
