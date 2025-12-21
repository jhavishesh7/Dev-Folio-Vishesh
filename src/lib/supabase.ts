import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Blog post type
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  author?: string;
  published_at: string;
  created_at: string;
  updated_at?: string;
  tags?: string[];
  cover_image?: string;
  read_time?: number;
  likes_count?: number;
  comments_count?: number;
}

// Blog like type
export interface BlogLike {
  id: string;
  blog_id: string;
  user_id: string;
  created_at: string;
}

// Blog comment type
export interface BlogComment {
  id: string;
  blog_id: string;
  user_name: string;
  user_email?: string;
  content: string;
  created_at: string;
  updated_at?: string;
}

// Helper function to get or create user ID
export const getUserId = (): string => {
  const STORAGE_KEY = 'blog_user_id';
  let userId = localStorage.getItem(STORAGE_KEY);
  
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, userId);
  }
  
  return userId;
};


