
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
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Session error:", sessionError);
      return false;
    }
    
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
      return false;
    }
    
    return Array.isArray(data) && data.length > 0;
  } catch (err) {
    console.error("Error in checkEmployerMatch:", err);
    return false;
  }
}
