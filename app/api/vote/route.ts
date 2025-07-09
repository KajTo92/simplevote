import { NextRequest, NextResponse } from 'next/server';
import { addVote, getPoll, getUserVoteLimitInfo } from '@/lib/supabase-database';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pollId, optionId, voterFingerprint } = body;
    
    if (!pollId || !optionId || !voterFingerprint) {
      return NextResponse.json(
        { error: 'Poll ID, option ID, and voter fingerprint are required' }, 
        { status: 400 }
      );
    }

    // Sprawdź czy głosowanie istnieje
    const poll = await getPoll(pollId);
    if (!poll) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    }

    // Sprawdź czy opcja istnieje
    const optionExists = poll.options.some(option => option.id === optionId);
    if (!optionExists) {
      return NextResponse.json({ error: 'Option not found' }, { status: 404 });
    }

    // Get poll owner to check vote limits
    const supabase = createClient();
    const { data: pollData, error: pollError } = await supabase
      .from('polls')
      .select('user_id')
      .eq('id', pollId)
      .single();

    if (pollError || !pollData) {
      return NextResponse.json({ error: 'Could not verify poll ownership' }, { status: 500 });
    }

    // Check vote limits for poll owner
    const voteLimitInfo = await getUserVoteLimitInfo(pollData.user_id);
    if (!voteLimitInfo.canVote) {
      return NextResponse.json({ 
        error: 'Vote limit reached',
        currentVotes: voteLimitInfo.currentVotes,
        voteLimit: voteLimitInfo.voteLimit,
        plan: voteLimitInfo.plan
      }, { status: 403 });
    }

    const success = await addVote(pollId, optionId, voterFingerprint);
    
    if (!success) {
      return NextResponse.json(
        { error: 'You have already voted in this poll' }, 
        { status: 409 }
      );
    }

    // Pobierz zaktualizowane dane głosowania
    const updatedPoll = await getPoll(pollId);
    
    return NextResponse.json({ 
      success: true, 
      poll: updatedPoll 
    });
  } catch (error) {
    console.error('Error adding vote:', error);
    return NextResponse.json({ error: 'Failed to add vote' }, { status: 500 });
  }
} 