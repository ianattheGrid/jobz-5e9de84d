
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useInterviews } from "@/hooks/useInterviews";
import { useInterviewSlots } from "@/hooks/useInterviewSlots";
import InterviewsLayout from "@/components/interviews/InterviewsLayout";
import InterviewsHeader from "@/components/interviews/InterviewsHeader";
import InterviewsTabs from "@/components/interviews/InterviewsTabs";

// Dummy data for development/preview
const dummyInterviews = [
  {
    id: 1,
    scheduled_at: "2024-03-20T14:00:00Z",
    interviewer_name: "Sarah Thompson",
    status: "scheduled",
    job: {
      company: "Tech Solutions Ltd",
      title: "Senior Frontend Developer"
    }
  },
  {
    id: 2,
    scheduled_at: "2024-03-22T10:30:00Z",
    interviewer_name: "Michael Chen",
    status: "completed",
    job: {
      company: "Innovation Labs",
      title: "React Developer"
    }
  },
  {
    id: 3,
    scheduled_at: "2024-03-18T15:00:00Z",
    interviewer_name: "Jessica Brown",
    status: "cancelled",
    cancellation_reason: "Interviewer unavailable - will reschedule",
    job: {
      company: "Digital Dynamics",
      title: "Full Stack Engineer"
    }
  }
];

const dummySlots = [
  {
    id: "slot-1",
    job: {
      company: "Future Tech Inc",
      title: "Senior React Developer"
    },
    proposed_times: [
      "2024-03-25T11:00:00Z",
      "2024-03-25T15:00:00Z",
      "2024-03-26T10:00:00Z"
    ],
    status: "pending"
  },
  {
    id: "slot-2",
    job: {
      company: "Cloud Systems",
      title: "Frontend Architect"
    },
    proposed_times: [
      "2024-03-27T14:00:00Z",
      "2024-03-28T16:00:00Z"
    ],
    status: "pending"
  }
];

const CandidateInterviews = () => {
  const { user } = useAuth();
  const { data: interviews, isLoading: interviewsLoading } = useInterviews(user?.id);
  const { data: slots, isLoading: slotsLoading } = useInterviewSlots(user?.id);

  const isLoading = interviewsLoading || slotsLoading;

  // Use dummy data for preview, in production would use actual data
  const displayInterviews = interviews || dummyInterviews;
  const displaySlots = slots || dummySlots;

  return (
    <InterviewsLayout isLoading={isLoading}>
      <InterviewsHeader />
      <InterviewsTabs interviews={displayInterviews} slots={displaySlots} />
    </InterviewsLayout>
  );
};

export default CandidateInterviews;
