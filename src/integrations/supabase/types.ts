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
          location: string
          type: string
          description: string
          salary_min: number
          salary_max: number
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          company: string
          location: string
          type: string
          description: string
          salary_min: number
          salary_max: number
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          company?: string
          location?: string
          type?: string
          description?: string
          salary_min?: number
          salary_max?: number
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]