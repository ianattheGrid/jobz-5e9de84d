import { Json } from "./common";
import { Job, JobMatch } from "./jobs";
import { CandidateProfile, EmployerProfile, RecruiterProfile } from "./profiles";
import { Application, Interview } from "./applications";
import { RecruiterMessage, RecruiterNotification } from "./messages";

export interface Database {
  public: {
    Tables: {
      applications: {
        Row: Application;
        Insert: Partial<Application>;
        Update: Partial<Application>;
      };
      candidate_profiles: {
        Row: CandidateProfile;
        Insert: Partial<CandidateProfile>;
        Update: Partial<CandidateProfile>;
      };
      employer_profiles: {
        Row: EmployerProfile;
        Insert: Partial<EmployerProfile>;
        Update: Partial<EmployerProfile>;
      };
      interviews: {
        Row: Interview;
        Insert: Partial<Interview>;
        Update: Partial<Interview>;
      };
      job_matches: {
        Row: JobMatch;
        Insert: Partial<JobMatch>;
        Update: Partial<JobMatch>;
      };
      jobs: {
        Row: Job;
        Insert: Partial<Job>;
        Update: Partial<Job>;
      };
      recruiter_messages: {
        Row: RecruiterMessage;
        Insert: Partial<RecruiterMessage>;
        Update: Partial<RecruiterMessage>;
      };
      recruiter_notifications: {
        Row: RecruiterNotification;
        Insert: Partial<RecruiterNotification>;
        Update: Partial<RecruiterNotification>;
      };
      recruiter_profiles: {
        Row: RecruiterProfile;
        Insert: Partial<RecruiterProfile>;
        Update: Partial<RecruiterProfile>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      calculate_match_score: {
        Args: {
          job_title_a: string;
          job_title_b: string;
          years_exp_a: number;
          years_exp_b: number;
          location_a: string;
          location_b: string;
          salary_min_a: number;
          salary_max_a: number;
          salary_min_b: number;
          salary_max_b: number;
          skills_a: string[];
          skills_b: string[];
        };
        Returns: number;
      };
      http_process_matches: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      process_job_matches: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type { Json } from "./common";
export type { Job, JobMatch } from "./jobs";
export type { CandidateProfile, EmployerProfile, RecruiterProfile } from "./profiles";
export type { Application, Interview } from "./applications";
export type { RecruiterMessage, RecruiterNotification } from "./messages";