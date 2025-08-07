
export interface InterviewSlot {
  id: string;
  job: {
    company: string;
    title: string;
  };
  proposed_times: string[];
  status: string;
  interview_type: string;
  interview_stage?: number;
  duration_minutes?: number;
  duration_other?: string;
  interview_location?: string;
  interviewer_name?: string;
  employer_notes?: string;
  candidate_message?: string;
  candidate_suggested_times?: string[];
  selected_time?: string;
}

export interface InterviewSlotsProps {
  slots: InterviewSlot[];
  onSlotAccepted?: (slot: InterviewSlot) => void;
}
