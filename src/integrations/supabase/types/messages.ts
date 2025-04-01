
export interface RecruiterMessage {
  id: number;
  message_text: string;
  created_at: string;
  is_flagged: boolean;
  sender_id: string;
  is_system_message?: boolean;
  application_id: number;
}

export interface RecruiterNotification {
  id: number;
  recruiter_id: string;
  job_id: number;
  is_read: boolean;
  created_at: string;
}

export interface VRCandidateMessage {
  id: number;
  vr_id: string;
  candidate_email: string;
  message_text: string;
  is_flagged: boolean;
  recommendation_id?: number;
  created_at: string;
  updated_at: string;
}
