# Stripe Integration Setup

## 1. Create Stripe Account
1. Go to https://stripe.com and create an account
2. Complete account verification
3. Go to Dashboard → Developers → API Keys

## 2. Get API Keys
Copy these keys to your `.env.local` file:

```env
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 3. Create Products and Prices in Stripe Dashboard

### Pro Plan ($19/month)
1. Go to Products → Add Product
2. Name: "TeamVote Pro"
3. Description: "For growing teams and companies"
4. Pricing: $19 USD monthly recurring
5. Copy the Price ID to environment variable: `STRIPE_PRO_PRICE_ID`

### Enterprise Plan ($49/month)
1. Go to Products → Add Product
2. Name: "TeamVote Enterprise"
3. Description: "For large organizations and events"
4. Pricing: $49 USD monthly recurring
5. Copy the Price ID to environment variable: `STRIPE_ENTERPRISE_PRICE_ID`

## 4. Create Subscriptions Table in Supabase

Run this SQL in Supabase SQL Editor:

```sql
-- Create subscriptions table
CREATE TABLE subscriptions (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own subscriptions"
ON subscriptions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage subscriptions"
ON subscriptions FOR ALL
TO service_role
USING (true);

-- Create indexes
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
```

## 5. Setup Webhook in Stripe

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://your-domain.com/api/stripe/webhook`
4. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the webhook secret to `STRIPE_WEBHOOK_SECRET`

## 6. Environment Variables Summary

Add these to your `.env.local` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 7. Testing

1. Start the development server: `npm run dev`
2. Go to `/pricing` page
3. Click on Pro or Enterprise plan
4. Use Stripe test card: `4242 4242 4242 4242`
5. Check webhook events in Stripe dashboard

## 8. Production Deployment

1. Replace test keys with live keys
2. Update `NEXT_PUBLIC_APP_URL` to production URL
3. Update webhook endpoint URL to production
4. Test payment flow thoroughly

## Notes

- Free plan doesn't require Stripe integration
- Webhooks handle subscription status updates
- Users must be authenticated to make purchases
- Failed payments are handled by Stripe's built-in retry logic 