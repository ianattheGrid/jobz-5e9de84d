
export interface InterviewSlot {
  id: string;
  job: {
    company: string;
    title: string;
  };
  proposed_times: string[];
  status: string;
  interview_type: string;
  selected_time?: string;
}

export interface InterviewSlotsProps {
  slots: InterviewSlot[];
  onSlotAccepted?: (slot: InterviewSlot) => void;
}
