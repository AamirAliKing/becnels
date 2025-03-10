import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://zfpvapicjerugprefkfr.supabase.co"
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

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
