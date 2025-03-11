import { createClient } from '@supabase/supabase-js'

<<<<<<< HEAD
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
=======
const supabaseUrl = "https://zfpvapicjerugprefkfr.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcHZhcGljamVydWdwcmVma2ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2NzM4ODMsImV4cCI6MjA1NjI0OTg4M30.GDRiiE-4D9JQS2su60kzeNSnDdubicIBo1FPg45KJzo"
>>>>>>> d3bd0472a35875099ef59734477bcda5834e3687

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
