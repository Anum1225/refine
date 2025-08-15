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
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          plan: 'basic' | 'standard' | 'premium'
          created_at: string
          updated_at: string
          last_sign_in_at: string | null
          is_admin: boolean
          stripe_customer_id: string | null
          usage_count: number
          usage_limit: number
          usage_reset_date: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          plan?: 'basic' | 'standard' | 'premium'
          created_at?: string
          updated_at?: string
          last_sign_in_at?: string | null
          is_admin?: boolean
          stripe_customer_id?: string | null
          usage_count?: number
          usage_limit?: number
          usage_reset_date?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          plan?: 'basic' | 'standard' | 'premium'
          created_at?: string
          updated_at?: string
          last_sign_in_at?: string | null
          is_admin?: boolean
          stripe_customer_id?: string | null
          usage_count?: number
          usage_limit?: number
          usage_reset_date?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_subscription_id: string
          stripe_price_id: string
          status: 'active' | 'canceled' | 'past_due' | 'incomplete' | 'trialing'
          plan: 'basic' | 'standard' | 'premium'
          current_period_start: string
          current_period_end: string
          created_at: string
          updated_at: string
          canceled_at: string | null
          trial_end: string | null
        }
        Insert: {
          id?: string
          user_id: string
          stripe_subscription_id: string
          stripe_price_id: string
          status: 'active' | 'canceled' | 'past_due' | 'incomplete' | 'trialing'
          plan: 'basic' | 'standard' | 'premium'
          current_period_start: string
          current_period_end: string
          created_at?: string
          updated_at?: string
          canceled_at?: string | null
          trial_end?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          stripe_subscription_id?: string
          stripe_price_id?: string
          status?: 'active' | 'canceled' | 'past_due' | 'incomplete' | 'trialing'
          plan?: 'basic' | 'standard' | 'premium'
          current_period_start?: string
          current_period_end?: string
          created_at?: string
          updated_at?: string
          canceled_at?: string | null
          trial_end?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
          last_accessed_at: string
          is_public: boolean
          file_count: number
          size_bytes: number
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
          last_accessed_at?: string
          is_public?: boolean
          file_count?: number
          size_bytes?: number
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
          last_accessed_at?: string
          is_public?: boolean
          file_count?: number
          size_bytes?: number
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      usage_analytics: {
        Row: {
          id: string
          user_id: string
          action_type: string
          metadata: Json
          created_at: string
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          id?: string
          user_id: string
          action_type: string
          metadata?: Json
          created_at?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          action_type?: string
          metadata?: Json
          created_at?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usage_analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      payment_history: {
        Row: {
          id: string
          user_id: string
          stripe_payment_intent_id: string
          amount: number
          currency: string
          status: string
          description: string | null
          created_at: string
          paid_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          stripe_payment_intent_id: string
          amount: number
          currency?: string
          status: string
          description?: string | null
          created_at?: string
          paid_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          stripe_payment_intent_id?: string
          amount?: number
          currency?: string
          status?: string
          description?: string | null
          created_at?: string
          paid_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      user_stats: {
        Row: {
          total_users: number
          free_users: number
          standard_users: number
          premium_users: number
          new_users_30d: number
          active_users_7d: number
          active_users_30d: number
        }
      }
      revenue_stats: {
        Row: {
          total_payments: number
          total_revenue_cents: number
          avg_payment_cents: number
          payments_30d: number
          revenue_30d_cents: number
          payments_7d: number
          revenue_7d_cents: number
        }
      }
      project_stats: {
        Row: {
          total_projects: number
          users_with_projects: number
          avg_files_per_project: number
          total_storage_bytes: number
          projects_created_30d: number
          active_projects_7d: number
        }
      }
      daily_registrations: {
        Row: {
          date: string
          registrations: number
          free_registrations: number
          paid_registrations: number
        }
      }
      daily_revenue: {
        Row: {
          date: string
          payment_count: number
          revenue_cents: number
        }
      }
      user_engagement: {
        Row: {
          id: string
          email: string
          plan: string
          created_at: string
          last_sign_in_at: string | null
          project_count: number
          total_actions: number
          last_action_at: string | null
          total_spent_cents: number
        }
      }
    }
    Functions: {
      increment_usage_count: {
        Args: {
          user_id: string
        }
        Returns: number
      }
    }
    Enums: {
      plan_type: 'basic' | 'standard' | 'premium'
      subscription_status: 'active' | 'canceled' | 'past_due' | 'incomplete' | 'trialing'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
