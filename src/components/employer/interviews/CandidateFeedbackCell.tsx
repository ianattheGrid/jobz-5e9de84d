import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

const FEELING_LABELS: Record<string, string> = {
  felt_positive: "Felt very positive",
  still_interested: "Still interested and hopeful",
  neutral: "Neutral - waiting to see",
  not_interested: "No longer interested",
};

interface Props {
  interviewId: number;
  candidateId: string;
}

/** Shows how the candidate felt after the interview, once they've told us. */
export const CandidateFeedbackCell = ({ interviewId, candidateId }: Props) => {
  const { data } = useQuery({
    queryKey: ["candidate_interview_feedback", interviewId, candidateId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("interview_feedback")
        .select("*")
        .eq("interview_id", interviewId)
        .eq("candidate_id", candidateId)
        .maybeSingle();
      if (error) throw error;
      return data as Record<string, any> | null;
    },
    enabled: !!interviewId && !!candidateId,
  });

  if (!data) {
    return <span className="text-sm text-gray-500">Not shared yet</span>;
  }

  const feeling = data.overall_sentiment;
  const notes = data.general_feedback || data.additional_clarifications;

  return (
    <div className="space-y-1">
      {feeling && <Badge variant="secondary">{FEELING_LABELS[feeling] || feeling}</Badge>}
      {notes && <p className="text-xs text-gray-600 max-w-[16rem]">{notes}</p>}
      {!feeling && !notes && <span className="text-sm text-gray-500">Shared</span>}
    </div>
  );
};
