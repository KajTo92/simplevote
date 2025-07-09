import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe-server';

// GET - pobierz aktualną subskrypcję użytkownika
export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }
    
    // Pobierz aktywną subskrypcję użytkownika
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching subscription:', error);
      return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 });
    }
    
    return NextResponse.json({ 
      subscription: subscription || null,
      hasActiveSubscription: !!subscription
    });
    
  } catch (error) {
    console.error('Error in subscription GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - anuluj subskrypcję
export async function DELETE() {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }
    
    // Pobierz aktywną subskrypcję użytkownika
    const { data: subscription, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .limit(1)
      .maybeSingle();
    
    if (fetchError) {
      console.error('Error fetching subscription for cancellation:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 });
    }
    
    if (!subscription) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 });
    }
    
    // Anuluj subskrypcję w Stripe
    try {
      await stripe.subscriptions.cancel(subscription.id);
      
      // Zaktualizuj status w bazie danych
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({ 
          status: 'canceled',
          updated_at: new Date().toISOString()
        })
        .eq('id', subscription.id);
      
      if (updateError) {
        console.error('Error updating subscription status:', updateError);
        return NextResponse.json({ error: 'Failed to update subscription status' }, { status: 500 });
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Subscription canceled successfully' 
      });
      
    } catch (stripeError) {
      console.error('Error canceling subscription in Stripe:', stripeError);
      return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Error in subscription DELETE:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 