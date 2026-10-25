import { createClient } from "@supabase/supabase-js";
import type { LoveRequest } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client with service role (only use in API routes / server components carefully)
export function createServerClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return supabase;
  }
  return createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export type DbLoveRequest = {
  id: string;
  title: string;
  question: string;
  subtitle: string | null;
  sad_gif_url: string | null;
  happy_gif_url: string | null;
  yes_message: string | null;
  yes_button_text: string;
  no_button_text: string;
  theme: string;
  accent_color: string | null;
  sender_name: string | null;
  intro_message: string | null;
  final_message: string | null;
  created_at: string;
  expires_at: string | null;
  yes_count: number;
  no_count: number;
  edit_token: string;
};

export function mapDbToLoveRequest(row: DbLoveRequest): LoveRequest {
  return {
    id: row.id,
    title: row.title,
    question: row.question,
    subtitle: row.subtitle,
    sad_gif_url: row.sad_gif_url,
    happy_gif_url: row.happy_gif_url,
    yes_message: row.yes_message,
    yes_button_text: row.yes_button_text,
    no_button_text: row.no_button_text,
    theme: row.theme as LoveRequest["theme"],
    accent_color: row.accent_color,
    sender_name: row.sender_name,
    intro_message: row.intro_message,
    final_message: row.final_message,
    created_at: row.created_at,
    expires_at: row.expires_at,
    yes_count: row.yes_count,
    no_count: row.no_count,
  };
}
