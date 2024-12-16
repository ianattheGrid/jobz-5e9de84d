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
import { Application } from "@/integrations/supabase/types/applications";

interface ApplicationWithDetails extends Omit<Application, 'candidate_profiles'> {
  jobs: {
    title: string;
    employer_id: string;
  };
  candidate_profiles: {
    job_title: string;
    years_experience: number;
  } | null;
}

const ApplicationNotifications = () => {
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    loadApplications();
    subscribeToApplications();
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
        candidate_profiles (
          job_title,
          years_experience
        )
      `)
      .eq('jobs.employer_id', session.user.id)
      .is('employer_viewed_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load applications",
      });
      return;
    }

    setApplications(data as ApplicationWithDetails[] || []);
    setUnreadCount(data?.length || 0);
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
        (payload) => {
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
          {applications.length === 0 ? (
            <p className="text-sm text-muted-foreground">No new applications</p>
          ) : (
            <div className="space-y-2">
              {applications.map((application) => (
                <div
                  key={application.id}
                  className="p-3 rounded-lg bg-muted"
                >
                  <p className="text-sm font-medium">
                    {application.jobs.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {application.candidate_profiles ? 
                      `Candidate: ${application.candidate_profiles.job_title} with ${application.candidate_profiles.years_experience} years experience`
                      : 'Candidate profile not available'
                    }
                  </p>
                  <div className="mt-2 flex gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleAccept(application.id)}
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject(application.id)}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ApplicationNotifications;