import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://zfpvapicjerugprefkfr.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcHZhcGljamVydWdwcmVma2ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2NzM4ODMsImV4cCI6MjA1NjI0OTg4M30.GDRiiE-4D9JQS2su60kzeNSnDdubicIBo1FPg45KJzo"

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
