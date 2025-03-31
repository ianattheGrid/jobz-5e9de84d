
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
      .select('created_at, vr_id')
      .eq('candidate_email', candidateEmail)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

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

    // Fetch the recruiter's name in a separate query
    let recruiterName = null;
    if (data.vr_id) {
      const { data: recruiterData, error: recruiterError } = await supabase
        .from('virtual_recruiter_profiles')
        .select('full_name')
        .eq('id', data.vr_id)
        .single();
      
      if (recruiterError) {
        console.error('Error fetching recruiter details:', recruiterError);
      } else if (recruiterData) {
        recruiterName = recruiterData.full_name;
      }
    }

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
