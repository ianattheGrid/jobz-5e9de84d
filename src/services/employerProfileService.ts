
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
 * Simple implementation that avoids complex type inference
 * Simply returns a boolean indicating if a match exists
 */
export async function checkEmployerMatch(employerId: string): Promise<boolean> {
  // Safely get the user ID first
  let userId = null;
  
  try {
    const auth = await supabase.auth.getSession();
    userId = auth.data?.session?.user?.id;
  } catch (e) {
    console.error("Auth error:", e);
    return false;
  }
  
  // If no user ID, there can't be a match
  if (!userId) {
    return false;
  }
  
  // Now check for matches with a separate query 
  try {
    const { count, error } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('applicant_id', userId)
      .eq('employer_id', employerId)
      .eq('status', 'matched');
    
    if (error) {
      console.error("Match checking error:", error);
      return false;
    }
    
    // If count is greater than 0, there is a match
    return (count || 0) > 0;
  } catch (e) {
    console.error("Match query error:", e);
    return false;
  }
}
