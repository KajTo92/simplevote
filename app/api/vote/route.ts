import { NextRequest, NextResponse } from 'next/server';
import { addVote, getPoll } from '@/lib/database';

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