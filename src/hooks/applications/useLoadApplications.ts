import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ApplicationWithDetails } from "@/types/applications";
import { Database } from "@/integrations/supabase/types";

type ApplicationResponse = Database['public']['Tables']['applications']['Row'] & {
  jobs: {
    title: string;
    employer_id: string;
  };
  candidate_profiles: {
    job_title: string;
    years_experience: number;
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
          years_experience
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

    const validApplications = data
      .filter(app => app.candidate_profiles !== null)
      .map(app => ({
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

    setApplications(validApplications);
    setUnreadCount(validApplications.length);
  };

  return { applications, unreadCount, loadApplications };
};