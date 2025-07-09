import { NextRequest, NextResponse } from 'next/server';
import { getUserVoteLimitInfo } from '@/lib/supabase-database';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const voteLimitInfo = await getUserVoteLimitInfo(user.id);
    
    return NextResponse.json(voteLimitInfo);
  } catch (error) {
    console.error('Error getting vote limits:', error);
    return NextResponse.json({ error: 'Failed to get vote limits' }, { status: 500 });
  }
} 