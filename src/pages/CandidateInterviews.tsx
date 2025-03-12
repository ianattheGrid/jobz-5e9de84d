
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useInterviews } from "@/hooks/useInterviews";
import { useInterviewSlots } from "@/hooks/useInterviewSlots";
import InterviewsLayout from "@/components/interviews/InterviewsLayout";
import InterviewsHeader from "@/components/interviews/InterviewsHeader";
import InterviewsTabs from "@/components/interviews/InterviewsTabs";

const CandidateInterviews = () => {
  const { user } = useAuth();
  const { data: interviews, isLoading: interviewsLoading } = useInterviews(user?.id);
  const { data: slots, isLoading: slotsLoading } = useInterviewSlots(user?.id);

  const isLoading = interviewsLoading || slotsLoading;

  return (
    <InterviewsLayout isLoading={isLoading}>
      <InterviewsHeader />
      {!isLoading && <InterviewsTabs interviews={interviews} slots={slots} />}
    </InterviewsLayout>
  );
};

export default CandidateInterviews;
