import { loadStripe } from '@stripe/stripe-js';

// Client-side Stripe instance
export const getStripe = () => {
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
};

// Stripe price IDs for each plan
export const STRIPE_PRICES = {
  pro: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!,
  enterprise: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID!,
};

// Plan details
export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    priceId: null,
    maxUsers: 5,
    features: [
      'Up to 5 voting users',
      'Unlimited polls',
      'Basic chart types',
      'Real-time results',
      'QR code joining'
    ]
  },
  pro: {
    name: 'Pro',
    price: 19,
    priceId: STRIPE_PRICES.pro,
    maxUsers: 50,
    features: [
      'Up to 50 voting users',
      'Unlimited polls',
      'All chart types',
      'Real-time results',
      'QR code joining',
      'Advanced display options',
      'Email support'
    ]
  },
  enterprise: {
    name: 'Enterprise',
    price: 49,
    priceId: STRIPE_PRICES.enterprise,
    maxUsers: -1, // unlimited
    features: [
      'Unlimited users',
      'Unlimited polls',
      'All chart types',
      'Real-time results',
      'QR code joining',
      'Advanced display options',
      'Priority support',
      'Custom company logo'
    ]
  }
};

export type PlanType = keyof typeof PLANS; 