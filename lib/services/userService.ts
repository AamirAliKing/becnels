import { supabase } from '@/lib/supabase'

export interface UserProfile {
  id?: string
  clerk_id: string
  full_name: string | null
  email: string | null
  profile_image_url: string | null
  created_at?: string
  updated_at?: string
}

export class UserServiceError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message)
    this.name = 'UserServiceError'
  }
}

export async function syncUserWithSupabase(userData: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>): Promise<UserProfile> {
  try {
    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('user_profiles')
      .select()
      .eq('clerk_id', userData.clerk_id)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found"
      throw new UserServiceError('Error fetching user profile', fetchError)
    }

    if (existingUser) {
      // Update existing user
      const { data: updatedUser, error: updateError } = await supabase
        .from('user_profiles')
        .update({
          full_name: userData.full_name,
          email: userData.email,
          profile_image_url: userData.profile_image_url
        })
        .eq('clerk_id', userData.clerk_id)
        .select()
        .single()

      if (updateError) {
        throw new UserServiceError('Error updating user profile', updateError)
      }

      return updatedUser as UserProfile
    } else {
      // Create new user
      const { data: newUser, error: insertError } = await supabase
        .from('user_profiles')
        .insert([userData])
        .select()
        .single()

      if (insertError) {
        throw new UserServiceError('Error creating user profile', insertError)
      }

      return newUser as UserProfile
    }
  } catch (error) {
    if (error instanceof UserServiceError) {
      throw error
    }
    throw new UserServiceError('Unexpected error in syncUserWithSupabase', error)
  }
}

export async function updateUserProfile(
  clerkId: string,
  updates: Partial<Omit<UserProfile, 'id' | 'clerk_id' | 'created_at' | 'updated_at'>>
): Promise<UserProfile> {
  try {
    const { data: updatedUser, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('clerk_id', clerkId)
      .select()
      .single()

    if (error) {
      throw new UserServiceError('Error updating user profile', error)
    }

    if (!updatedUser) {
      throw new UserServiceError('User profile not found')
    }

    return updatedUser as UserProfile
  } catch (error) {
    if (error instanceof UserServiceError) {
      throw error
    }
    throw new UserServiceError('Unexpected error in updateUserProfile', error)
  }
} 