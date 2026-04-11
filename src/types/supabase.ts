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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      check_ins: {
        Row: {
          created_at: string | null
          date: string
          hips: number | null
          id: string
          neck: number | null
          user_id: string
          waist: number | null
          weight: number | null
        }
        Insert: {
          created_at?: string | null
          date: string
          hips?: number | null
          id?: string
          neck?: number | null
          user_id: string
          waist?: number | null
          weight?: number | null
        }
        Update: {
          created_at?: string | null
          date?: string
          hips?: number | null
          id?: string
          neck?: number | null
          user_id?: string
          waist?: number | null
          weight?: number | null
        }
        Relationships: []
      }
      exercise_logs: {
        Row: {
          calories_burned: number
          created_at: string | null
          date: string
          duration_minutes: number | null
          id: string
          name: string
          user_id: string
        }
        Insert: {
          calories_burned: number
          created_at?: string | null
          date: string
          duration_minutes?: number | null
          id: string
          name: string
          user_id: string
        }
        Update: {
          calories_burned?: number
          created_at?: string | null
          date?: string
          duration_minutes?: number | null
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      fitness_goals: {
        Row: {
          activity_level: string | null
          id: string
          target_weight: number | null
          updated_at: string | null
          user_id: string
          weekly_goal: string | null
          weight_unit: string | null
        }
        Insert: {
          activity_level?: string | null
          id?: string
          target_weight?: number | null
          updated_at?: string | null
          user_id: string
          weekly_goal?: string | null
          weight_unit?: string | null
        }
        Update: {
          activity_level?: string | null
          id?: string
          target_weight?: number | null
          updated_at?: string | null
          user_id?: string
          weekly_goal?: string | null
          weight_unit?: string | null
        }
        Relationships: []
      }
      food_logs: {
        Row: {
          calories: number
          carbs: number | null
          created_at: string | null
          date: string
          fats: number | null
          id: string
          meal_type: string
          name: string
          protein: number | null
          sodium: number | null
          sugar: number | null
          user_id: string
        }
        Insert: {
          calories: number
          carbs?: number | null
          created_at?: string | null
          date: string
          fats?: number | null
          id?: string
          meal_type: string
          name: string
          protein?: number | null
          sodium?: number | null
          sugar?: number | null
          user_id: string
        }
        Update: {
          calories?: number
          carbs?: number | null
          created_at?: string | null
          date?: string
          fats?: number | null
          id?: string
          meal_type?: string
          name?: string
          protein?: number | null
          sodium?: number | null
          sugar?: number | null
          user_id?: string
        }
        Relationships: []
      }
      macro_goals: {
        Row: {
          carbs: number
          fats: number
          id: string
          protein: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          carbs?: number
          fats?: number
          id?: string
          protein?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          carbs?: number
          fats?: number
          id?: string
          protein?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      micro_nutrient_goals: {
        Row: {
          calcium: number | null
          cholesterol: number | null
          fiber: number | null
          id: string
          iron: number | null
          monounsaturated_fat: number | null
          polyunsaturated_fat: number | null
          potassium: number | null
          saturated_fat: number | null
          sodium: number | null
          sugar: number | null
          trans_fat: number | null
          updated_at: string | null
          user_id: string
          vitamin_a: number | null
          vitamin_c: number | null
          vitamin_d: number | null
          vitamin_e: number | null
          vitamin_k: number | null
        }
        Insert: {
          calcium?: number | null
          cholesterol?: number | null
          fiber?: number | null
          id?: string
          iron?: number | null
          monounsaturated_fat?: number | null
          polyunsaturated_fat?: number | null
          potassium?: number | null
          saturated_fat?: number | null
          sodium?: number | null
          sugar?: number | null
          trans_fat?: number | null
          updated_at?: string | null
          user_id: string
          vitamin_a?: number | null
          vitamin_c?: number | null
          vitamin_d?: number | null
          vitamin_e?: number | null
          vitamin_k?: number | null
        }
        Update: {
          calcium?: number | null
          cholesterol?: number | null
          fiber?: number | null
          id?: string
          iron?: number | null
          monounsaturated_fat?: number | null
          polyunsaturated_fat?: number | null
          potassium?: number | null
          saturated_fat?: number | null
          sodium?: number | null
          sugar?: number | null
          trans_fat?: number | null
          updated_at?: string | null
          user_id?: string
          vitamin_a?: number | null
          vitamin_c?: number | null
          vitamin_d?: number | null
          vitamin_e?: number | null
          vitamin_k?: number | null
        }
        Relationships: []
      }
      recent_foods: {
        Row: {
          added_at: string
          calories: number
          carbs: number | null
          fats: number | null
          id: string
          name: string
          protein: number | null
          sodium: number | null
          sugar: number | null
          user_id: string
        }
        Insert: {
          added_at?: string
          calories: number
          carbs?: number | null
          fats?: number | null
          id?: string
          name: string
          protein?: number | null
          sodium?: number | null
          sugar?: number | null
          user_id: string
        }
        Update: {
          added_at?: string
          calories?: number
          carbs?: number | null
          fats?: number | null
          id?: string
          name?: string
          protein?: number | null
          sodium?: number | null
          sugar?: number | null
          user_id?: string
        }
        Relationships: []
      }
      water_goals: {
        Row: {
          amount_ml: number
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_ml: number
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_ml?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      water_intake: {
        Row: {
          amount_ml: number
          date: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount_ml: number
          date: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount_ml?: number
          date?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
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
    Enums: {},
  },
} as const
