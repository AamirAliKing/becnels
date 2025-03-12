'use client';

import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user exists in Supabase
    const { data: existingUser, error: fetchError } = await supabase
      .from('user_profiles')
      .select()
      .eq('clerk_id', user.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching user:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
    }

    return NextResponse.json({ user: existingUser || user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = {
      clerk_id: user.id,
      full_name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || '',
      email: user.emailAddresses[0]?.emailAddress || '',
      profile_image_url: user.imageUrl || '',
      updated_at: new Date().toISOString(),
    };

    // Create or update user profile in Supabase
    const { error } = await supabase
      .from('user_profiles')
      .upsert(userData, {
        onConflict: 'clerk_id'
      });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to save user data' }, { status: 500 });
    }

    // Fetch the updated user data
    const { data: updatedUser, error: fetchError } = await supabase
      .from('user_profiles')
      .select()
      .eq('clerk_id', user.id)
      .single();

    if (fetchError) {
      console.error('Error fetching updated user:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch updated user data' }, { status: 500 });
    }

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Error creating/updating user:', error);
    return NextResponse.json({ error: 'Failed to create/update user' }, { status: 500 });
  }
} 