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
          ai_synopsis: string | null
          ai_synopsis_last_updated: string | null
          ai_synopsis_status: string | null
          availability: string | null
          commission_percentage: number | null
          created_at: string
          current_employer: string | null
          cv_url: string | null
          desired_job_title: string | null
          email: string
          full_name: string | null
          home_postcode: string | null
          id: string
          job_title: string
          linkedin_url: string | null
          location: string[] | null
          max_salary: number
          min_salary: number
          phone_number: string | null
          preferred_work_type: string | null
          profile_picture_url: string | null
          required_qualifications: string[] | null
          required_skills: string[] | null
          security_clearance: string | null
          signup_date: string | null
          travel_radius: number | null
          updated_at: string
          work_eligibility: string | null
          work_preferences: string | null
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
          created_at?: string
          current_employer?: string | null
          cv_url?: string | null
          desired_job_title?: string | null
          email: string
          full_name?: string | null
          home_postcode?: string | null
          id: string
          job_title: string
          linkedin_url?: string | null
          location?: string[] | null
          max_salary: number
          min_salary: number
          phone_number?: string | null
          preferred_work_type?: string | null
          profile_picture_url?: string | null
          required_qualifications?: string[] | null
          required_skills?: string[] | null
          security_clearance?: string | null
          signup_date?: string | null
          travel_radius?: number | null
          updated_at?: string
          work_eligibility?: string | null
          work_preferences?: string | null
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
          created_at?: string
          current_employer?: string | null
          cv_url?: string | null
          desired_job_title?: string | null
          email?: string
          full_name?: string | null
          home_postcode?: string | null
          id?: string
          job_title?: string
          linkedin_url?: string | null
          location?: string[] | null
          max_salary?: number
          min_salary?: number
          phone_number?: string | null
          preferred_work_type?: string | null
          profile_picture_url?: string | null
          required_qualifications?: string[] | null
          required_skills?: string[] | null
          security_clearance?: string | null
          signup_date?: string | null
          travel_radius?: number | null
          updated_at?: string
          work_eligibility?: string | null
          work_preferences?: string | null
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
          company_logo_url: string | null
          company_name: string
          company_website: string | null
          created_at: string
          full_name: string
          id: string
          job_title: string
          linkedin_url: string | null
          profile_picture_url: string | null
          updated_at: string
        }
        Insert: {
          company_logo_url?: string | null
          company_name: string
          company_website?: string | null
          created_at?: string
          full_name: string
          id: string
          job_title: string
          linkedin_url?: string | null
          profile_picture_url?: string | null
          updated_at?: string
        }
        Update: {
          company_logo_url?: string | null
          company_name?: string
          company_website?: string | null
          created_at?: string
          full_name?: string
          id?: string
          job_title?: string
          linkedin_url?: string | null
          profile_picture_url?: string | null
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
      jobs: {
        Row: {
          candidate_commission: number | null
          citizenship_essential: boolean | null
          company: string
          company_benefits: string | null
          created_at: string
          description: string
          employer_id: string | null
          holiday_entitlement: number | null
          id: number
          location: string
          min_years_experience: number | null
          min_years_in_title: number | null
          qualification_essential: boolean | null
          required_citizenship: string | null
          required_qualifications: string[] | null
          salary_essential: boolean | null
          salary_max: number
          salary_min: number
          skills_essential: boolean | null
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
          created_at?: string
          description: string
          employer_id?: string | null
          holiday_entitlement?: number | null
          id?: number
          location: string
          min_years_experience?: number | null
          min_years_in_title?: number | null
          qualification_essential?: boolean | null
          required_citizenship?: string | null
          required_qualifications?: string[] | null
          salary_essential?: boolean | null
          salary_max: number
          salary_min: number
          skills_essential?: boolean | null
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
          created_at?: string
          description?: string
          employer_id?: string | null
          holiday_entitlement?: number | null
          id?: number
          location?: string
          min_years_experience?: number | null
          min_years_in_title?: number | null
          qualification_essential?: boolean | null
          required_citizenship?: string | null
          required_qualifications?: string[] | null
          salary_essential?: boolean | null
          salary_max?: number
          salary_min?: number
          skills_essential?: boolean | null
          specialization?: string
          title?: string
          title_essential?: boolean | null
          type?: string
          work_area?: string
          years_experience_essential?: boolean | null
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
        Args: {
          candidate_employer: string
          job_company: string
        }
        Returns: boolean
      }
      company_names_match: {
        Args: {
          name1: string
          name2: string
        }
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
      gtrgm_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_options: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      gtrgm_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      normalize_company_name: {
        Args: {
          company_name: string
        }
        Returns: string
      }
      set_limit: {
        Args: {
          "": number
        }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: {
          "": string
        }
        Returns: string[]
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
