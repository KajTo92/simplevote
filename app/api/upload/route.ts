import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('logo') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    // Sprawdź typ pliku
    if (!file.type.startsWith('image/png')) {
      return NextResponse.json({ error: 'Only PNG files are allowed' }, { status: 400 });
    }
    
    // Sprawdź rozmiar pliku (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 2MB' }, { status: 400 });
    }
    
    // Tymczasowe rozwiązanie - Netlify nie obsługuje fs/promises
    // TODO: Zaimplementować Supabase Storage
    return NextResponse.json({ 
      success: false, 
      error: 'Upload temporarily disabled on Netlify. Please use Supabase Storage.'
    }, { status: 501 });
    
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
} 