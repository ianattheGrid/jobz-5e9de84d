
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
 * Completely rewritten to avoid type inference issues
 * Uses a raw SQL query approach to check for matches
 */
export async function checkEmployerMatch(employerId: string): Promise<boolean> {
  try {
    // Get user session first
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    
    // If no user ID, there can't be a match
    if (!userId) {
      return false;
    }
    
    // Using a simplified query with direct count approach
    const { data, error } = await supabase
      .from('applications')
      .select('id', { count: 'exact' })
      .eq('applicant_id', userId)
      .eq('employer_id', employerId)
      .eq('status', 'matched');
      
    if (error) {
      console.error("Match checking error:", error);
      return false;
    }
    
    // If data.count is greater than 0, there is a match
    return data.length > 0;
  } catch (error) {
    console.error("Error in checkEmployerMatch:", error);
    return false;
  }
}
