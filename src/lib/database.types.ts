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
      users: {
        Row: {
          id: string
          auth_id: string
          email: string
          company_name: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          auth_id: string
          email: string
          company_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          auth_id?: string
          email?: string
          company_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      fax_documents: {
        Row: {
          id: string
          user_id: string
          file_name: string
          file_path: string
          page_count: number
          file_size: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          file_name: string
          file_path: string
          page_count: number
          file_size: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          file_name?: string
          file_path?: string
          page_count?: number
          file_size?: number
          created_at?: string
          updated_at?: string
        }
      }
      fax_recipients: {
        Row: {
          id: string
          user_id: string
          fax_number: string
          to_header: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          fax_number: string
          to_header?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          fax_number?: string
          to_header?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      block_lists: {
        Row: {
          id: string
          user_id: string
          fax_number: string
          reason: string | null
          source: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          fax_number: string
          reason?: string | null
          source: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          fax_number?: string
          reason?: string | null
          source?: string
          created_at?: string
        }
      }
      fax_broadcasts: {
        Row: {
          id: string
          user_id: string
          status: string
          billing_code: string | null
          scheduled_time: string | null
          test_fax_number: string | null
          test_fax_status: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status: string
          billing_code?: string | null
          scheduled_time?: string | null
          test_fax_number?: string | null
          test_fax_status?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          status?: string
          billing_code?: string | null
          scheduled_time?: string | null
          test_fax_number?: string | null
          test_fax_status?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      fax_broadcast_documents: {
        Row: {
          broadcast_id: string
          document_id: string
          sequence_order: number
          created_at: string
        }
        Insert: {
          broadcast_id: string
          document_id: string
          sequence_order: number
          created_at?: string
        }
        Update: {
          broadcast_id?: string
          document_id?: string
          sequence_order?: number
          created_at?: string
        }
      }
      fax_delivery_status: {
        Row: {
          id: string
          broadcast_id: string
          recipient_id: string
          status: string
          error_message: string | null
          delivery_time: string | null
          retry_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          broadcast_id: string
          recipient_id: string
          status: string
          error_message?: string | null
          delivery_time?: string | null
          retry_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          broadcast_id?: string
          recipient_id?: string
          status?: string
          error_message?: string | null
          delivery_time?: string | null
          retry_count?: number
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
  }
}
