export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship'

export interface Database {
  public: {
    Tables: {
      jobs: {
        Row: {
          id: string
          title: string
          company: string
          location: string
          description: string
          salary_min: number
          salary_max: number
          type: JobType
          candidate_commission: number | null
          referral_commission: number | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          company: string
          location: string
          description: string
          salary_min: number
          salary_max: number
          type: JobType
          candidate_commission?: number | null
          referral_commission?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          company?: string
          location?: string
          description?: string
          salary_min?: number
          salary_max?: number
          type?: JobType
          candidate_commission?: number | null
          referral_commission?: number | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      job_type: JobType
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}