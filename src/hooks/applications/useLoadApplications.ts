
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ApplicationWithDetails } from "@/types/applications";
import { Database } from "@/integrations/supabase/types";
import { VRRecommendation } from "@/types/recommendations";

type ApplicationResponse = Database['public']['Tables']['applications']['Row'] & {
  jobs: {
    title: string;
    employer_id: string;
  };
  candidate_profiles: {
    job_title: string;
    years_experience: number;
    email?: string;
  } | null;
};

export const useLoadApplications = () => {
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  const loadApplications = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        jobs (
          title,
          employer_id
        ),
        candidate_profiles!applications_applicant_id_fkey (
          job_title,
          years_experience,
          email
        )
      `)
      .eq('jobs.employer_id', session.user.id)
      .is('employer_viewed_at', null)
      .order('created_at', { ascending: false })
      .returns<ApplicationResponse[]>();

    if (error) {
      console.error('Error loading applications:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load applications",
      });
      return;
    }

    if (!data) return;

    // Filter out applications without candidate profiles
    const validApplications = data.filter(app => app.candidate_profiles !== null);
    
    // Prepare array for enhanced applications
    let enhancedApplications: ApplicationWithDetails[] = validApplications.map(app => ({
      id: app.id,
      jobs: {
        title: app.jobs?.title || '',
        employer_id: app.jobs?.employer_id || ''
      },
      candidate_profiles: app.candidate_profiles ? {
        job_title: app.candidate_profiles.job_title,
        years_experience: app.candidate_profiles.years_experience
      } : null
    }));
    
    // Fetch VR recommendations for each candidate
    for (let i = 0; i < validApplications.length; i++) {
      const app = validApplications[i];
      if (app.candidate_profiles?.email) {
        const recommendation = await fetchVRRecommendation(app.candidate_profiles.email);
        if (recommendation) {
          enhancedApplications[i].vrRecommendation = recommendation;
        }
      }
    }

    setApplications(enhancedApplications);
    setUnreadCount(enhancedApplications.length);
  };
  
  // Helper function to fetch VR recommendation for a candidate
  const fetchVRRecommendation = async (candidateEmail: string): Promise<VRRecommendation | null> => {
    try {
      // First get recommendation data
      const { data: recommendationData, error: recommendationError } = await supabase
        .from('candidate_recommendations')
        .select(`
          id, 
          created_at, 
          status,
          vr_id
        `)
        .eq('candidate_email', candidateEmail)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (recommendationError || !recommendationData) {
        console.error('Error fetching recommendation:', recommendationError);
        return null;
      }

      // Then fetch VR profile data separately
      const { data: vrData, error: vrError } = await supabase
        .from('virtual_recruiter_profiles')
        .select('id, full_name, vr_number')
        .eq('id', recommendationData.vr_id)
        .single();

      if (vrError || !vrData) {
        console.error('Error fetching VR profile:', vrError);
        return null;
      }
      
      return {
        id: recommendationData.id,
        recommendationDate: recommendationData.created_at,
        status: recommendationData.status,
        vr: {
          id: vrData.id,
          name: vrData.full_name,
          vrNumber: vrData.vr_number
        }
      };
    } catch (error) {
      console.error('Error in fetchVRRecommendation:', error);
      return null;
    }
  };

  return { applications, unreadCount, loadApplications };
};
