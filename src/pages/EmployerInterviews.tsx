
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { groupInterviewsByTime, Interview } from "@/utils/interviewUtils";
import InterviewsHeader from "@/components/employer/interviews/InterviewsHeader";
import InterviewTabs from "@/components/employer/interviews/InterviewTabs";

const EmployerInterviews = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: interviews, isLoading } = useQuery({
    queryKey: ["interviews", user?.id],
    queryFn: async () => {
      const { data: interviewsData, error } = await supabase
        .from("interviews")
        .select(`
          *,
          job:jobs(id, title, company)
        `)
        .eq('employer_id', user?.id)
        .order("scheduled_at", { ascending: true });

      if (error) throw error;

      return (interviewsData || []).map(interview => ({
        ...interview,
        candidate_email: interview.candidate_id,
        job: interview.job as { id: number; title: string; company: string }
      })) as Interview[];
    },
    enabled: !!user,
  });

  if (!user) {
    navigate("/employer/signin");
    return null;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-red-800 border-r-transparent" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  const interviewGroups = groupInterviewsByTime(interviews);

  return (
    <div className="container mx-auto py-8">
      <InterviewsHeader />
      <InterviewTabs 
        past={interviewGroups.past} 
        today={interviewGroups.today} 
        future={interviewGroups.future} 
      />
    </div>
  );
};

export default EmployerInterviews;
