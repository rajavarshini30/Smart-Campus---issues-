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
      universities: {
        Row: {
          id: string
          name: string
          city: string
          state: string
          lat: number
          lng: number
          radius_meters: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['universities']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['universities']['Insert']>
      }
      profiles: {
        Row: {
          id: string
          full_name: string
          email: string
          university_id: string
          role: 'student' | 'technician' | 'admin'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      issues: {
        Row: {
          id: string
          ticket_id: string
          university_id: string
          reported_by: string
          assigned_to: string | null
          block: string
          room: string
          section: string
          issue_type: string
          description: string
          image_url: string | null
          priority: 'low' | 'medium' | 'high'
          status: 'pending' | 'in_progress' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['issues']['Row'], 'id' | 'ticket_id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['issues']['Insert']>
      }
      announcements: {
        Row: {
          id: string
          university_id: string
          title: string
          body: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['announcements']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['announcements']['Insert']>
      }
    }
  }
}
