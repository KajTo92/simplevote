import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';
import { Poll, PollOption, Vote, CreatePollRequest } from '@/types';
import { v4 as uuidv4 } from 'uuid';

let db: Database | null = null;

const colors = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
  '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
];

export async function getDatabase(): Promise<Database> {
  if (!db) {
    db = await open({
      filename: './voting.db',
      driver: sqlite3.Database
    });

    // Tworzenie tabel
    await db.exec(`
      CREATE TABLE IF NOT EXISTS polls (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS poll_options (
        id TEXT PRIMARY KEY,
        poll_id TEXT NOT NULL,
        text TEXT NOT NULL,
        color TEXT NOT NULL,
        order_index INTEGER NOT NULL,
        FOREIGN KEY (poll_id) REFERENCES polls (id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS votes (
        id TEXT PRIMARY KEY,
        poll_id TEXT NOT NULL,
        option_id TEXT NOT NULL,
        voter_fingerprint TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (poll_id) REFERENCES polls (id) ON DELETE CASCADE,
        FOREIGN KEY (option_id) REFERENCES poll_options (id) ON DELETE CASCADE,
        UNIQUE(poll_id, voter_fingerprint)
      );
    `);
  }
  return db;
}

export async function createPoll(data: CreatePollRequest): Promise<Poll> {
  const database = await getDatabase();
  const pollId = uuidv4();
  
  await database.run('INSERT INTO polls (id, title) VALUES (?, ?)', [pollId, data.title]);
  
  const options: PollOption[] = [];
  for (let i = 0; i < data.options.length; i++) {
    const optionId = uuidv4();
    const color = colors[i % colors.length];
    
    await database.run(
      'INSERT INTO poll_options (id, poll_id, text, color, order_index) VALUES (?, ?, ?, ?, ?)',
      [optionId, pollId, data.options[i], color, i]
    );
    
    options.push({
      id: optionId,
      text: data.options[i],
      votes: 0,
      color
    });
  }
  
  return {
    id: pollId,
    title: data.title,
    options,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

export async function getPoll(id: string): Promise<Poll | null> {
  const database = await getDatabase();
  
  const poll = await database.get('SELECT * FROM polls WHERE id = ?', [id]);
  if (!poll) return null;
  
  const options = await database.all(`
    SELECT po.*, COUNT(v.id) as votes 
    FROM poll_options po 
    LEFT JOIN votes v ON po.id = v.option_id 
    WHERE po.poll_id = ? 
    GROUP BY po.id 
    ORDER BY po.order_index
  `, [id]);
  
  return {
    id: poll.id,
    title: poll.title,
    options: options.map(opt => ({
      id: opt.id,
      text: opt.text,
      votes: opt.votes || 0,
      color: opt.color
    })),
    isActive: poll.is_active === 1,
    createdAt: new Date(poll.created_at),
    updatedAt: new Date(poll.updated_at)
  };
}

export async function addVote(pollId: string, optionId: string, voterFingerprint: string): Promise<boolean> {
  const database = await getDatabase();
  
  try {
    await database.run(
      'INSERT INTO votes (id, poll_id, option_id, voter_fingerprint) VALUES (?, ?, ?, ?)',
      [uuidv4(), pollId, optionId, voterFingerprint]
    );
    return true;
  } catch (error) {
    // Użytkownik już głosował
    return false;
  }
}

export async function getAllPolls(): Promise<Poll[]> {
  const database = await getDatabase();
  
  const polls = await database.all('SELECT * FROM polls ORDER BY created_at DESC');
  
  const result: Poll[] = [];
  for (const poll of polls) {
    const options = await database.all(`
      SELECT po.*, COUNT(v.id) as votes 
      FROM poll_options po 
      LEFT JOIN votes v ON po.id = v.option_id 
      WHERE po.poll_id = ? 
      GROUP BY po.id 
      ORDER BY po.order_index
    `, [poll.id]);
    
    result.push({
      id: poll.id,
      title: poll.title,
      options: options.map(opt => ({
        id: opt.id,
        text: opt.text,
        votes: opt.votes || 0,
        color: opt.color
      })),
      isActive: poll.is_active === 1,
      createdAt: new Date(poll.created_at),
      updatedAt: new Date(poll.updated_at)
    });
  }
  
  return result;
}

export async function deletePoll(id: string): Promise<boolean> {
  const database = await getDatabase();
  
  try {
    // Dzięki FOREIGN KEY ON DELETE CASCADE, głosy i opcje zostaną automatycznie usunięte
    const result = await database.run('DELETE FROM polls WHERE id = ?', [id]);
    return result.changes! > 0;
  } catch (error) {
    console.error('Error deleting poll:', error);
    return false;
  }
}

export async function togglePollStatus(id: string): Promise<boolean> {
  const database = await getDatabase();
  
  try {
    const result = await database.run(
      'UPDATE polls SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END, updated_at = CURRENT_TIMESTAMP WHERE id = ?', 
      [id]
    );
    return result.changes! > 0;
  } catch (error) {
    console.error('Error toggling poll status:', error);
    return false;
  }
} 