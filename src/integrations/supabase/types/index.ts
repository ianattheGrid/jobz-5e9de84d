
import { Json } from "./common";
import { Job } from "./jobs";
import { CandidateProfile, EmployerProfile, RecruiterProfile, VirtualRecruiterProfile } from "./profiles";
import { Application, Interview } from "./applications";
import { RecruiterMessage, RecruiterNotification, VRCandidateMessage } from "./messages";
import { CompanyGalleryImage } from "@/types/employer";

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
      company_gallery: {
        Row: CompanyGalleryImage;
        Insert: Partial<CompanyGalleryImage>;
        Update: Partial<CompanyGalleryImage>;
      };
      interviews: {
        Row: Interview;
        Insert: Partial<Interview>;
        Update: Partial<Interview>;
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
      virtual_recruiter_profiles: {
        Row: VirtualRecruiterProfile;
        Insert: Partial<VirtualRecruiterProfile>;
        Update: Partial<VirtualRecruiterProfile>;
      };
      vr_candidate_messages: {
        Row: VRCandidateMessage;
        Insert: Partial<VRCandidateMessage>;
        Update: Partial<VRCandidateMessage>;
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
export type { Job } from "./jobs";
export type { CandidateProfile, EmployerProfile, RecruiterProfile, VirtualRecruiterProfile } from "./profiles";
export type { Application, Interview } from "./applications";
export type { RecruiterMessage, RecruiterNotification, VRCandidateMessage } from "./messages";
