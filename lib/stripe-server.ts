import Stripe from 'stripe';

// Server-side Stripe instance
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-06-30.basil',
    })
  : null;

// Re-export STRIPE_PRICES for server-side use
export const STRIPE_PRICES = {
  pro: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!,
  enterprise: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID!,
}; 
