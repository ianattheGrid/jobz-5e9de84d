import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

const DECISION_LABELS: Record<string, string> = {
  offer_position: "They want to offer you the job",
  another_interview: "They'd like another interview",
  employer_control: "They'll take it from here",
  not_proceeding: "Not going further this time",
};

interface Props {
  interviewId: number | string;
}

/** Shows the company's decision after the interview, in plain words. */
export const EmployerDecisionCell = ({ interviewId }: Props) => {
  const id = typeof interviewId === "string" ? parseInt(interviewId) : interviewId;

  const { data } = useQuery({
    queryKey: ["candidate_interview_outcome", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("employer_interview_feedback")
        .select("feedback_type, message")
        .eq("interview_id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (!data) {
    return <span className="text-sm text-muted-foreground">Waiting to hear</span>;
  }

  const label = DECISION_LABELS[data.feedback_type] || data.feedback_type;
  const positive = data.feedback_type !== "not_proceeding";

  return (
    <div className="space-y-1">
      <Badge variant={positive ? "default" : "destructive"}>{label}</Badge>
      {data.message && <p className="text-xs text-muted-foreground">{data.message}</p>}
    </div>
  );
};
