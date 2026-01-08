export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author_id: string
          category: string
          content: string
          created_at: string | null
          excerpt: string | null
          featured_image: string | null
          id: string
          published: boolean | null
          published_at: string | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string | null
          views_count: number | null
        }
        Insert: {
          author_id: string
          category: string
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
          views_count?: number | null
        }
        Update: {
          author_id?: string
          category?: string
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          views_count?: number | null
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          active: boolean | null
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string | null
          id: string
          image_url: string | null
          start_date: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          start_date?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          start_date?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      distribution_events: {
        Row: {
          created_at: string | null
          end_time: string
          event_date: string
          id: string
          location_id: string | null
          notes: string | null
          start_time: string
          units_distributed: number | null
          volunteer_count: number | null
          weather: string | null
        }
        Insert: {
          created_at?: string | null
          end_time: string
          event_date: string
          id?: string
          location_id?: string | null
          notes?: string | null
          start_time: string
          units_distributed?: number | null
          volunteer_count?: number | null
          weather?: string | null
        }
        Update: {
          created_at?: string | null
          end_time?: string
          event_date?: string
          id?: string
          location_id?: string | null
          notes?: string | null
          start_time?: string
          units_distributed?: number | null
          volunteer_count?: number | null
          weather?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "distribution_events_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "distribution_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      distribution_locations: {
        Row: {
          active: boolean | null
          address: string | null
          city: string
          country: string
          created_at: string | null
          distribution_hours: string | null
          id: string
          last_distribution_date: string | null
          latitude: number | null
          location_type: string | null
          longitude: number | null
          name: string
          total_distributed: number | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          address?: string | null
          city: string
          country: string
          created_at?: string | null
          distribution_hours?: string | null
          id?: string
          last_distribution_date?: string | null
          latitude?: number | null
          location_type?: string | null
          longitude?: number | null
          name: string
          total_distributed?: number | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          address?: string | null
          city?: string
          country?: string
          created_at?: string | null
          distribution_hours?: string | null
          id?: string
          last_distribution_date?: string | null
          latitude?: number | null
          location_type?: string | null
          longitude?: number | null
          name?: string
          total_distributed?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          event_date: string
          id: string
          image_url: string | null
          location: string | null
          published: boolean | null
          registration_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          event_date: string
          id?: string
          image_url?: string | null
          location?: string | null
          published?: boolean | null
          registration_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          event_date?: string
          id?: string
          image_url?: string | null
          location?: string | null
          published?: boolean | null
          registration_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      fu_sponsor_inquiries: {
        Row: {
          admin_notes: string | null
          brand_story: string | null
          budget_range: string | null
          company_name: string
          contact_person: string
          created_at: string
          edition_size: string | null
          email: string
          flavor_vision: string | null
          id: string
          impact_cause: string | null
          phone: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
          website: string | null
        }
        Insert: {
          admin_notes?: string | null
          brand_story?: string | null
          budget_range?: string | null
          company_name: string
          contact_person: string
          created_at?: string
          edition_size?: string | null
          email: string
          flavor_vision?: string | null
          id?: string
          impact_cause?: string | null
          phone?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          admin_notes?: string | null
          brand_story?: string | null
          budget_range?: string | null
          company_name?: string
          contact_person?: string
          created_at?: string
          edition_size?: string | null
          email?: string
          flavor_vision?: string | null
          id?: string
          impact_cause?: string | null
          phone?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      golden_ticket_winners: {
        Row: {
          created_at: string
          creation_description: string | null
          creation_flavor: string | null
          creation_image_url: string | null
          creation_name: string | null
          edition_size: number | null
          featured: boolean | null
          id: string
          impact_amount: number | null
          impact_project: string | null
          prize_id: string | null
          published: boolean | null
          series_number: number | null
          updated_at: string
          user_id: string | null
          winner_avatar_url: string | null
          winner_location: string | null
          winner_name: string
          winner_quote: string | null
          winning_product_id: string | null
          won_at: string
        }
        Insert: {
          created_at?: string
          creation_description?: string | null
          creation_flavor?: string | null
          creation_image_url?: string | null
          creation_name?: string | null
          edition_size?: number | null
          featured?: boolean | null
          id?: string
          impact_amount?: number | null
          impact_project?: string | null
          prize_id?: string | null
          published?: boolean | null
          series_number?: number | null
          updated_at?: string
          user_id?: string | null
          winner_avatar_url?: string | null
          winner_location?: string | null
          winner_name: string
          winner_quote?: string | null
          winning_product_id?: string | null
          won_at?: string
        }
        Update: {
          created_at?: string
          creation_description?: string | null
          creation_flavor?: string | null
          creation_image_url?: string | null
          creation_name?: string | null
          edition_size?: number | null
          featured?: boolean | null
          id?: string
          impact_amount?: number | null
          impact_project?: string | null
          prize_id?: string | null
          published?: boolean | null
          series_number?: number | null
          updated_at?: string
          user_id?: string | null
          winner_avatar_url?: string | null
          winner_location?: string | null
          winner_name?: string
          winner_quote?: string | null
          winning_product_id?: string | null
          won_at?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string | null
          email: string
          id: string
          subscribed: boolean | null
          unsubscribed_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          subscribed?: boolean | null
          unsubscribed_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          subscribed?: boolean | null
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string
          product_id: string | null
          product_image: string | null
          product_name: string
          quantity: number
          total_price: number
          unit_price: number
          variants: Json | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id: string
          product_id?: string | null
          product_image?: string | null
          product_name: string
          quantity: number
          total_price: number
          unit_price: number
          variants?: Json | null
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string
          product_id?: string | null
          product_image?: string | null
          product_name?: string
          quantity?: number
          total_price?: number
          unit_price?: number
          variants?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          id: string
          order_number: string
          payment_intent_id: string | null
          payment_status: string
          shipping_cost: number
          status: string
          subtotal: number
          tax: number
          total: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_number: string
          payment_intent_id?: string | null
          payment_status?: string
          shipping_cost?: number
          status?: string
          subtotal: number
          tax?: number
          total: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          order_number?: string
          payment_intent_id?: string | null
          payment_status?: string
          shipping_cost?: number
          status?: string
          subtotal?: number
          tax?: number
          total?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      prize_claims: {
        Row: {
          admin_notes: string | null
          claim_status: string | null
          code_entered: string
          created_at: string | null
          fulfillment_notes: string | null
          id: string
          prize_id: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          claim_status?: string | null
          code_entered: string
          created_at?: string | null
          fulfillment_notes?: string | null
          id?: string
          prize_id: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          claim_status?: string | null
          code_entered?: string
          created_at?: string | null
          fulfillment_notes?: string | null
          id?: string
          prize_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prize_claims_prize_id_fkey"
            columns: ["prize_id"]
            isOneToOne: false
            referencedRelation: "secret_cap_prizes"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          additional_images: string[] | null
          care_instructions: string | null
          category: string
          collaboration_brand: string | null
          colors_available: string[] | null
          created_at: string | null
          description: string | null
          edition_size: number | null
          featured: boolean | null
          id: string
          image_url: string
          in_stock: boolean | null
          material_specs: string | null
          name: string
          original_price: number | null
          partnership_brand: string | null
          pre_order: boolean | null
          price: number
          rating: number | null
          release_date: string | null
          reserved_quantity: number | null
          reviews_count: number | null
          series_country: string | null
          series_design_url: string | null
          series_milestone: number | null
          series_name: string | null
          series_number: number | null
          sizes_available: string[] | null
          stock_quantity: number | null
          subcategory: string | null
          tier: string | null
          updated_at: string | null
          variants: Json | null
        }
        Insert: {
          additional_images?: string[] | null
          care_instructions?: string | null
          category: string
          collaboration_brand?: string | null
          colors_available?: string[] | null
          created_at?: string | null
          description?: string | null
          edition_size?: number | null
          featured?: boolean | null
          id?: string
          image_url: string
          in_stock?: boolean | null
          material_specs?: string | null
          name: string
          original_price?: number | null
          partnership_brand?: string | null
          pre_order?: boolean | null
          price: number
          rating?: number | null
          release_date?: string | null
          reserved_quantity?: number | null
          reviews_count?: number | null
          series_country?: string | null
          series_design_url?: string | null
          series_milestone?: number | null
          series_name?: string | null
          series_number?: number | null
          sizes_available?: string[] | null
          stock_quantity?: number | null
          subcategory?: string | null
          tier?: string | null
          updated_at?: string | null
          variants?: Json | null
        }
        Update: {
          additional_images?: string[] | null
          care_instructions?: string | null
          category?: string
          collaboration_brand?: string | null
          colors_available?: string[] | null
          created_at?: string | null
          description?: string | null
          edition_size?: number | null
          featured?: boolean | null
          id?: string
          image_url?: string
          in_stock?: boolean | null
          material_specs?: string | null
          name?: string
          original_price?: number | null
          partnership_brand?: string | null
          pre_order?: boolean | null
          price?: number
          rating?: number | null
          release_date?: string | null
          reserved_quantity?: number | null
          reviews_count?: number | null
          series_country?: string | null
          series_design_url?: string | null
          series_milestone?: number | null
          series_name?: string | null
          series_number?: number | null
          sizes_available?: string[] | null
          stock_quantity?: number | null
          subcategory?: string | null
          tier?: string | null
          updated_at?: string | null
          variants?: Json | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          email: string
          id: string
          phone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email: string
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          referee_id: string | null
          referral_code: string
          referrer_id: string
          reward_earned: number | null
          status: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          referee_id?: string | null
          referral_code: string
          referrer_id: string
          reward_earned?: number | null
          status?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          referee_id?: string | null
          referral_code?: string
          referrer_id?: string
          reward_earned?: number | null
          status?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          helpful_votes: number | null
          id: string
          product_id: string | null
          rating: number
          updated_at: string | null
          user_id: string
          verified_purchase: boolean | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          helpful_votes?: number | null
          id?: string
          product_id?: string | null
          rating: number
          updated_at?: string | null
          user_id: string
          verified_purchase?: boolean | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          helpful_votes?: number | null
          id?: string
          product_id?: string | null
          rating?: number
          updated_at?: string | null
          user_id?: string
          verified_purchase?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      secret_cap_prizes: {
        Row: {
          claimed: boolean | null
          claimed_at: string | null
          claimed_by: string | null
          code: string
          created_at: string | null
          expiry_date: string | null
          id: string
          prize_description: string
          prize_title: string
          prize_type: string
          prize_value: string | null
          product_id: string | null
          terms_conditions: string | null
        }
        Insert: {
          claimed?: boolean | null
          claimed_at?: string | null
          claimed_by?: string | null
          code: string
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          prize_description: string
          prize_title: string
          prize_type: string
          prize_value?: string | null
          product_id?: string | null
          terms_conditions?: string | null
        }
        Update: {
          claimed?: boolean | null
          claimed_at?: string | null
          claimed_by?: string | null
          code?: string
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          prize_description?: string
          prize_title?: string
          prize_type?: string
          prize_value?: string | null
          product_id?: string | null
          terms_conditions?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "secret_cap_prizes_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      shipping_addresses: {
        Row: {
          address_line1: string
          address_line2: string | null
          city: string
          country: string
          created_at: string | null
          email: string
          full_name: string
          id: string
          order_id: string
          phone: string
          postal_code: string
          state: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          city: string
          country: string
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          order_id: string
          phone: string
          postal_code: string
          state: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          city?: string
          country?: string
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          order_id?: string
          phone?: string
          postal_code?: string
          state?: string
        }
        Relationships: [
          {
            foreignKeyName: "shipping_addresses_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_name: string
          status: string
          stripe_subscription_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_name: string
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_name?: string
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_impact: {
        Row: {
          carbon_saved: number | null
          created_at: string | null
          id: string
          liters_funded: number | null
          orders_count: number | null
          total_spent: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          carbon_saved?: number | null
          created_at?: string | null
          id?: string
          liters_funded?: number | null
          orders_count?: number | null
          total_spent?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          carbon_saved?: number | null
          created_at?: string | null
          id?: string
          liters_funded?: number | null
          orders_count?: number | null
          total_spent?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          category: string
          created_at: string | null
          created_by: string | null
          description: string | null
          featured: boolean | null
          id: string
          published: boolean | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          views_count: number | null
          youtube_url: string
        }
        Insert: {
          category: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          published?: boolean | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          views_count?: number | null
          youtube_url: string
        }
        Update: {
          category?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          published?: boolean | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          views_count?: number | null
          youtube_url?: string
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          added_at: string | null
          id: string
          product_id: string | null
          user_id: string
        }
        Insert: {
          added_at?: string | null
          id?: string
          product_id?: string | null
          user_id: string
        }
        Update: {
          added_at?: string | null
          id?: string
          product_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_prize: {
        Args: { code_input: string }
        Returns: {
          error_message: string
          prize_description: string
          prize_title: string
          prize_type: string
          prize_value: string
          success: boolean
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      validate_prize_code: { Args: { code_input: string }; Returns: boolean }
    }
    Enums: {
      app_role: "customer" | "admin" | "marketing"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["customer", "admin", "marketing"],
    },
  },
} as const
