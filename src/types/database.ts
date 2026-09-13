export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      gifts: {
        Row: {
          id: string;
          public_token: string;
          recipient_name: string;
          giver_name: string | null;
          flower_type: string;
          flower_name: string;
          personal_message: string;
          bloom_message: string;
          start_date: string;
          created_at: string;
          updated_at: string;
          status: string;
        };
        Insert: {
          id?: string;
          public_token: string;
          recipient_name: string;
          giver_name?: string | null;
          flower_type: string;
          flower_name: string;
          personal_message: string;
          bloom_message: string;
          start_date: string;
          created_at?: string;
          updated_at?: string;
          status?: string;
        };
        Update: {
          id?: string;
          public_token?: string;
          recipient_name?: string;
          giver_name?: string | null;
          flower_type?: string;
          flower_name?: string;
          personal_message?: string;
          bloom_message?: string;
          start_date?: string;
          created_at?: string;
          updated_at?: string;
          status?: string;
        };
        Relationships: [];
      };
      care_events: {
        Row: {
          id: string;
          gift_id: string;
          care_date: string;
          care_type: string;
          xp_awarded: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          gift_id: string;
          care_date: string;
          care_type: string;
          xp_awarded: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          gift_id?: string;
          care_date?: string;
          care_type?: string;
          xp_awarded?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'care_events_gift_id_fkey';
            columns: ['gift_id'];
            isOneToOne: false;
            referencedRelation: 'gifts';
            referencedColumns: ['id'];
          },
        ];
      };
      rewards: {
        Row: {
          id: string;
          gift_id: string;
          reward_key: string;
          unlocked_at: string;
        };
        Insert: {
          id?: string;
          gift_id: string;
          reward_key: string;
          unlocked_at: string;
        };
        Update: {
          id?: string;
          gift_id?: string;
          reward_key?: string;
          unlocked_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'rewards_gift_id_fkey';
            columns: ['gift_id'];
            isOneToOne: false;
            referencedRelation: 'gifts';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
