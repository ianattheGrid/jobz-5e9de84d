export interface Database {
  public: {
    Tables: {
      jobs: {
        Row: {
          id: number
          created_at: string
          title: string
          description: string
          company: string
          location: string
          salary: string
          type: string
        }
        Insert: {
          id?: number
          created_at?: string
          title: string
          description: string
          company: string
          location: string
          salary: string
          type: string
        }
        Update: {
          id?: number
          created_at?: string
          title?: string
          description?: string
          company?: string
          location?: string
          salary?: string
          type?: string
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
  }
}