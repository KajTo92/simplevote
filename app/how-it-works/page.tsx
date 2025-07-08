'use client';

import Link from 'next/link';
import { ArrowLeft, Settings, QrCode, BarChart3, Eye, CheckCircle, Smartphone, Monitor, Palette, Zap, Globe, Shield } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function HowItWorksPage() {
  const { t } = useLanguage();

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
      <div className="max-w-6xl mx-auto px-6 py-24">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {t.howItWorks.title.split(' ')[0]}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {' '}{t.howItWorks.title.split(' ').slice(1).join(' ')}
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t.howItWorks.subtitle}
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-24 mb-24">
          {/* Step 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full text-xl font-bold mb-6">
                1
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.howItWorks.step1.title}</h2>
              <p className="text-lg text-gray-600 mb-4">{t.howItWorks.step1.description}</p>
              <p className="text-gray-500">{t.howItWorks.step1.details}</p>
            </div>
            <div className="order-1 lg:order-2">
              <div className="glass-effect rounded-2xl p-8 transform hover:scale-105 transition-all duration-300">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <Settings className="w-6 h-6" />
                    <span className="font-semibold">Panel Administratora</span>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 mb-4">
                    <div className="text-sm mb-2">Tytuł głosowania</div>
                    <div className="bg-white/30 rounded px-3 py-2 text-sm">Która opcja jest najlepsza?</div>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-white/20 rounded px-3 py-2 text-sm">Opcja A</div>
                    <div className="bg-white/20 rounded px-3 py-2 text-sm">Opcja B</div>
                    <div className="bg-white/20 rounded px-3 py-2 text-sm">Opcja C</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="glass-effect rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-300">
                <div className="bg-gray-900 rounded-xl p-6 inline-block mb-4">
                  <QrCode className="w-24 h-24 text-white" />
                </div>
                <div className="text-gray-600 text-sm">Skanuj telefonem</div>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <Smartphone className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-gray-500">vote.example.com/v/abc123</span>
                </div>
              </div>
            </div>
            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500 text-white rounded-full text-xl font-bold mb-6">
                2
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.howItWorks.step2.title}</h2>
              <p className="text-lg text-gray-600 mb-4">{t.howItWorks.step2.description}</p>
              <p className="text-gray-500">{t.howItWorks.step2.details}</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500 text-white rounded-full text-xl font-bold mb-6">
                3
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.howItWorks.step3.title}</h2>
              <p className="text-lg text-gray-600 mb-4">{t.howItWorks.step3.description}</p>
              <p className="text-gray-500">{t.howItWorks.step3.details}</p>
            </div>
            <div className="order-1 lg:order-2">
              <div className="glass-effect rounded-2xl p-8 transform hover:scale-105 transition-all duration-300">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg border-2 border-blue-500">
                    <BarChart3 className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                    <div className="text-xs text-blue-700">Poziomy</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg border-2 border-gray-200">
                    <BarChart3 className="w-6 h-6 text-gray-400 mx-auto mb-2 rotate-90" />
                    <div className="text-xs text-gray-500">Pionowy</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg border-2 border-gray-200">
                    <div className="w-6 h-6 bg-gray-400 rounded-full mx-auto mb-2"></div>
                    <div className="text-xs text-gray-500">Kołowy</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Pokaż procenty</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Pokaż liczby głosów</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="glass-effect rounded-2xl p-8 transform hover:scale-105 transition-all duration-300">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 text-white">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="font-semibold">Na żywo</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>👑 Opcja A</span>
                        <span>45%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-3">
                        <div className="w-[45%] bg-white rounded-full h-3 shadow-lg"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Opcja B</span>
                        <span>35%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-3">
                        <div className="w-[35%] bg-white/70 rounded-full h-3"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Opcja C</span>
                        <span>20%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-3">
                        <div className="w-[20%] bg-white/50 rounded-full h-3"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-500 text-white rounded-full text-xl font-bold mb-6">
                4
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.howItWorks.step4.title}</h2>
              <p className="text-lg text-gray-600 mb-4">{t.howItWorks.step4.description}</p>
              <p className="text-gray-500">{t.howItWorks.step4.details}</p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">{t.howItWorks.features.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass-effect rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{t.howItWorks.features.realtime}</h3>
            </div>

            <div className="glass-effect rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{t.howItWorks.features.qrcode}</h3>
            </div>

            <div className="glass-effect rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Monitor className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{t.howItWorks.features.responsive}</h3>
            </div>

            <div className="glass-effect rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{t.howItWorks.features.charts}</h3>
            </div>

            <div className="glass-effect rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{t.howItWorks.features.multilang}</h3>
            </div>

            <div className="glass-effect rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{t.howItWorks.features.secure}</h3>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="glass-effect rounded-3xl p-12 transform hover:scale-105 transition-all duration-300">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.howItWorks.cta.title}</h2>
            <p className="text-lg text-gray-600 mb-8">{t.howItWorks.cta.description}</p>
            <Link 
              href="/auth/login"
              className="inline-flex items-center px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
            >
              <span className="mr-3">{t.howItWorks.cta.button}</span>
              <span className="text-xl group-hover:translate-x-1 transition-transform duration-300">🚀</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 