
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { groupInterviewsByTime, Interview } from "@/utils/interviewUtils";
import InterviewsHeader from "@/components/employer/interviews/InterviewsHeader";
import InterviewTabs from "@/components/employer/interviews/InterviewTabs";
import InterviewStats from "@/components/employer/interviews/InterviewStats";

const EmployerInterviews = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/employer/signin");
    }
  }, [user, authLoading, navigate]);

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

      // Show who the interview is with, rather than an internal reference.
      const candidateIds = Array.from(
        new Set((interviewsData || []).map((i: any) => i.candidate_id).filter(Boolean))
      );

      let namesById = new Map<string, { full_name?: string | null; email?: string | null }>();
      if (candidateIds.length > 0) {
        const { data: profiles } = await supabase
          .from("candidate_profiles")
          .select("id, full_name, email")
          .in("id", candidateIds);
        namesById = new Map((profiles || []).map((p: any) => [p.id, p]));
      }

      return (interviewsData || []).map(interview => {
        const profile = namesById.get(interview.candidate_id);
        return {
          ...interview,
          candidate_name: profile?.full_name || null,
          candidate_email: profile?.full_name || profile?.email || "Candidate",
          job: interview.job as { id: number; title: string; company: string }
        };
      }) as Interview[];
    },
    enabled: !!user,
  });

  if (!user) {
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
    <div className="container mx-auto py-8 px-4">
      <InterviewsHeader />
      <InterviewStats interviews={interviews || []} />
      <InterviewTabs 
        past={interviewGroups.past} 
        today={interviewGroups.today} 
        future={interviewGroups.future} 
      />
    </div>
  );
};

export default EmployerInterviews;
