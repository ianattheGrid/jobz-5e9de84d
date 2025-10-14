export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string | null
          email: string
          id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
        }
        Relationships: []
      }
      ai_chat_conversations: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
          user_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id: string
          user_type: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
          user_type?: string
        }
        Relationships: []
      }
      ai_chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      app_settings: {
        Row: {
          app_name: string
          created_at: string | null
          go_live_date: string | null
          id: string
          is_free_in_launch_location: boolean | null
          launch_location: string
          soft_launch_end_date: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          app_name: string
          created_at?: string | null
          go_live_date?: string | null
          id?: string
          is_free_in_launch_location?: boolean | null
          launch_location: string
          soft_launch_end_date?: string | null
          status: string
          updated_at?: string | null
        }
        Update: {
          app_name?: string
          created_at?: string | null
          go_live_date?: string | null
          id?: string
          is_free_in_launch_location?: boolean | null
          launch_location?: string
          soft_launch_end_date?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      applications: {
        Row: {
          applicant_id: string
          candidate_accepted: boolean | null
          candidate_viewed_at: string | null
          cover_letter: string | null
          created_at: string
          employer_accepted: boolean | null
          employer_viewed_at: string | null
          id: number
          job_id: number
          match_explanation: string | null
          match_percentage: number | null
          match_score_breakdown: Json | null
          profile_visibility_enabled: boolean | null
          rejection_notes: string | null
          rejection_reason: string | null
          resume_url: string | null
          status: string
          updated_at: string
        }
        Insert: {
          applicant_id: string
          candidate_accepted?: boolean | null
          candidate_viewed_at?: string | null
          cover_letter?: string | null
          created_at?: string
          employer_accepted?: boolean | null
          employer_viewed_at?: string | null
          id?: number
          job_id: number
          match_explanation?: string | null
          match_percentage?: number | null
          match_score_breakdown?: Json | null
          profile_visibility_enabled?: boolean | null
          rejection_notes?: string | null
          rejection_reason?: string | null
          resume_url?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          applicant_id?: string
          candidate_accepted?: boolean | null
          candidate_viewed_at?: string | null
          cover_letter?: string | null
          created_at?: string
          employer_accepted?: boolean | null
          employer_viewed_at?: string | null
          id?: number
          job_id?: number
          match_explanation?: string | null
          match_percentage?: number | null
          match_score_breakdown?: Json | null
          profile_visibility_enabled?: boolean | null
          rejection_notes?: string | null
          rejection_reason?: string | null
          resume_url?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      bonus_payments: {
        Row: {
          candidate_commission: number
          candidate_id: string
          confirmed_at: string | null
          created_at: string | null
          employer_id: string
          id: string
          job_id: number
          payment_due_date: string
          payment_status: string
          recommendation_id: number | null
          start_date: string
          updated_at: string | null
          vr_commission: number | null
        }
        Insert: {
          candidate_commission: number
          candidate_id: string
          confirmed_at?: string | null
          created_at?: string | null
          employer_id: string
          id?: string
          job_id: number
          payment_due_date: string
          payment_status?: string
          recommendation_id?: number | null
          start_date: string
          updated_at?: string | null
          vr_commission?: number | null
        }
        Update: {
          candidate_commission?: number
          candidate_id?: string
          confirmed_at?: string | null
          created_at?: string | null
          employer_id?: string
          id?: string
          job_id?: number
          payment_due_date?: string
          payment_status?: string
          recommendation_id?: number | null
          start_date?: string
          updated_at?: string | null
          vr_commission?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bonus_payments_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bonus_payments_recommendation_id_fkey"
            columns: ["recommendation_id"]
            isOneToOne: false
            referencedRelation: "candidate_recommendations"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_gallery: {
        Row: {
          candidate_id: string
          created_at: string
          id: string
          image_url: string
        }
        Insert: {
          candidate_id: string
          created_at?: string
          id?: string
          image_url: string
        }
        Update: {
          candidate_id?: string
          created_at?: string
          id?: string
          image_url?: string
        }
        Relationships: []
      }
      candidate_portfolio: {
        Row: {
          candidate_id: string
          created_at: string
          description: string | null
          file_name: string
          file_type: string
          file_url: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          candidate_id: string
          created_at?: string
          description?: string | null
          file_name: string
          file_type: string
          file_url: string
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          candidate_id?: string
          created_at?: string
          description?: string | null
          file_name?: string
          file_type?: string
          file_url?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      candidate_profiles: {
        Row: {
          additional_skills: string | null
          address: string | null
          ai_synopsis: string | null
          ai_synopsis_last_updated: string | null
          ai_synopsis_status: string | null
          availability: string | null
          commission_percentage: number | null
          company_address: string | null
          contact_email_ok: boolean | null
          contact_linkedin_ok: boolean | null
          contact_phone_ok: boolean | null
          contract_type_preference: string | null
          created_at: string
          current_employer: string | null
          cv_url: string | null
          desired_job_title: string | null
          education_details: Json | null
          email: string
          full_name: string | null
          home_postcode: string | null
          id: string
          industry_sector: string | null
          is_currently_employed: boolean | null
          itSpecialization: string | null
          job_title: string
          linkedin_url: string | null
          location: string[] | null
          max_salary: number
          min_salary: number
          notice_period: string | null
          personality: Json
          phone_number: string | null
          preferred_work_type: string | null
          profile_picture_url: string | null
          required_qualifications: string[] | null
          required_skills: string[] | null
          security_clearance: string | null
          signup_date: string | null
          skills_experience: Json | null
          travel_radius: number | null
          updated_at: string
          visible_sections: Json
          work_eligibility: string | null
          work_preferences: string | null
          workArea: string | null
          years_experience: number
          years_in_current_title: number | null
        }
        Insert: {
          additional_skills?: string | null
          address?: string | null
          ai_synopsis?: string | null
          ai_synopsis_last_updated?: string | null
          ai_synopsis_status?: string | null
          availability?: string | null
          commission_percentage?: number | null
          company_address?: string | null
          contact_email_ok?: boolean | null
          contact_linkedin_ok?: boolean | null
          contact_phone_ok?: boolean | null
          contract_type_preference?: string | null
          created_at?: string
          current_employer?: string | null
          cv_url?: string | null
          desired_job_title?: string | null
          education_details?: Json | null
          email: string
          full_name?: string | null
          home_postcode?: string | null
          id: string
          industry_sector?: string | null
          is_currently_employed?: boolean | null
          itSpecialization?: string | null
          job_title: string
          linkedin_url?: string | null
          location?: string[] | null
          max_salary: number
          min_salary: number
          notice_period?: string | null
          personality?: Json
          phone_number?: string | null
          preferred_work_type?: string | null
          profile_picture_url?: string | null
          required_qualifications?: string[] | null
          required_skills?: string[] | null
          security_clearance?: string | null
          signup_date?: string | null
          skills_experience?: Json | null
          travel_radius?: number | null
          updated_at?: string
          visible_sections?: Json
          work_eligibility?: string | null
          work_preferences?: string | null
          workArea?: string | null
          years_experience?: number
          years_in_current_title?: number | null
        }
        Update: {
          additional_skills?: string | null
          address?: string | null
          ai_synopsis?: string | null
          ai_synopsis_last_updated?: string | null
          ai_synopsis_status?: string | null
          availability?: string | null
          commission_percentage?: number | null
          company_address?: string | null
          contact_email_ok?: boolean | null
          contact_linkedin_ok?: boolean | null
          contact_phone_ok?: boolean | null
          contract_type_preference?: string | null
          created_at?: string
          current_employer?: string | null
          cv_url?: string | null
          desired_job_title?: string | null
          education_details?: Json | null
          email?: string
          full_name?: string | null
          home_postcode?: string | null
          id?: string
          industry_sector?: string | null
          is_currently_employed?: boolean | null
          itSpecialization?: string | null
          job_title?: string
          linkedin_url?: string | null
          location?: string[] | null
          max_salary?: number
          min_salary?: number
          notice_period?: string | null
          personality?: Json
          phone_number?: string | null
          preferred_work_type?: string | null
          profile_picture_url?: string | null
          required_qualifications?: string[] | null
          required_skills?: string[] | null
          security_clearance?: string | null
          signup_date?: string | null
          skills_experience?: Json | null
          travel_radius?: number | null
          updated_at?: string
          visible_sections?: Json
          work_eligibility?: string | null
          work_preferences?: string | null
          workArea?: string | null
          years_experience?: number
          years_in_current_title?: number | null
        }
        Relationships: []
      }
      candidate_recommendations: {
        Row: {
          candidate_email: string
          candidate_phone: string | null
          created_at: string | null
          id: number
          job_id: number | null
          status: string | null
          updated_at: string | null
          vr_id: string
        }
        Insert: {
          candidate_email: string
          candidate_phone?: string | null
          created_at?: string | null
          id?: number
          job_id?: number | null
          status?: string | null
          updated_at?: string | null
          vr_id: string
        }
        Update: {
          candidate_email?: string
          candidate_phone?: string | null
          created_at?: string | null
          id?: number
          job_id?: number | null
          status?: string | null
          updated_at?: string | null
          vr_id?: string
        }
        Relationships: []
      }
      candidate_verifications: {
        Row: {
          candidate_id: string
          created_at: string | null
          id: string
          updated_at: string | null
          verification_document_url: string | null
          verification_service: string | null
          verification_status: string
          verified_at: string | null
        }
        Insert: {
          candidate_id: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          verification_document_url?: string | null
          verification_service?: string | null
          verification_status?: string
          verified_at?: string | null
        }
        Update: {
          candidate_id?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          verification_document_url?: string | null
          verification_service?: string | null
          verification_status?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      certification_suggestions: {
        Row: {
          admin_notes: string | null
          admin_reviewed_at: string | null
          admin_reviewed_by: string | null
          admin_status: string
          ai_validation_reason: string | null
          ai_validation_score: number | null
          ai_validation_status: string
          certification_name: string
          created_at: string
          id: string
          specialization: string | null
          suggested_by: string
          updated_at: string
          work_area: string
        }
        Insert: {
          admin_notes?: string | null
          admin_reviewed_at?: string | null
          admin_reviewed_by?: string | null
          admin_status?: string
          ai_validation_reason?: string | null
          ai_validation_score?: number | null
          ai_validation_status?: string
          certification_name: string
          created_at?: string
          id?: string
          specialization?: string | null
          suggested_by: string
          updated_at?: string
          work_area: string
        }
        Update: {
          admin_notes?: string | null
          admin_reviewed_at?: string | null
          admin_reviewed_by?: string | null
          admin_status?: string
          ai_validation_reason?: string | null
          ai_validation_score?: number | null
          ai_validation_status?: string
          certification_name?: string
          created_at?: string
          id?: string
          specialization?: string | null
          suggested_by?: string
          updated_at?: string
          work_area?: string
        }
        Relationships: []
      }
      commission_negotiations: {
        Row: {
          candidate_id: string | null
          created_at: string | null
          current_commission: number | null
          employer_id: string | null
          id: number
          initial_commission: number | null
          job_id: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          candidate_id?: string | null
          created_at?: string | null
          current_commission?: number | null
          employer_id?: string | null
          id?: number
          initial_commission?: number | null
          job_id?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          candidate_id?: string | null
          created_at?: string | null
          current_commission?: number | null
          employer_id?: string | null
          id?: number
          initial_commission?: number | null
          job_id?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commission_negotiations_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      company_gallery: {
        Row: {
          created_at: string | null
          employer_id: string
          id: string
          image_url: string
        }
        Insert: {
          created_at?: string | null
          employer_id: string
          id?: string
          image_url: string
        }
        Update: {
          created_at?: string | null
          employer_id?: string
          id?: string
          image_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_gallery_employer_id_fkey"
            columns: ["employer_id"]
            isOneToOne: false
            referencedRelation: "employer_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contractor_recruitment_feedback: {
        Row: {
          created_at: string | null
          id: string
          is_interested: boolean
          user_type: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_interested: boolean
          user_type?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_interested?: boolean
          user_type?: string | null
        }
        Relationships: []
      }
      employer_interview_feedback: {
        Row: {
          created_at: string
          employer_id: string
          feedback_type: string
          id: string
          interview_id: number
          message: string | null
          next_interview_times: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          employer_id: string
          feedback_type: string
          id?: string
          interview_id: number
          message?: string | null
          next_interview_times?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          employer_id?: string
          feedback_type?: string
          id?: string
          interview_id?: number
          message?: string | null
          next_interview_times?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      employer_names: {
        Row: {
          created_at: string
          id: number
          name_variations: string[]
          standard_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          name_variations?: string[]
          standard_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          name_variations?: string[]
          standard_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      employer_profiles: {
        Row: {
          company_address: string | null
          company_culture: string | null
          company_description: string | null
          company_email: string | null
          company_logo_url: string | null
          company_name: string
          company_phone: string | null
          company_postcode: string | null
          company_size: number | null
          company_values: string[] | null
          company_website: string | null
          created_at: string
          full_name: string
          id: string
          industry_sector: string | null
          is_sme: boolean | null
          job_title: string
          linkedin_url: string | null
          nearby_amenities: string | null
          office_amenities: string | null
          profile_picture_url: string | null
          updated_at: string
        }
        Insert: {
          company_address?: string | null
          company_culture?: string | null
          company_description?: string | null
          company_email?: string | null
          company_logo_url?: string | null
          company_name: string
          company_phone?: string | null
          company_postcode?: string | null
          company_size?: number | null
          company_values?: string[] | null
          company_website?: string | null
          created_at?: string
          full_name: string
          id: string
          industry_sector?: string | null
          is_sme?: boolean | null
          job_title: string
          linkedin_url?: string | null
          nearby_amenities?: string | null
          office_amenities?: string | null
          profile_picture_url?: string | null
          updated_at?: string
        }
        Update: {
          company_address?: string | null
          company_culture?: string | null
          company_description?: string | null
          company_email?: string | null
          company_logo_url?: string | null
          company_name?: string
          company_phone?: string | null
          company_postcode?: string | null
          company_size?: number | null
          company_values?: string[] | null
          company_website?: string | null
          created_at?: string
          full_name?: string
          id?: string
          industry_sector?: string | null
          is_sme?: boolean | null
          job_title?: string
          linkedin_url?: string | null
          nearby_amenities?: string | null
          office_amenities?: string | null
          profile_picture_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      employer_searches: {
        Row: {
          created_at: string | null
          employer_id: string
          id: string
          is_active: boolean | null
          match_threshold: number | null
          max_salary: number | null
          min_salary: number | null
          required_qualifications: string[] | null
          required_skills: string[] | null
          specialization: string | null
          updated_at: string | null
          work_area: string | null
        }
        Insert: {
          created_at?: string | null
          employer_id: string
          id?: string
          is_active?: boolean | null
          match_threshold?: number | null
          max_salary?: number | null
          min_salary?: number | null
          required_qualifications?: string[] | null
          required_skills?: string[] | null
          specialization?: string | null
          updated_at?: string | null
          work_area?: string | null
        }
        Update: {
          created_at?: string | null
          employer_id?: string
          id?: string
          is_active?: boolean | null
          match_threshold?: number | null
          max_salary?: number | null
          min_salary?: number | null
          required_qualifications?: string[] | null
          required_skills?: string[] | null
          specialization?: string | null
          updated_at?: string | null
          work_area?: string | null
        }
        Relationships: []
      }
      external_job_matches: {
        Row: {
          candidate_id: string
          candidate_interested: boolean | null
          candidate_viewed_at: string | null
          created_at: string | null
          external_job_id: string | null
          id: string
          match_explanation: string | null
          match_score: number
          notified_at: string | null
        }
        Insert: {
          candidate_id: string
          candidate_interested?: boolean | null
          candidate_viewed_at?: string | null
          created_at?: string | null
          external_job_id?: string | null
          id?: string
          match_explanation?: string | null
          match_score: number
          notified_at?: string | null
        }
        Update: {
          candidate_id?: string
          candidate_interested?: boolean | null
          candidate_viewed_at?: string | null
          created_at?: string | null
          external_job_id?: string | null
          id?: string
          match_explanation?: string | null
          match_score?: number
          notified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "external_job_matches_external_job_id_fkey"
            columns: ["external_job_id"]
            isOneToOne: false
            referencedRelation: "external_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_external_job_matches_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_external_job_matches_external_job"
            columns: ["external_job_id"]
            isOneToOne: false
            referencedRelation: "external_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      external_jobs: {
        Row: {
          company_id: string | null
          contract_type: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          job_description: string | null
          job_title: string
          job_url: string
          location: string
          posting_date: string | null
          required_qualifications: string[] | null
          required_skills: string[] | null
          salary_max: number | null
          salary_min: number | null
          scraped_at: string | null
          specialization: string | null
          updated_at: string | null
          work_area: string | null
          years_experience: number | null
        }
        Insert: {
          company_id?: string | null
          contract_type?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          job_description?: string | null
          job_title: string
          job_url: string
          location: string
          posting_date?: string | null
          required_qualifications?: string[] | null
          required_skills?: string[] | null
          salary_max?: number | null
          salary_min?: number | null
          scraped_at?: string | null
          specialization?: string | null
          updated_at?: string | null
          work_area?: string | null
          years_experience?: number | null
        }
        Update: {
          company_id?: string | null
          contract_type?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          job_description?: string | null
          job_title?: string
          job_url?: string
          location?: string
          posting_date?: string | null
          required_qualifications?: string[] | null
          required_skills?: string[] | null
          salary_max?: number | null
          salary_min?: number | null
          scraped_at?: string | null
          specialization?: string | null
          updated_at?: string | null
          work_area?: string | null
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "external_jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "target_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      interview_feedback: {
        Row: {
          additional_clarifications: string | null
          candidate_id: string
          created_at: string
          general_feedback: string | null
          id: string
          interview_id: number
          overall_sentiment: string
          updated_at: string
          wish_explained_better: string | null
        }
        Insert: {
          additional_clarifications?: string | null
          candidate_id: string
          created_at?: string
          general_feedback?: string | null
          id?: string
          interview_id: number
          overall_sentiment: string
          updated_at?: string
          wish_explained_better?: string | null
        }
        Update: {
          additional_clarifications?: string | null
          candidate_id?: string
          created_at?: string
          general_feedback?: string | null
          id?: string
          interview_id?: number
          overall_sentiment?: string
          updated_at?: string
          wish_explained_better?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interview_feedback_interview_id_fkey"
            columns: ["interview_id"]
            isOneToOne: false
            referencedRelation: "interviews"
            referencedColumns: ["id"]
          },
        ]
      }
      interview_slots: {
        Row: {
          candidate_id: string
          candidate_message: string | null
          candidate_suggested_times: string[] | null
          created_at: string
          duration_minutes: number | null
          duration_other: string | null
          employer_id: string
          employer_notes: string | null
          id: string
          interview_location: string | null
          interview_stage: number | null
          interview_type: string | null
          interviewer_name: string | null
          job_id: number
          proposed_times: string[]
          selected_time: string | null
          status: string
          updated_at: string
        }
        Insert: {
          candidate_id: string
          candidate_message?: string | null
          candidate_suggested_times?: string[] | null
          created_at?: string
          duration_minutes?: number | null
          duration_other?: string | null
          employer_id: string
          employer_notes?: string | null
          id?: string
          interview_location?: string | null
          interview_stage?: number | null
          interview_type?: string | null
          interviewer_name?: string | null
          job_id: number
          proposed_times: string[]
          selected_time?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          candidate_id?: string
          candidate_message?: string | null
          candidate_suggested_times?: string[] | null
          created_at?: string
          duration_minutes?: number | null
          duration_other?: string | null
          employer_id?: string
          employer_notes?: string | null
          id?: string
          interview_location?: string | null
          interview_stage?: number | null
          interview_type?: string | null
          interviewer_name?: string | null
          job_id?: number
          proposed_times?: string[]
          selected_time?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "interview_slots_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      interviews: {
        Row: {
          cancellation_reason: string | null
          candidate_id: string
          created_at: string
          duration_minutes: number | null
          duration_other: string | null
          employer_id: string
          id: number
          interview_location: string | null
          interview_stage: number | null
          interview_type: string | null
          interviewer_name: string
          job_id: number
          scheduled_at: string
          status: string
          updated_at: string
        }
        Insert: {
          cancellation_reason?: string | null
          candidate_id: string
          created_at?: string
          duration_minutes?: number | null
          duration_other?: string | null
          employer_id: string
          id?: number
          interview_location?: string | null
          interview_stage?: number | null
          interview_type?: string | null
          interviewer_name: string
          job_id: number
          scheduled_at: string
          status?: string
          updated_at?: string
        }
        Update: {
          cancellation_reason?: string | null
          candidate_id?: string
          created_at?: string
          duration_minutes?: number | null
          duration_other?: string | null
          employer_id?: string
          id?: number
          interview_location?: string | null
          interview_stage?: number | null
          interview_type?: string | null
          interviewer_name?: string
          job_id?: number
          scheduled_at?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "interviews_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_title_suggestions: {
        Row: {
          admin_notes: string | null
          admin_reviewed_at: string | null
          admin_reviewed_by: string | null
          admin_status: string
          ai_validation_reason: string | null
          ai_validation_score: number | null
          ai_validation_status: string
          created_at: string
          id: string
          job_title: string
          specialization: string | null
          suggested_by: string
          updated_at: string
          work_area: string
        }
        Insert: {
          admin_notes?: string | null
          admin_reviewed_at?: string | null
          admin_reviewed_by?: string | null
          admin_status?: string
          ai_validation_reason?: string | null
          ai_validation_score?: number | null
          ai_validation_status?: string
          created_at?: string
          id?: string
          job_title: string
          specialization?: string | null
          suggested_by: string
          updated_at?: string
          work_area: string
        }
        Update: {
          admin_notes?: string | null
          admin_reviewed_at?: string | null
          admin_reviewed_by?: string | null
          admin_status?: string
          ai_validation_reason?: string | null
          ai_validation_score?: number | null
          ai_validation_status?: string
          created_at?: string
          id?: string
          job_title?: string
          specialization?: string | null
          suggested_by?: string
          updated_at?: string
          work_area?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          candidate_commission: number | null
          citizenship_essential: boolean | null
          company: string
          company_benefits: string | null
          contract_type: string | null
          created_at: string
          description: string
          employer_id: string | null
          holiday_entitlement: number | null
          hybrid_work_allowed: boolean | null
          id: number
          interview_process_description: string | null
          location: string
          location_radius: number | null
          match_threshold: number | null
          min_years_experience: number | null
          min_years_in_title: number | null
          notice_period_required: string | null
          office_postcode: string | null
          qualification_essential: boolean | null
          remote_work_allowed: boolean | null
          require_location_radius: boolean | null
          required_citizenship: string | null
          required_qualifications: string[] | null
          required_skills: string[] | null
          salary_essential: boolean | null
          salary_max: number
          salary_min: number
          skills_essential: boolean | null
          soft_launch_only: boolean | null
          specialization: string
          title: string
          title_essential: boolean | null
          type: string
          work_area: string
          years_experience_essential: boolean | null
        }
        Insert: {
          candidate_commission?: number | null
          citizenship_essential?: boolean | null
          company: string
          company_benefits?: string | null
          contract_type?: string | null
          created_at?: string
          description: string
          employer_id?: string | null
          holiday_entitlement?: number | null
          hybrid_work_allowed?: boolean | null
          id?: number
          interview_process_description?: string | null
          location: string
          location_radius?: number | null
          match_threshold?: number | null
          min_years_experience?: number | null
          min_years_in_title?: number | null
          notice_period_required?: string | null
          office_postcode?: string | null
          qualification_essential?: boolean | null
          remote_work_allowed?: boolean | null
          require_location_radius?: boolean | null
          required_citizenship?: string | null
          required_qualifications?: string[] | null
          required_skills?: string[] | null
          salary_essential?: boolean | null
          salary_max: number
          salary_min: number
          skills_essential?: boolean | null
          soft_launch_only?: boolean | null
          specialization: string
          title: string
          title_essential?: boolean | null
          type: string
          work_area: string
          years_experience_essential?: boolean | null
        }
        Update: {
          candidate_commission?: number | null
          citizenship_essential?: boolean | null
          company?: string
          company_benefits?: string | null
          contract_type?: string | null
          created_at?: string
          description?: string
          employer_id?: string | null
          holiday_entitlement?: number | null
          hybrid_work_allowed?: boolean | null
          id?: number
          interview_process_description?: string | null
          location?: string
          location_radius?: number | null
          match_threshold?: number | null
          min_years_experience?: number | null
          min_years_in_title?: number | null
          notice_period_required?: string | null
          office_postcode?: string | null
          qualification_essential?: boolean | null
          remote_work_allowed?: boolean | null
          require_location_radius?: boolean | null
          required_citizenship?: string | null
          required_qualifications?: string[] | null
          required_skills?: string[] | null
          salary_essential?: boolean | null
          salary_max?: number
          salary_min?: number
          skills_essential?: boolean | null
          soft_launch_only?: boolean | null
          specialization?: string
          title?: string
          title_essential?: boolean | null
          type?: string
          work_area?: string
          years_experience_essential?: boolean | null
        }
        Relationships: []
      }
      master_certifications: {
        Row: {
          certification_name: string
          created_at: string
          id: string
          specialization: string | null
          updated_at: string
          work_area: string
        }
        Insert: {
          certification_name: string
          created_at?: string
          id?: string
          specialization?: string | null
          updated_at?: string
          work_area: string
        }
        Update: {
          certification_name?: string
          created_at?: string
          id?: string
          specialization?: string | null
          updated_at?: string
          work_area?: string
        }
        Relationships: []
      }
      master_job_titles: {
        Row: {
          created_at: string
          id: string
          job_title: string
          specialization: string | null
          updated_at: string
          work_area: string
        }
        Insert: {
          created_at?: string
          id?: string
          job_title: string
          specialization?: string | null
          updated_at?: string
          work_area: string
        }
        Update: {
          created_at?: string
          id?: string
          job_title?: string
          specialization?: string | null
          updated_at?: string
          work_area?: string
        }
        Relationships: []
      }
      master_skills: {
        Row: {
          created_at: string
          id: string
          skill_name: string
          specialization: string | null
          updated_at: string
          work_area: string
        }
        Insert: {
          created_at?: string
          id?: string
          skill_name: string
          specialization?: string | null
          updated_at?: string
          work_area: string
        }
        Update: {
          created_at?: string
          id?: string
          skill_name?: string
          specialization?: string | null
          updated_at?: string
          work_area?: string
        }
        Relationships: []
      }
      push_notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          related_entity_id: string | null
          title: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          related_entity_id?: string | null
          title: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          related_entity_id?: string | null
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      recruiter_messages: {
        Row: {
          application_id: number
          created_at: string
          id: number
          is_flagged: boolean | null
          message_text: string
          sender_id: string
          updated_at: string
        }
        Insert: {
          application_id: number
          created_at?: string
          id?: number
          is_flagged?: boolean | null
          message_text: string
          sender_id: string
          updated_at?: string
        }
        Update: {
          application_id?: number
          created_at?: string
          id?: number
          is_flagged?: boolean | null
          message_text?: string
          sender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recruiter_messages_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      recruiter_notifications: {
        Row: {
          created_at: string
          id: number
          is_read: boolean | null
          job_id: number
          recruiter_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          is_read?: boolean | null
          job_id: number
          recruiter_id: string
        }
        Update: {
          created_at?: string
          id?: number
          is_read?: boolean | null
          job_id?: number
          recruiter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recruiter_notifications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      recruiter_profiles: {
        Row: {
          created_at: string
          experience_years: number
          full_name: string
          id: string
          is_probation: boolean | null
          rating: number | null
          successful_placements: number | null
          updated_at: string
          verification_status: string
        }
        Insert: {
          created_at?: string
          experience_years: number
          full_name: string
          id: string
          is_probation?: boolean | null
          rating?: number | null
          successful_placements?: number | null
          updated_at?: string
          verification_status?: string
        }
        Update: {
          created_at?: string
          experience_years?: number
          full_name?: string
          id?: string
          is_probation?: boolean | null
          rating?: number | null
          successful_placements?: number | null
          updated_at?: string
          verification_status?: string
        }
        Relationships: []
      }
      signup_attempts: {
        Row: {
          attempt_count: number | null
          email: string
          first_attempt_at: string | null
          id: string
          ip_address: string
          is_blocked: boolean | null
          last_attempt_at: string | null
        }
        Insert: {
          attempt_count?: number | null
          email: string
          first_attempt_at?: string | null
          id?: string
          ip_address: string
          is_blocked?: boolean | null
          last_attempt_at?: string | null
        }
        Update: {
          attempt_count?: number | null
          email?: string
          first_attempt_at?: string | null
          id?: string
          ip_address?: string
          is_blocked?: boolean | null
          last_attempt_at?: string | null
        }
        Relationships: []
      }
      skill_suggestions: {
        Row: {
          admin_notes: string | null
          admin_reviewed_at: string | null
          admin_reviewed_by: string | null
          admin_status: string
          ai_validation_reason: string | null
          ai_validation_score: number | null
          ai_validation_status: string
          created_at: string
          id: string
          skill_name: string
          specialization: string | null
          suggested_by: string
          updated_at: string
          work_area: string
        }
        Insert: {
          admin_notes?: string | null
          admin_reviewed_at?: string | null
          admin_reviewed_by?: string | null
          admin_status?: string
          ai_validation_reason?: string | null
          ai_validation_score?: number | null
          ai_validation_status?: string
          created_at?: string
          id?: string
          skill_name: string
          specialization?: string | null
          suggested_by: string
          updated_at?: string
          work_area: string
        }
        Update: {
          admin_notes?: string | null
          admin_reviewed_at?: string | null
          admin_reviewed_by?: string | null
          admin_status?: string
          ai_validation_reason?: string | null
          ai_validation_score?: number | null
          ai_validation_status?: string
          created_at?: string
          id?: string
          skill_name?: string
          specialization?: string | null
          suggested_by?: string
          updated_at?: string
          work_area?: string
        }
        Relationships: []
      }
      target_companies: {
        Row: {
          ats_type: string | null
          careers_page_url: string
          company_name: string
          created_at: string | null
          estimated_size: number | null
          id: string
          industry_sector: string | null
          is_active: boolean | null
          last_scraped_at: string | null
          location: string
          notes: string | null
          scrape_frequency_hours: number | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          ats_type?: string | null
          careers_page_url: string
          company_name: string
          created_at?: string | null
          estimated_size?: number | null
          id?: string
          industry_sector?: string | null
          is_active?: boolean | null
          last_scraped_at?: string | null
          location?: string
          notes?: string | null
          scrape_frequency_hours?: number | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          ats_type?: string | null
          careers_page_url?: string
          company_name?: string
          created_at?: string | null
          estimated_size?: number | null
          id?: string
          industry_sector?: string | null
          is_active?: boolean | null
          last_scraped_at?: string | null
          location?: string
          notes?: string | null
          scrape_frequency_hours?: number | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      user_push_subscriptions: {
        Row: {
          created_at: string | null
          id: string
          subscription: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          subscription: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          subscription?: Json
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      virtual_recruiter_profiles: {
        Row: {
          bank_account_details: Json | null
          bank_account_verified: boolean | null
          created_at: string
          email: string
          full_name: string
          id: string
          is_active: boolean | null
          location: string
          national_insurance_number: string | null
          recommendations_count: number | null
          successful_placements: number | null
          updated_at: string
          vr_number: string
        }
        Insert: {
          bank_account_details?: Json | null
          bank_account_verified?: boolean | null
          created_at?: string
          email: string
          full_name: string
          id: string
          is_active?: boolean | null
          location?: string
          national_insurance_number?: string | null
          recommendations_count?: number | null
          successful_placements?: number | null
          updated_at?: string
          vr_number: string
        }
        Update: {
          bank_account_details?: Json | null
          bank_account_verified?: boolean | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean | null
          location?: string
          national_insurance_number?: string | null
          recommendations_count?: number | null
          successful_placements?: number | null
          updated_at?: string
          vr_number?: string
        }
        Relationships: []
      }
      vr_candidate_messages: {
        Row: {
          candidate_email: string
          created_at: string | null
          id: number
          is_flagged: boolean | null
          message_text: string
          recommendation_id: number | null
          updated_at: string | null
          vr_id: string
        }
        Insert: {
          candidate_email: string
          created_at?: string | null
          id?: number
          is_flagged?: boolean | null
          message_text: string
          recommendation_id?: number | null
          updated_at?: string | null
          vr_id: string
        }
        Update: {
          candidate_email?: string
          created_at?: string | null
          id?: number
          is_flagged?: boolean | null
          message_text?: string
          recommendation_id?: number | null
          updated_at?: string | null
          vr_id?: string
        }
        Relationships: []
      }
      vr_referrals: {
        Row: {
          candidate_email: string
          candidate_id: string | null
          created_at: string | null
          id: number
          referral_code: string
          signed_up_at: string | null
          status: string
          vr_id: string
        }
        Insert: {
          candidate_email: string
          candidate_id?: string | null
          created_at?: string | null
          id?: number
          referral_code: string
          signed_up_at?: string | null
          status?: string
          vr_id: string
        }
        Update: {
          candidate_email?: string
          candidate_id?: string | null
          created_at?: string | null
          id?: number
          referral_code?: string
          signed_up_at?: string | null
          status?: string
          vr_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_apply_to_job: {
        Args: { candidate_employer: string; job_company: string }
        Returns: boolean
      }
      check_signup_attempts: {
        Args: {
          block_duration_hours?: number
          max_attempts?: number
          p_email: string
          p_ip_address: string
        }
        Returns: {
          can_proceed: boolean
          message: string
        }[]
      }
      check_user_employer_match: {
        Args: { employer_id: string; user_id: string }
        Returns: boolean
      }
      company_names_match: {
        Args: { name1: string; name2: string }
        Returns: boolean
      }
      generate_referral_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_vr_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_cv_file_path: {
        Args: { file_path: string }
        Returns: Json
      }
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      is_admin: {
        Args: { user_email: string }
        Returns: boolean
      }
      normalize_company_name: {
        Args: { company_name: string }
        Returns: string
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
      validate_sme_size: {
        Args: { size: number }
        Returns: boolean
      }
    }
    Enums: {
      interview_status: "pending" | "scheduled" | "completed" | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      interview_status: ["pending", "scheduled", "completed", "cancelled"],
    },
  },
} as const
