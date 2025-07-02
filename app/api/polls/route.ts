import { NextRequest, NextResponse } from 'next/server';
import { createPoll, getAllPolls } from '@/lib/supabase-database';
import { CreatePollRequest } from '@/types';

export async function GET() {
  try {
    const polls = await getAllPolls();
    return NextResponse.json(polls);
  } catch (error) {
    console.error('Error fetching polls:', error);
    return NextResponse.json({ error: 'Failed to fetch polls' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreatePollRequest = await request.json();
    
    if (!body.title || !body.options || body.options.length < 2) {
      return NextResponse.json(
        { error: 'Title and at least 2 options are required' }, 
        { status: 400 }
      );
    }

    const poll = await createPoll(body);
    return NextResponse.json(poll, { status: 201 });
  } catch (error) {
    console.error('Error creating poll:', error);
    return NextResponse.json({ error: 'Failed to create poll' }, { status: 500 });
  }
} 