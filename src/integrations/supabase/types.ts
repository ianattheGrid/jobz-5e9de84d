export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      jobs: {
        Row: {
          id: string
          title: string
          company: string
          type: string
          location: string
          salary_min: number
          salary_max: number
          description: string
          candidate_commission: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          company: string
          type: string
          location: string
          salary_min: number
          salary_max: number
          description: string
          candidate_commission?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          company?: string
          type?: string
          location?: string
          salary_min?: number
          salary_max?: number
          description?: string
          candidate_commission?: number | null
          created_at?: string
          updated_at?: string
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}