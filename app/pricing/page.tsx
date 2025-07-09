'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Check, Star, X, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import StripeCheckout from '@/components/StripeCheckout';
import { STRIPE_PRICES } from '@/lib/stripe';
import { useAuth } from '@/components/AuthProvider';

interface Subscription {
  id: string;
  plan: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function PricingPage() {
  const { t, language } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelingSubscription, setCancelingSubscription] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        fetchSubscription();
      } else {
        setLoading(false);
      }
    }
  }, [user, authLoading]);

  const fetchSubscription = async () => {
    try {
      const response = await fetch('/api/subscription');
      if (response.ok) {
        const data = await response.json();
        setSubscription(data.subscription);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setCancelingSubscription(true);
    try {
      const response = await fetch('/api/subscription', {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setSubscription(null);
        setShowCancelConfirm(false);
        // Opcjonalnie: pokazać powiadomienie o sukcesie
      } else {
        const error = await response.json();
        console.error('Error canceling subscription:', error);
        // Opcjonalnie: pokazać błąd użytkownikowi
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
    } finally {
      setCancelingSubscription(false);
    }
  };

  const isCurrentPlan = (planType: string) => {
    if (!user || !subscription) return false;
    return subscription.plan === planType;
  };

  const getButtonText = (plan: any) => {
    if (!user) {
      return plan.button;
    }
    
    if (isCurrentPlan(plan.planType)) {
      return language === 'pl' ? 'Aktualny Plan' : 'Current Plan';
    }
    
    return plan.button;
  };

  const plans = [
    {
      ...t.pricing.free,
      highlight: false,
      href: '/auth/register',
      popular: undefined,
      priceId: null,
      planType: 'free'
    },
    {
      ...t.pricing.pro,
      highlight: false,
      href: '/auth/register',
      popular: undefined,
      priceId: STRIPE_PRICES.pro,
      planType: 'pro'
    },
    {
      ...t.pricing.enterprise,
      highlight: true,
      href: 'mailto:contact@example.com',
      popular: t.pricing.enterprise.popular,
      priceId: STRIPE_PRICES.enterprise,
      planType: 'enterprise'
    }
  ];

  return (
    <div className="min-h-screen relative">


      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {t.pricing.title.split(' ')[0]}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {' '}{t.pricing.title.split(' ').slice(1).join(' ')}
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t.pricing.subtitle}
          </p>
          
          {/* Current Plan Info */}
          {user && subscription && (
            <div className="mt-8 max-w-md mx-auto">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2 text-green-800">
                  <Check className="w-5 h-5" />
                  <span className="font-semibold">
                    {language === 'pl' ? 'Aktualny plan:' : 'Current plan:'} {' '}
                    <span className="capitalize">{subscription.plan}</span>
                  </span>
                </div>
                <div className="mt-3">
                  <button
                    onClick={() => setShowCancelConfirm(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    {language === 'pl' ? 'Anuluj subskrypcję' : 'Cancel subscription'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const isActive = isCurrentPlan(plan.planType);
            const isHighlighted = plan.highlight && !isActive;
            
            return (
              <div key={index} className={`relative ${isHighlighted ? 'transform scale-105' : ''}`}>
                {/* Popular Badge */}
                {isHighlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      {plan.popular}
                    </div>
                  </div>
                )}

                {/* Current Plan Badge */}
                {isActive && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      {language === 'pl' ? 'Aktualny plan' : 'Current plan'}
                    </div>
                  </div>
                )}

                {/* Card */}
                <div className={`glass-effect rounded-2xl p-8 h-full flex flex-col transition-all duration-300 hover:shadow-xl ${
                  isActive
                    ? 'border-2 border-green-500/50 shadow-lg bg-green-50/30'
                    : isHighlighted
                    ? 'border-2 border-blue-500/30 shadow-lg' 
                    : 'border border-gray-200/30 hover:border-blue-500/20'
                }`}>
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="mb-3">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      {plan.price !== 'Darmowa' && plan.price !== 'Free' && (
                        <span className="text-gray-500 ml-2">/{t.pricing.monthly}</span>
                      )}
                    </div>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>

                  {/* Features */}
                  <div className="flex-grow mb-8">
                    <ul className="space-y-4">
                      {(Array.isArray(plan.features) ? plan.features : []).map((feature: string, featureIndex: number) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <div>
                    {isActive ? (
                      <button
                        disabled
                        className="w-full inline-flex items-center justify-center px-6 py-3 rounded-full font-semibold bg-green-600 text-white opacity-75 cursor-not-allowed"
                      >
                        {getButtonText(plan)}
                      </button>
                    ) : plan.priceId ? (
                      user ? (
                        <StripeCheckout
                          priceId={plan.priceId}
                          plan={plan.planType}
                          className={`w-full inline-flex items-center justify-center px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                            isHighlighted
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                              : 'bg-white/50 text-gray-700 border border-gray-300 hover:bg-white/70 hover:text-gray-900'
                          }`}
                        >
                          {getButtonText(plan)}
                        </StripeCheckout>
                      ) : (
                        <Link
                          href="/auth/login"
                          className={`w-full inline-flex items-center justify-center px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                            isHighlighted
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                              : 'bg-white/50 text-gray-700 border border-gray-300 hover:bg-white/70 hover:text-gray-900'
                          }`}
                        >
                          {language === 'pl' ? 'Zaloguj się' : 'Sign in'}
                        </Link>
                      )
                    ) : (
                      <Link
                        href={plan.href}
                        className={`w-full inline-flex items-center justify-center px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                          isHighlighted
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                            : 'bg-white/50 text-gray-700 border border-gray-300 hover:bg-white/70 hover:text-gray-900'
                        }`}
                      >
                        {getButtonText(plan)}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ or Additional Info */}
        <div className="mt-20 text-center">
          <div className="glass-effect rounded-2xl p-8 max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {language === 'pl' ? 'Masz pytania?' : 'Have questions?'}
            </h3>
            <p className="text-gray-600 mb-6">
              {language === 'pl' 
                ? 'Skontaktuj się z nami, aby dowiedzieć się więcej o naszych planach i funkcjach.'
                : 'Contact us to learn more about our plans and features.'
              }
            </p>
            <Link
              href="mailto:contact@example.com"
              className="inline-flex items-center px-6 py-3 bg-white/50 text-gray-700 border border-gray-300 rounded-full font-medium hover:bg-white/70 hover:text-gray-900 transition-all duration-200"
            >
              {language === 'pl' ? 'Skontaktuj się z nami' : 'Contact Us'}
            </Link>
          </div>
        </div>
      </div>

      {/* Cancel Subscription Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {language === 'pl' ? 'Anuluj subskrypcję' : 'Cancel subscription'}
              </h3>
              <p className="text-gray-600 mb-6">
                {language === 'pl' 
                  ? 'Czy na pewno chcesz anulować swoją subskrypcję? Ta akcja jest nieodwracalna.'
                  : 'Are you sure you want to cancel your subscription? This action cannot be undone.'
                }
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {language === 'pl' ? 'Anuluj' : 'Cancel'}
                </button>
                <button
                  onClick={handleCancelSubscription}
                  disabled={cancelingSubscription}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {cancelingSubscription ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {language === 'pl' ? 'Anulowanie...' : 'Canceling...'}
                    </div>
                  ) : (
                    language === 'pl' ? 'Potwierdź anulowanie' : 'Confirm cancellation'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 