'use client';

import { useState } from 'react';
import { getStripe } from '@/lib/stripe';
import { useAuth } from '@/components/AuthProvider';
import { Loader2 } from 'lucide-react';

interface StripeCheckoutProps {
  priceId: string;
  plan: string;
  children: React.ReactNode;
  className?: string;
}

export default function StripeCheckout({ 
  priceId, 
  plan, 
  children, 
  className = '' 
}: StripeCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleCheckout = async () => {
    if (!user) {
      // Redirect to login
      window.location.href = '/auth/login';
      return;
    }

    try {
      setLoading(true);
      
      // Create checkout session
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          plan,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      
      // Redirect to Stripe Checkout
      const stripe = await getStripe();
      if (!stripe) throw new Error('Stripe not loaded');

      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        console.error('Stripe checkout error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout process. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className={`${className} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
} 