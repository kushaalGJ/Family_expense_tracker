// Hand-written to match supabase/migrations/0001_init.sql.
// Regenerate from the live project once it exists:
//   npx supabase gen types typescript --project-id <ref> > src/lib/types/database.types.ts

export type Category =
  | "Food"
  | "Transport"
  | "Shopping"
  | "Bills"
  | "Health"
  | "Entertainment"
  | "Education"
  | "Other";

export type Database = {
  public: {
    Tables: {
      families: {
        Row: {
          id: string;
          name: string;
          code: string;
          created_at: string;
          created_by: string;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          created_at?: string;
          created_by: string;
        };
        Update: Partial<Database["public"]["Tables"]["families"]["Insert"]>;
        Relationships: [];
      };
      family_members: {
        Row: {
          id: string;
          family_id: string;
          user_id: string;
          name: string;
          emoji: string;
          color: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          user_id: string;
          name: string;
          emoji?: string;
          color?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["family_members"]["Insert"]>;
        Relationships: [];
      };
      expenses: {
        Row: {
          id: string;
          user_id: string;
          family_id: string | null;
          amount: number;
          category: string;
          note: string;
          date: string;
          is_shared: boolean;
          is_recurring: boolean;
          payment_method: string | null;
          attachment_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          family_id?: string | null;
          amount: number;
          category: string;
          note?: string;
          date?: string;
          is_shared?: boolean;
          is_recurring?: boolean;
          payment_method?: string | null;
          attachment_url?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["expenses"]["Insert"]>;
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          user_id: string;
          family_id: string | null;
          name: string;
          icon: string;
          color: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          family_id?: string | null;
          name: string;
          icon?: string;
          color?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
        Relationships: [];
      };
      budgets: {
        Row: {
          id: string;
          user_id: string;
          family_id: string | null;
          category: string;
          monthly_limit: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          family_id?: string | null;
          category: string;
          monthly_limit: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["budgets"]["Insert"]>;
        Relationships: [];
      };
      income: {
        Row: {
          id: string;
          user_id: string;
          family_id: string | null;
          amount: number;
          source: string;
          date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          family_id?: string | null;
          amount: number;
          source?: string;
          date?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["income"]["Insert"]>;
        Relationships: [];
      };
      goals: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          target: number;
          saved: number;
          deadline: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          target: number;
          saved?: number;
          deadline?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["goals"]["Insert"]>;
        Relationships: [];
      };
      reminders: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          amount: number;
          due_day: number;
          category: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          amount: number;
          due_day: number;
          category: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["reminders"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      create_family_with_owner: {
        Args: {
          family_name: string;
          owner_name: string;
          owner_emoji: string;
          owner_color: string;
        };
        Returns: Database["public"]["Tables"]["families"]["Row"];
      };
      join_family_by_code: {
        Args: {
          join_code: string;
          member_name: string;
          member_emoji: string;
          member_color: string;
        };
        Returns: Database["public"]["Tables"]["families"]["Row"];
      };
      is_family_member: {
        Args: { target_family_id: string };
        Returns: boolean;
      };
      delete_current_user: {
        Args: Record<string, never>;
        Returns: undefined;
      };
    };
  };
};
