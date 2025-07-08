import { NextRequest, NextResponse } from 'next/server';
import { getCompanySettings, updateCompanyLogo, updateCompanyName } from '@/lib/supabase-database';

export async function GET() {
  try {
    const settings = await getCompanySettings();
    
    if (!settings) {
      return NextResponse.json({ 
        id: '',
        companyName: undefined,
        companyLogoUrl: undefined,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching company settings:', error);
    return NextResponse.json({ error: 'Failed to fetch company settings' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;
    
    console.log('Company settings PATCH request:', { action, body });
    
    if (action === 'update-logo') {
      const { logoUrl } = body;
      
      console.log('Updating company logo:', logoUrl);
      const success = await updateCompanyLogo(logoUrl || null);
      
      if (!success) {
        console.error('Failed to update company logo in database');
        return NextResponse.json({ error: 'Failed to update company logo' }, { status: 500 });
      }

      const updatedSettings = await getCompanySettings();
      console.log('Logo updated successfully, new settings:', updatedSettings);
      return NextResponse.json({ success: true, settings: updatedSettings });
    }
    
    if (action === 'update-name') {
      const { companyName } = body;
      
      if (!companyName) {
        return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
      }
      
      console.log('Updating company name:', companyName);
      const success = await updateCompanyName(companyName);
      
      if (!success) {
        console.error('Failed to update company name in database');
        return NextResponse.json({ error: 'Failed to update company name' }, { status: 500 });
      }

      const updatedSettings = await getCompanySettings();
      console.log('Company name updated successfully, new settings:', updatedSettings);
      return NextResponse.json({ success: true, settings: updatedSettings });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error updating company settings:', error);
    return NextResponse.json({ error: 'Failed to update company settings' }, { status: 500 });
  }
} 