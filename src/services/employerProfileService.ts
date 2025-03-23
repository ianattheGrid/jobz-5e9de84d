
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
 * Uses a completely different approach with raw SQL to avoid type issues
 * Simply checks if there's a match between the current user and employer
 */
export async function checkEmployerMatch(employerId: string): Promise<boolean> {
  try {
    // Get current user ID
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user?.id;
    
    // If no user ID, there can't be a match
    if (!userId) {
      return false;
    }
    
    // Use a simple SQL query to check for matches
    const { data, error } = await supabase
      .rpc('check_user_employer_match', {
        user_id: userId,
        employer_id: employerId
      });
    
    if (error) {
      console.error("Error checking match:", error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error("Error in checkEmployerMatch:", error);
    return false;
  }
}
