import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ApplicationWithDetails } from "@/types/applications";
import ApplicationList from "./notifications/ApplicationList";

interface CandidateData {
  job_title: string;
  years_experience: number;
}

type ApplicationResponse = {
  id: number;
  jobs: {
    title: string;
    employer_id: string;
  };
  applicant_id: string;
  candidate_profiles: CandidateData | null;
}

const ApplicationNotifications = () => {
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    loadApplications();
    const unsubscribe = subscribeToApplications();
    return () => {
      unsubscribe();
    };
  }, []);

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
        candidate_profiles:applicant_id (
          job_title,
          years_experience
        )
      `)
      .eq('jobs.employer_id', session.user.id)
      .is('employer_viewed_at', null)
      .order('created_at', { ascending: false });

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

    // Transform and validate the data
    const validApplications = data
      .filter(app => app.candidate_profiles !== null)
      .map(app => ({
        ...app,
        candidate_profiles: app.candidate_profiles ? {
          job_title: app.candidate_profiles.job_title,
          years_experience: app.candidate_profiles.years_experience
        } : null
      }));

    setApplications(validApplications);
    setUnreadCount(validApplications.length);
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

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium">Applications</h4>
          <ApplicationList 
            applications={applications}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ApplicationNotifications;