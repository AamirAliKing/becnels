import type { UserProfile } from '@/lib/supabase';

export async function syncUserWithSupabase(userData: {
  clerk_id: string;
  full_name: string;
  email: string;
  profile_image_url: string;
}): Promise<{ user: UserProfile }> {
  const response = await fetch('/api/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to sync user: ${JSON.stringify(errorData)}`);
  }

  return response.json();
}

export async function updateUserProfile(userData: {
  clerk_id: string;
  full_name: string;
  email: string;
  profile_image_url: string;
}): Promise<void> {
  const response = await fetch('/api/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Failed to update profile');
  }
} 