'use client';

import Link from 'next/link';
import { ArrowLeft, Settings, Check, Star } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function PricingPage() {
  const { t, language } = useLanguage();

  const plans = [
    {
      ...t.pricing.free,
      highlight: false,
      href: '/auth/register',
      popular: undefined
    },
    {
      ...t.pricing.pro,
      highlight: false,
      href: '/auth/register',
      popular: undefined
    },
    {
      ...t.pricing.enterprise,
      highlight: true,
      href: 'mailto:contact@example.com',
      popular: t.pricing.enterprise.popular
    }
  ];

  return (
    <div className="min-h-screen relative">
      {/* Navigation */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
        <Link 
          href="/" 
          className="flex items-center gap-2 p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-200 group"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700 group-hover:text-gray-900 group-hover:-translate-x-1 transition-all duration-200" />
          <span className="text-gray-700 group-hover:text-gray-900 font-medium">{t.common.backToHome}</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link 
            href="/how-it-works" 
            className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-200 group"
          >
            <span className="text-gray-700 group-hover:text-gray-900 font-medium">{t.common.howItWorks}</span>
          </Link>
          <LanguageSwitcher />
          <Link 
            href="/auth/login" 
            className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-200 group"
            title={t.auth.adminPanel}
          >
            <Settings className="w-6 h-6 text-gray-700 group-hover:text-gray-900 group-hover:rotate-90 transition-all duration-200" />
          </Link>
        </div>
      </div>

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
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div key={index} className={`relative ${plan.highlight ? 'transform scale-105' : ''}`}>
              {/* Popular Badge */}
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    {plan.popular}
                  </div>
                </div>
              )}

              {/* Card */}
              <div className={`glass-effect rounded-2xl p-8 h-full flex flex-col transition-all duration-300 hover:shadow-xl ${
                plan.highlight 
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
                  <Link
                    href={plan.href}
                    className={`w-full inline-flex items-center justify-center px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                      plan.highlight
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                        : 'bg-white/50 text-gray-700 border border-gray-300 hover:bg-white/70 hover:text-gray-900'
                    }`}
                  >
                    {plan.button}
                  </Link>
                </div>
              </div>
            </div>
          ))}
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
    </div>
  );
} 