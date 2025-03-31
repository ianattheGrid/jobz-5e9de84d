
import { supabase } from "@/integrations/supabase/client";

export type RecommendationStatus = {
  exists: boolean;
  isExpired: boolean;
  recommendedBy: string | null;
  recommendationDate: string | null;
};

/**
 * Check if a candidate email already exists in the recommendations
 * and whether the recommendation is still valid (not expired)
 */
export const fetchRecommendationStatus = async (candidateEmail: string): Promise<RecommendationStatus> => {
  try {
    // Query to get the most recent recommendation for the candidate
    const { data, error } = await supabase
      .from('candidate_recommendations')
      .select(`
        created_at, 
        vr_id,
        virtual_recruiter_profiles:vr_id (
          full_name
        )
      `)
      .eq('candidate_email', candidateEmail)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching recommendation status:', error);
      throw error;
    }

    if (!data) {
      return {
        exists: false,
        isExpired: false,
        recommendedBy: null,
        recommendationDate: null
      };
    }

    // Calculate if the recommendation has expired (6 months from creation date)
    const recommendationDate = new Date(data.created_at);
    const expirationDate = new Date(recommendationDate);
    expirationDate.setMonth(expirationDate.getMonth() + 6); // 6 months validity
    const now = new Date();
    const isExpired = now > expirationDate;

    // Safely access the recruiter's name
    const recruiterName = data.virtual_recruiter_profiles?.full_name || null;

    return {
      exists: true,
      isExpired,
      recommendedBy: recruiterName,
      recommendationDate: data.created_at
    };
  } catch (error) {
    console.error('Error in fetchRecommendationStatus:', error);
    return {
      exists: false,
      isExpired: false,
      recommendedBy: null,
      recommendationDate: null
    };
  }
};
