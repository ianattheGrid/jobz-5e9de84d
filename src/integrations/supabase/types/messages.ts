export interface RecruiterMessage {
  id: number;
  sender_id: string;
  application_id: number;
  message_text: string;
  is_flagged: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface RecruiterNotification {
  id: number;
  recruiter_id: string;
  job_id: number;
  is_read: boolean | null;
  created_at: string;
}

export interface VRCandidateMessage {
  id: number;
  vr_id: string;
  candidate_email: string;
  recommendation_id: number;
  message_text: string;
  is_flagged: boolean | null;
  created_at: string;
  updated_at: string;
}