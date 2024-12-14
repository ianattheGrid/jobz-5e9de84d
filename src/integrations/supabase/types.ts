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
          cover_letter: string | null
          created_at: string
          id: number
          job_id: number
          resume_url: string | null
          status: string
          updated_at: string
        }
        Insert: {
          applicant_id: string
          cover_letter?: string | null
          created_at?: string
          id?: number
          job_id: number
          resume_url?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          applicant_id?: string
          cover_letter?: string | null
          created_at?: string
          id?: number
          job_id?: number
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
          created_at: string
          id: string
          job_title: string
          location: string
          max_salary: number
          min_salary: number
          required_skills: string[] | null
          security_clearance: string | null
          signup_date: string | null
          updated_at: string
          years_experience: number
        }
        Insert: {
          created_at?: string
          id: string
          job_title: string
          location: string
          max_salary: number
          min_salary: number
          required_skills?: string[] | null
          security_clearance?: string | null
          signup_date?: string | null
          updated_at?: string
          years_experience: number
        }
        Update: {
          created_at?: string
          id?: string
          job_title?: string
          location?: string
          max_salary?: number
          min_salary?: number
          required_skills?: string[] | null
          security_clearance?: string | null
          signup_date?: string | null
          updated_at?: string
          years_experience?: number
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_match_score: {
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
