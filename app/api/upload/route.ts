import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('logo') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    // Sprawdź typ pliku
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }
    
    // Sprawdź rozmiar pliku (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 2MB' }, { status: 400 });
    }
    
    // Initialize Supabase client
    const supabase = createClient();
    
    // Debug: List buckets to see what's available
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    console.log('Available buckets:', buckets);
    console.log('List buckets error:', listError);
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      // Don't fail here - proceed with upload attempt
      console.log('Proceeding with upload despite bucket listing error...');
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === 'company-logos');
    console.log('Bucket company-logos exists:', bucketExists);
    
    // Skip bucket existence check since user confirmed it exists
    console.log('Proceeding with upload to company-logos bucket...');
    
    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `logo_${uuidv4()}.${fileExtension}`;
    
    // Convert file to buffer
    const fileBuffer = await file.arrayBuffer();
    
    // Upload to Supabase Storage
    console.log('Attempting upload with filename:', fileName);
    const { data, error } = await supabase.storage
      .from('company-logos')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });
    
    console.log('Upload result:', { data, error });
    
    if (error) {
      console.error('Supabase upload error:', error);
      return NextResponse.json({ 
        error: `Failed to upload file to storage: ${error.message}`,
        details: error 
      }, { status: 500 });
    }
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('company-logos')
      .getPublicUrl(fileName);
    
    return NextResponse.json({
      success: true,
      filename: fileName,
      url: publicUrlData.publicUrl
    });
    
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
} 