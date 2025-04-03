import { UserStats } from './types';

export type Database = {
  public: {
    Tables: {
      points_history: {
        Row: {
          amount: number;
          created_at: string | null;
          description: string | null;
          id: number;
          reference_id: number | null;
          reference_type: string | null;
          source: string;
          user_id: string;
        };
        Insert: {
          amount: number;
          created_at?: string | null;
          description?: string | null;
          id?: number;
          reference_id?: number | null;
          reference_type?: string | null;
          source: string;
          user_id: string;
        };
        Update: {
          amount?: number;
          created_at?: string | null;
          description?: string | null;
          id?: number;
          reference_id?: number | null;
          reference_type?: string | null;
          source?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'fk_user_id';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      prize: {
        Row: {
          created_at: string | null;
          id: number;
          is_active: boolean | null;
          prize_amount: number;
          prize_category: number | null;
          prize_name: string;
          probability: number;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          is_active?: boolean | null;
          prize_amount: number;
          prize_category?: number | null;
          prize_name: string;
          probability: number;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          is_active?: boolean | null;
          prize_amount?: number;
          prize_category?: number | null;
          prize_name?: string;
          probability?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'cashprize_prize_category_fkey';
            columns: ['prize_category'];
            isOneToOne: false;
            referencedRelation: 'prize_category';
            referencedColumns: ['id'];
          },
        ];
      };
      prize_category: {
        Row: {
          cost: number | null;
          id: number;
          name: string | null;
        };
        Insert: {
          cost?: number | null;
          id?: number;
          name?: string | null;
        };
        Update: {
          cost?: number | null;
          id?: number;
          name?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          full_name: string | null;
          id: string;
          last_opened_cashprize_at: string | null;
          points: number;
          updated_at: string | null;
          username: string | null;
          website: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          full_name?: string | null;
          id: string;
          last_opened_cashprize_at?: string | null;
          points?: number;
          updated_at?: string | null;
          username?: string | null;
          website?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          full_name?: string | null;
          id?: string;
          last_opened_cashprize_at?: string | null;
          points?: number;
          updated_at?: string | null;
          username?: string | null;
          website?: string | null;
        };
        Relationships: [];
      };
      user_prize_attempts: {
        Row: {
          attempted_at: string | null;
          id: number;
          is_free: boolean;
          is_revealed: boolean;
          prize_id: number | null;
          success: boolean;
          user_id: string;
        };
        Insert: {
          attempted_at?: string | null;
          id?: number;
          is_free?: boolean;
          is_revealed?: boolean;
          prize_id?: number | null;
          success?: boolean;
          user_id: string;
        };
        Update: {
          attempted_at?: string | null;
          id?: number;
          is_free?: boolean;
          is_revealed?: boolean;
          prize_id?: number | null;
          success?: boolean;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'fk_user_prize_profile';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_prize_attempts_prize_id_fkey';
            columns: ['prize_id'];
            isOneToOne: false;
            referencedRelation: 'prize';
            referencedColumns: ['id'];
          },
        ];
      };
      user_role: {
        Row: {
          created_at: string | null;
          id: string;
          role: Database['public']['Enums']['app_role'];
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          role?: Database['public']['Enums']['app_role'];
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          role?: Database['public']['Enums']['app_role'];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      add_points_history: {
        Args: {
          p_user_id: string;
          p_amount: number;
          p_source: string;
          p_description?: string;
          p_reference_id?: number;
          p_reference_type?: string;
        };
        Returns: number;
      };
      can_user_generate_free_prize: {
        Args: {
          p_user_id: string;
        };
        Returns: boolean;
      };
      generate_free_prize: {
        Args: {
          p_user_id: string;
        };
        Returns: {
          can_generate: boolean;
          time_remaining: string;
          prize_id: number;
          prize_name: string;
          prize_amount: number;
        }[];
      };
      generate_user_prize: {
        Args: {
          p_user_id: string;
          p_category_id?: number;
          p_is_free?: boolean;
        };
        Returns: {
          can_generate: boolean;
          time_remaining: string;
          prize_id: number;
          prize_name: string;
          prize_amount: number;
          multiplier_applied: boolean;
          multiplier_name: string;
          multiplier_value: number;
        }[];
      };
      get_next_free_prize_time: {
        Args: {
          p_user_id: string;
        };
        Returns: {
          can_generate_now: boolean;
          next_time: string;
          time_remaining: string;
        }[];
      };
      get_user_stats: {
        Args: {
          p_user_id: string;
        };
        Returns: UserStats;
      };
      purchase_ticket_and_generate_prize: {
        Args: {
          p_user_id: string;
          p_category_id: number;
        };
        Returns: {
          success: boolean;
          message: string;
          prize_id: number;
          prize_name: string;
          prize_amount: number;
          multiplier_applied: boolean;
          multiplier_name: string;
          multiplier_value: number;
        }[];
      };
      reveal_prize: {
        Args: {
          p_attempt_id: number;
        };
        Returns: {
          success: boolean;
          message: string;
          prize_id: number;
          prize_name: string;
          prize_amount: number;
          points_added: boolean;
        }[];
      };
    };
    Enums: {
      app_role: 'admin' | 'user';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;
