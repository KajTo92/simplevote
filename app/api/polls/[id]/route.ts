import { NextRequest, NextResponse } from 'next/server';
import { getPoll, deletePoll, togglePollStatus } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const poll = await getPoll(params.id);
    
    if (!poll) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    }

    return NextResponse.json(poll);
  } catch (error) {
    console.error('Error fetching poll:', error);
    return NextResponse.json({ error: 'Failed to fetch poll' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await deletePoll(params.id);
    
    if (!success) {
      return NextResponse.json({ error: 'Poll not found or could not be deleted' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Poll deleted successfully' });
  } catch (error) {
    console.error('Error deleting poll:', error);
    return NextResponse.json({ error: 'Failed to delete poll' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { action } = body;
    
    if (action === 'toggle-status') {
      const success = await togglePollStatus(params.id);
      
      if (!success) {
        return NextResponse.json({ error: 'Poll not found or could not be updated' }, { status: 404 });
      }

      const updatedPoll = await getPoll(params.id);
      return NextResponse.json({ success: true, poll: updatedPoll });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error updating poll:', error);
    return NextResponse.json({ error: 'Failed to update poll' }, { status: 500 });
  }
} 