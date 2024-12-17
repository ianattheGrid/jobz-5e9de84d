export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
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
          profile_visibility_enabled: boolean | null
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
          profile_visibility_enabled?: boolean | null
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
          profile_visibility_enabled?: boolean | null
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
      candidate_profiles: {
        Row: {
          additional_skills: string | null
          address: string | null
          availability: string | null
          commission_percentage: number | null
          created_at: string
          current_employer: string | null
          cv_url: string | null
          desired_job_title: string | null
          email: string
          full_name: string | null
          id: string
          job_title: string
          location: string
          max_salary: number
          min_salary: number
          phone_number: string | null
          preferred_work_type: string | null
          profile_picture_url: string | null
          required_skills: string[] | null
          security_clearance: string | null
          signup_date: string | null
          travel_radius: number | null
          updated_at: string
          work_eligibility: string | null
          work_preferences: string | null
          years_experience: number
        }
        Insert: {
          additional_skills?: string | null
          address?: string | null
          availability?: string | null
          commission_percentage?: number | null
          created_at?: string
          current_employer?: string | null
          cv_url?: string | null
          desired_job_title?: string | null
          email: string
          full_name?: string | null
          id: string
          job_title: string
          location: string
          max_salary: number
          min_salary: number
          phone_number?: string | null
          preferred_work_type?: string | null
          profile_picture_url?: string | null
          required_skills?: string[] | null
          security_clearance?: string | null
          signup_date?: string | null
          travel_radius?: number | null
          updated_at?: string
          work_eligibility?: string | null
          work_preferences?: string | null
          years_experience?: number
        }
        Update: {
          additional_skills?: string | null
          address?: string | null
          availability?: string | null
          commission_percentage?: number | null
          created_at?: string
          current_employer?: string | null
          cv_url?: string | null
          desired_job_title?: string | null
          email?: string
          full_name?: string | null
          id?: string
          job_title?: string
          location?: string
          max_salary?: number
          min_salary?: number
          phone_number?: string | null
          preferred_work_type?: string | null
          profile_picture_url?: string | null
          required_skills?: string[] | null
          security_clearance?: string | null
          signup_date?: string | null
          travel_radius?: number | null
          updated_at?: string
          work_eligibility?: string | null
          work_preferences?: string | null
          years_experience?: number
        }
        Relationships: []
      }
      candidate_recommendations: {
        Row: {
          candidate_email: string
          candidate_phone: string | null
          created_at: string
          id: number
          job_id: number | null
          status: string | null
          updated_at: string
          vr_id: string | null
        }
        Insert: {
          candidate_email: string
          candidate_phone?: string | null
          created_at?: string
          id?: number
          job_id?: number | null
          status?: string | null
          updated_at?: string
          vr_id?: string | null
        }
        Update: {
          candidate_email?: string
          candidate_phone?: string | null
          created_at?: string
          id?: number
          job_id?: number | null
          status?: string | null
          updated_at?: string
          vr_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_recommendations_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidate_recommendations_vr_id_fkey"
            columns: ["vr_id"]
            isOneToOne: false
            referencedRelation: "virtual_recruiter_profiles"
            referencedColumns: ["id"]
          },
        ]
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
      employer_profiles: {
        Row: {
          company_name: string
          created_at: string
          full_name: string
          id: string
          job_title: string
          updated_at: string
        }
        Insert: {
          company_name: string
          created_at?: string
          full_name: string
          id: string
          job_title: string
          updated_at?: string
        }
        Update: {
          company_name?: string
          created_at?: string
          full_name?: string
          id?: string
          job_title?: string
          updated_at?: string
        }
        Relationships: []
      }
      interviews: {
        Row: {
          candidate_id: string
          created_at: string
          employer_id: string
          id: number
          interviewer_name: string
          job_id: number
          scheduled_at: string
          status: string
          updated_at: string
        }
        Insert: {
          candidate_id: string
          created_at?: string
          employer_id: string
          id?: number
          interviewer_name: string
          job_id: number
          scheduled_at: string
          status?: string
          updated_at?: string
        }
        Update: {
          candidate_id?: string
          created_at?: string
          employer_id?: string
          id?: number
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
      job_matches: {
        Row: {
          candidate_id: string | null
          created_at: string
          id: number
          is_notified: boolean | null
          job_id: number | null
          match_score: number
        }
        Insert: {
          candidate_id?: string | null
          created_at?: string
          id?: number
          is_notified?: boolean | null
          job_id?: number | null
          match_score: number
        }
        Update: {
          candidate_id?: string | null
          created_at?: string
          id?: number
          is_notified?: boolean | null
          job_id?: number | null
          match_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "job_matches_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_matches_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          candidate_commission: number | null
          company: string
          company_benefits: string | null
          created_at: string
          description: string
          employer_id: string | null
          holiday_entitlement: number | null
          id: number
          location: string
          match_threshold: number
          required_qualifications: string[] | null
          salary_max: number
          salary_min: number
          title: string
          type: string
        }
        Insert: {
          candidate_commission?: number | null
          company: string
          company_benefits?: string | null
          created_at?: string
          description: string
          employer_id?: string | null
          holiday_entitlement?: number | null
          id?: number
          location: string
          match_threshold?: number
          required_qualifications?: string[] | null
          salary_max: number
          salary_min: number
          title: string
          type: string
        }
        Update: {
          candidate_commission?: number | null
          company?: string
          company_benefits?: string | null
          created_at?: string
          description?: string
          employer_id?: string | null
          holiday_entitlement?: number | null
          id?: number
          location?: string
          match_threshold?: number
          required_qualifications?: string[] | null
          salary_max?: number
          salary_min?: number
          title?: string
          type?: string
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
          location: string
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_match_score:
        | {
            Args: {
              job_title_a: string
              job_title_b: string
              desired_job_title: string
              years_exp_a: number
              years_exp_b: number
              location_a: string
              location_b: string
              salary_min_a: number
              salary_max_a: number
              salary_min_b: number
              salary_max_b: number
              skills_a: string[]
              skills_b: string[]
            }
            Returns: number
          }
        | {
            Args: {
              job_title_a: string
              job_title_b: string
              years_exp_a: number
              years_exp_b: number
              location_a: string
              location_b: string
              salary_min_a: number
              salary_max_a: number
              salary_min_b: number
              salary_max_b: number
            }
            Returns: number
          }
        | {
            Args: {
              job_title_a: string
              job_title_b: string
              years_exp_a: number
              years_exp_b: number
              location_a: string
              location_b: string
              salary_min_a: number
              salary_max_a: number
              salary_min_b: number
              salary_max_b: number
              skills_a: string[]
              skills_b: string[]
            }
            Returns: number
          }
      generate_vr_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      http_process_matches: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      process_job_matches: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
