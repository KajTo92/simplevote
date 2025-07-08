import { createClient } from '@/lib/supabase/server'
import { Poll, PollOption, CreatePollRequest, DisplaySettings, CompanySettings } from '@/types'
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
  
  // Parsuj ustawienia wyświetlania
  let displaySettings: DisplaySettings | undefined
  if (poll.display_settings) {
    try {
      displaySettings = JSON.parse(poll.display_settings)
    } catch (e) {
      displaySettings = undefined
    }
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
    updatedAt: new Date(poll.updated_at),
    displaySettings: displaySettings || {
      chartType: 'vertical',
      showPercentages: true,
      showVoteCounts: true,
      hideBars: true
    }
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
    
    // Parsuj ustawienia wyświetlania
    let displaySettings: DisplaySettings | undefined
    if (poll.display_settings) {
      try {
        displaySettings = JSON.parse(poll.display_settings)
      } catch (e) {
        displaySettings = undefined
      }
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
      updatedAt: new Date(poll.updated_at),
      displaySettings: displaySettings || {
        chartType: 'vertical',
        showPercentages: true,
        showVoteCounts: true,
        hideBars: true
      }
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

export async function updateDisplaySettings(id: string, settings: DisplaySettings): Promise<boolean> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('polls')
    .update({ 
      display_settings: JSON.stringify(settings),
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
  
  return !error
}

export async function adjustVoteCount(optionId: string, adjustment: number): Promise<boolean> {
  const supabase = createClient()
  
  try {
    if (adjustment > 0) {
      // Dodaj głosy
      const votesToAdd = []
      for (let i = 0; i < adjustment; i++) {
        votesToAdd.push({
          id: uuidv4(),
          poll_id: '', // Będzie wypełnione przez trigger lub możemy pobrać z poll_options
          option_id: optionId,
          voter_fingerprint: `admin_manual_${Date.now()}_${i}`,
          created_at: new Date().toISOString()
        })
      }
      
      // Pobierz poll_id z option
      const { data: option, error: optionError } = await supabase
        .from('poll_options')
        .select('poll_id')
        .eq('id', optionId)
        .single()
      
      if (optionError || !option) return false
      
      // Uzupełnij poll_id
      votesToAdd.forEach(vote => vote.poll_id = option.poll_id)
      
      const { error } = await supabase
        .from('votes')
        .insert(votesToAdd)
      
      return !error
    } else if (adjustment < 0) {
      // Usuń głosy
      const { data: votes, error: fetchError } = await supabase
        .from('votes')
        .select('id')
        .eq('option_id', optionId)
        .limit(Math.abs(adjustment))
      
      if (fetchError || !votes || votes.length === 0) return false
      
      const voteIds = votes.map(vote => vote.id)
      const { error } = await supabase
        .from('votes')
        .delete()
        .in('id', voteIds)
      
      return !error
    }
    
    return true // adjustment === 0
  } catch (error) {
    console.error('Error adjusting vote count:', error)
    return false
  }
}

// ============ COMPANY SETTINGS ============

export async function getCompanySettings(): Promise<CompanySettings | null> {
  const supabase = createClient()
  
  try {
    const { data: settings, error } = await supabase
      .from('company_settings')
      .select('*')
      .limit(1)
      .single()
    
    if (error) {
      // Jeśli tabela jest pusta, utwórz domyślny rekord
      if (error.code === 'PGRST116') {
        const { data: newSettings, error: insertError } = await supabase
          .from('company_settings')
          .insert({
            company_name: 'My Company',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single()
        
        if (insertError || !newSettings) return null
        
        return {
          id: newSettings.id,
          companyName: newSettings.company_name || undefined,
          companyLogoUrl: newSettings.company_logo_url || undefined,
          createdAt: new Date(newSettings.created_at),
          updatedAt: new Date(newSettings.updated_at)
        }
      }
      
      console.error('Error fetching company settings:', error)
      return null
    }
    
    return {
      id: settings.id,
      companyName: settings.company_name || undefined,
      companyLogoUrl: settings.company_logo_url || undefined,
      createdAt: new Date(settings.created_at),
      updatedAt: new Date(settings.updated_at)
    }
  } catch (error) {
    console.error('Error in getCompanySettings:', error)
    return null
  }
}

export async function updateCompanyLogo(logoUrl: string | null): Promise<boolean> {
  const supabase = createClient()
  
  try {
    // Sprawdź czy rekord istnieje
    const { data: existing, error: fetchError } = await supabase
      .from('company_settings')
      .select('id')
      .limit(1)
      .single()
    
    if (fetchError || !existing) {
      // Utwórz nowy rekord jeśli nie istnieje
      const { error: insertError } = await supabase
        .from('company_settings')
        .insert({
          company_name: 'My Company',
          company_logo_url: logoUrl,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      
      return !insertError
    }
    
    // Aktualizuj istniejący rekord
    const { error } = await supabase
      .from('company_settings')
      .update({ 
        company_logo_url: logoUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', existing.id)
    
    return !error
  } catch (error) {
    console.error('Error updating company logo:', error)
    return false
  }
}

export async function updateCompanyName(companyName: string): Promise<boolean> {
  const supabase = createClient()
  
  try {
    // Sprawdź czy rekord istnieje
    const { data: existing, error: fetchError } = await supabase
      .from('company_settings')
      .select('id')
      .limit(1)
      .single()
    
    if (fetchError || !existing) {
      // Utwórz nowy rekord jeśli nie istnieje
      const { error: insertError } = await supabase
        .from('company_settings')
        .insert({
          company_name: companyName,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      
      return !insertError
    }
    
    // Aktualizuj istniejący rekord
    const { error } = await supabase
      .from('company_settings')
      .update({ 
        company_name: companyName,
        updated_at: new Date().toISOString()
      })
      .eq('id', existing.id)
    
    return !error
  } catch (error) {
    console.error('Error updating company name:', error)
    return false
  }
} 