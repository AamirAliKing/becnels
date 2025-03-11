import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false // Since we're using Clerk for auth
  }
})

// User profile type
export type UserProfile = {
  id: string
  clerk_id: string
  full_name: string
  email: string
  profile_image_url: string
  created_at?: string
  updated_at?: string
}
