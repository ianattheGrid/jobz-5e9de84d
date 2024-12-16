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

export const useApplications = () => {
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

  const handleAccept = async (applicationId: number) => {
    const { error } = await supabase
      .from('applications')
      .update({ 
        employer_accepted: true,
        employer_viewed_at: new Date().toISOString()
      })
      .eq('id', applicationId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to accept application",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Application accepted",
    });
    
    loadApplications();
  };

  const handleReject = async (applicationId: number) => {
    const { error } = await supabase
      .from('applications')
      .update({ 
        employer_accepted: false,
        employer_viewed_at: new Date().toISOString()
      })
      .eq('id', applicationId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reject application",
      });
      return;
    }

    toast({
      title: "Application Rejected",
      description: "The candidate has been notified",
    });
    
    loadApplications();
  };

  const subscribeToApplications = () => {
    const channel = supabase
      .channel('application_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'applications',
        },
        () => {
          loadApplications();
          toast({
            title: "New Application",
            description: "You have a new candidate application!",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  useEffect(() => {
    loadApplications();
    const unsubscribe = subscribeToApplications();
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    applications,
    unreadCount,
    handleAccept,
    handleReject
  };
};