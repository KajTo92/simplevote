import { createClient } from '@/lib/supabase/server'
import { Poll, PollOption, CreatePollRequest } from '@/types'
import { v4 as uuidv4 } from 'uuid'

const colors = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
  '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
]

// Inicjalizacja tabel w Supabase (wywoływane raz)
export async function initializeTables() {
  const supabase = createClient()
  
  // Sprawdź czy tabele już istnieją
  const { data: tables, error } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public')
    .in('table_name', ['polls', 'poll_options', 'votes'])
  
  if (error || !tables || tables.length < 3) {
    throw new Error('Tabele głosowań nie istnieją w Supabase. Sprawdź instrukcje w SUPABASE_DATABASE_SETUP.md')
  }
}

export async function createPoll(data: CreatePollRequest): Promise<Poll> {
  const supabase = createClient()
  const pollId = uuidv4()
  
  // Utwórz główne głosowanie
  const { error: pollError } = await supabase
    .from('polls')
    .insert({
      id: pollId,
      title: data.title,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
  
  if (pollError) throw pollError
  
  // Utwórz opcje
  const optionsToInsert = data.options.map((option, index) => ({
    id: uuidv4(),
    poll_id: pollId,
    text: option,
    color: colors[index % colors.length],
    order_index: index
  }))
  
  const { error: optionsError } = await supabase
    .from('poll_options')
    .insert(optionsToInsert)
  
  if (optionsError) throw optionsError
  
  return {
    id: pollId,
    title: data.title,
    options: optionsToInsert.map(opt => ({
      id: opt.id,
      text: opt.text,
      votes: 0,
      color: opt.color
    })),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

export async function getPoll(id: string): Promise<Poll | null> {
  const supabase = createClient()
  
  // Pobierz głosowanie
  const { data: poll, error: pollError } = await supabase
    .from('polls')
    .select('*')
    .eq('id', id)
    .single()
  
  if (pollError || !poll) return null
  
  // Pobierz opcje z liczbą głosów
  const { data: options, error: optionsError } = await supabase
    .from('poll_options')
    .select(`
      id,
      text,
      color,
      order_index
    `)
    .eq('poll_id', id)
    .order('order_index')
  
  if (optionsError) throw optionsError
  
  // Pobierz liczbę głosów dla każdej opcji
  const optionsWithVotes = []
  for (const option of options || []) {
    const { count } = await supabase
      .from('votes')
      .select('id', { count: 'exact' })
      .eq('option_id', option.id)
    
    optionsWithVotes.push({
      ...option,
      votes: count || 0
    })
  }
  
  return {
    id: poll.id,
    title: poll.title,
    options: optionsWithVotes.map(opt => ({
      id: opt.id,
      text: opt.text,
      votes: opt.votes,
      color: opt.color
    })),
    isActive: poll.is_active,
    createdAt: new Date(poll.created_at),
    updatedAt: new Date(poll.updated_at)
  }
}

export async function getAllPolls(): Promise<Poll[]> {
  const supabase = createClient()
  
  // Pobierz wszystkie głosowania
  const { data: polls, error: pollsError } = await supabase
    .from('polls')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (pollsError) throw pollsError
  
  const result: Poll[] = []
  
  for (const poll of polls || []) {
    // Pobierz opcje dla każdego głosowania
    const { data: options, error: optionsError } = await supabase
      .from('poll_options')
      .select('id, text, color, order_index')
      .eq('poll_id', poll.id)
      .order('order_index')
    
    if (optionsError) continue // Pomiń głosowania z błędami
    
    // Pobierz liczbę głosów dla każdej opcji
    const optionsWithVotes = []
    for (const option of options || []) {
      const { count } = await supabase
        .from('votes')
        .select('id', { count: 'exact' })
        .eq('option_id', option.id)
      
      optionsWithVotes.push({
        ...option,
        votes: count || 0
      })
    }
    
    result.push({
      id: poll.id,
      title: poll.title,
      options: optionsWithVotes.map(opt => ({
        id: opt.id,
        text: opt.text,
        votes: opt.votes,
        color: opt.color
      })),
      isActive: poll.is_active,
      createdAt: new Date(poll.created_at),
      updatedAt: new Date(poll.updated_at)
    })
  }
  
  return result
}

export async function addVote(pollId: string, optionId: string, voterFingerprint: string): Promise<boolean> {
  const supabase = createClient()
  
  try {
    const { error } = await supabase
      .from('votes')
      .insert({
        id: uuidv4(),
        poll_id: pollId,
        option_id: optionId,
        voter_fingerprint: voterFingerprint,
        created_at: new Date().toISOString()
      })
    
    return !error
  } catch (error) {
    // Użytkownik już głosował (constraint violation)
    return false
  }
}

export async function deletePoll(id: string): Promise<boolean> {
  const supabase = createClient()
  
  // Cascading delete powinno usunąć opcje i głosy automatycznie
  const { error } = await supabase
    .from('polls')
    .delete()
    .eq('id', id)
  
  return !error
}

export async function togglePollStatus(id: string): Promise<boolean> {
  const supabase = createClient()
  
  // Najpierw pobierz aktualny status
  const { data: poll, error: fetchError } = await supabase
    .from('polls')
    .select('is_active')
    .eq('id', id)
    .single()
  
  if (fetchError || !poll) return false
  
  // Zmień status na przeciwny
  const { error } = await supabase
    .from('polls')
    .update({ 
      is_active: !poll.is_active,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
  
  return !error
} 