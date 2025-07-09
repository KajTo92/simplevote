'use client';

import Link from 'next/link';
import { Settings, QrCode, BarChart3, Eye, CheckCircle, Smartphone, Monitor, Palette, Zap, Globe, Shield, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="min-h-screen flex flex-col items-center justify-center relative">
        {/* Główny content */}
        <div className="text-center space-y-8 max-w-5xl mx-auto px-6">
          <div className="space-y-4 mt-8 md:mt-0">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-4 md:mb-8">
              {t.title.split(' ')[0]}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {' '}{t.title.split(' ').slice(1).join(' ')}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-lg mx-auto leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mt-8 md:mt-12">
            <div 
              onClick={() => {
                const howItWorksSection = document.querySelector('#how-it-works-section');
                howItWorksSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="glass-effect rounded-2xl p-3 md:p-8 text-center transform hover:scale-105 transition-all duration-300 md:aspect-square flex flex-col justify-center cursor-pointer"
            >
              <div className="w-16 md:w-20 h-16 md:h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-6 shadow-lg">
                <span className="text-white text-2xl md:text-3xl">📺</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-1 md:mb-2 text-lg md:text-xl">{t.features.live.title}</h3>
              <p className="text-gray-600 text-xs md:text-sm">{t.features.live.description}</p>
            </div>

            <div 
              onClick={() => {
                const howItWorksSection = document.querySelector('#how-it-works-section');
                howItWorksSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="glass-effect rounded-2xl p-3 md:p-8 text-center transform hover:scale-105 transition-all duration-300 md:aspect-square flex flex-col justify-center cursor-pointer"
            >
              <div className="w-16 md:w-20 h-16 md:h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-6 shadow-lg">
                <span className="text-white text-2xl md:text-3xl">📱</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-1 md:mb-2 text-lg md:text-xl">{t.features.qr.title}</h3>
              <p className="text-gray-600 text-xs md:text-sm">{t.features.qr.description}</p>
            </div>

            <div 
              onClick={() => {
                const howItWorksSection = document.querySelector('#how-it-works-section');
                howItWorksSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="glass-effect rounded-2xl p-3 md:p-8 text-center transform hover:scale-105 transition-all duration-300 md:aspect-square flex flex-col justify-center cursor-pointer"
            >
              <div className="w-16 md:w-20 h-16 md:h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-6 shadow-lg">
                <span className="text-white text-2xl md:text-3xl">📊</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-1 md:mb-2 text-lg md:text-xl">{t.features.clear.title}</h3>
              <p className="text-gray-600 text-xs md:text-sm">{t.features.clear.description}</p>
            </div>
          </div>

          {/* Call to Action Buttons */}
          <div className="mt-8 md:mt-16 space-y-4">
            <div>
              <Link 
                href="/auth/login"
                className="inline-flex items-center px-8 md:px-12 py-3 md:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-base md:text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
              >
                <span className="mr-2 md:mr-3">{t.common.createFirstPoll}</span>
                <span className="text-lg md:text-xl group-hover:translate-x-1 transition-transform duration-300">🚀</span>
              </Link>
            </div>
          </div>

          {/* How It Works Link */}
          <div className="mt-8 text-center">
            <button 
              onClick={() => {
                const howItWorksSection = document.querySelector('#how-it-works-section');
                howItWorksSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex flex-col items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-300 group cursor-pointer mx-auto"
              aria-label="Learn how it works"
            >
              <span className="text-base font-medium group-hover:text-gray-900 transition-colors duration-300">
                {t.common.scrollDown || 'How It Works?'}
              </span>
              <div className="animate-bounce">
                <ChevronDown className="w-7 h-7 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works-section" className="max-w-6xl mx-auto px-6 py-24">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            {t.howItWorks.title.split(' ')[0]}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {' '}{t.howItWorks.title.split(' ').slice(1).join(' ')}
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t.howItWorks.subtitle}
          </p>
        </div>

        {/* Video Section */}
        <div className="mb-24 text-center">
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              {t.howItWorks.videoSection.question}
            </h3>
            <p className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-semibold">
              {t.howItWorks.videoSection.solution}
            </p>
          </div>
          
          <div className="glass-effect rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-xl shadow-2xl">
              <video 
                autoPlay
                loop
                muted
                className="w-full h-auto"
                preload="metadata"
              >
                <source src="/media/Pokaz.mp4" type="video/mp4" />
                Twoja przeglądarka nie obsługuje odtwarzania wideo.
              </video>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-24 mb-24">
          {/* Step 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full text-xl font-bold mb-6">
                1
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">{t.howItWorks.step1.title}</h3>
              <p className="text-lg text-gray-600 mb-4">{t.howItWorks.step1.description}</p>
              <p className="text-gray-500">{t.howItWorks.step1.details}</p>
            </div>
            <div className="order-1 lg:order-2">
              <div className="glass-effect rounded-2xl p-8 transform hover:scale-105 transition-all duration-300">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <Settings className="w-6 h-6" />
                    <span className="font-semibold">{t.howItWorks.mockups.adminPanel}</span>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 mb-4">
                    <div className="text-sm mb-2">{t.howItWorks.mockups.pollTitle}</div>
                    <div className="bg-white/30 rounded px-3 py-2 text-sm">{t.howItWorks.mockups.exampleQuestion}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-white/20 rounded px-3 py-2 text-sm">{t.howItWorks.mockups.optionA}</div>
                    <div className="bg-white/20 rounded px-3 py-2 text-sm">{t.howItWorks.mockups.optionB}</div>
                    <div className="bg-white/20 rounded px-3 py-2 text-sm">{t.howItWorks.mockups.optionC}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="glass-effect rounded-2xl p-8 transform hover:scale-105 transition-all duration-300">
                <div className="relative">
                  {/* TV Screen */}
                  <div className="bg-gray-900 rounded-2xl p-8 mb-6 relative">
                    <div className="bg-gray-800 rounded-xl p-6 relative">
                      <div className="text-white text-center mb-4">
                        <h4 className="text-lg font-semibold mb-2">{t.howItWorks.mockups.exampleQuestion}</h4>
                        <div className="text-sm text-gray-300">{t.howItWorks.mockups.scanWithPhone}</div>
                      </div>
                      <div className="bg-white rounded-lg p-4 flex items-center justify-center">
                        <QrCode className="w-16 h-16 text-gray-900" />
                      </div>
                    </div>
                    {/* TV Stand */}
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-gray-800 rounded-b-lg"></div>
                  </div>
                  
                  {/* Phone scanning */}
                  <div className="absolute -bottom-4 -right-4 transform rotate-12">
                    <div className="bg-gray-800 rounded-2xl p-2 shadow-lg">
                      <div className="bg-blue-500 rounded-xl p-3 text-white text-center">
                        <div className="text-xs mb-1">📱 {t.howItWorks.mockups.scanning}</div>
                        <div className="w-8 h-8 border-2 border-white rounded mx-auto animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Connection lines */}
                  <div className="absolute top-1/2 right-8 transform -translate-y-1/2">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center mt-6">
                  <div className="text-gray-600 text-sm mb-2">{t.howItWorks.mockups.scanWithPhone}</div>
                  <div className="flex items-center justify-center gap-2">
                    <Monitor className="w-5 h-5 text-gray-500" />
                    <span className="text-xs text-gray-400">→</span>
                    <Smartphone className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-gray-500">vote.example.com/v/abc123</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500 text-white rounded-full text-xl font-bold mb-6">
                2
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">{t.howItWorks.step2.title}</h3>
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
              <h3 className="text-3xl font-bold text-gray-900 mb-4">{t.howItWorks.step3.title}</h3>
              <p className="text-lg text-gray-600 mb-4">{t.howItWorks.step3.description}</p>
              <p className="text-gray-500">{t.howItWorks.step3.details}</p>
            </div>
            <div className="order-1 lg:order-2">
              <div className="glass-effect rounded-2xl p-8 transform hover:scale-105 transition-all duration-300">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg border-2 border-blue-500">
                    <BarChart3 className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                    <div className="text-xs text-blue-700">{t.howItWorks.mockups.horizontal}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg border-2 border-gray-200">
                    <BarChart3 className="w-6 h-6 text-gray-400 mx-auto mb-2 rotate-90" />
                    <div className="text-xs text-gray-500">{t.howItWorks.mockups.vertical}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg border-2 border-gray-200">
                    <div className="w-6 h-6 bg-gray-400 rounded-full mx-auto mb-2"></div>
                    <div className="text-xs text-gray-500">{t.howItWorks.mockups.pie}</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{t.howItWorks.mockups.showPercentages}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{t.howItWorks.mockups.showVoteCounts}</span>
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
                    <span className="font-semibold">{t.howItWorks.mockups.live}</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>👑 {t.howItWorks.mockups.optionA}</span>
                        <span>45%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-3">
                        <div className="w-[45%] bg-white rounded-full h-3 shadow-lg"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{t.howItWorks.mockups.optionB}</span>
                        <span>35%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-3">
                        <div className="w-[35%] bg-white/70 rounded-full h-3"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{t.howItWorks.mockups.optionC}</span>
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
              <h3 className="text-3xl font-bold text-gray-900 mb-4">{t.howItWorks.step4.title}</h3>
              <p className="text-lg text-gray-600 mb-4">{t.howItWorks.step4.description}</p>
              <p className="text-gray-500">{t.howItWorks.step4.details}</p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-24">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">{t.howItWorks.features.title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass-effect rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">{t.howItWorks.features.realtime}</h4>
            </div>

            <div className="glass-effect rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">{t.howItWorks.features.qrcode}</h4>
            </div>

            <div className="glass-effect rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Monitor className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">{t.howItWorks.features.responsive}</h4>
            </div>

            <div className="glass-effect rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">{t.howItWorks.features.charts}</h4>
            </div>

            <div className="glass-effect rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">{t.howItWorks.features.multilang}</h4>
            </div>

            <div className="glass-effect rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">{t.howItWorks.features.secure}</h4>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="glass-effect rounded-3xl p-12 transform hover:scale-105 transition-all duration-300">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">{t.howItWorks.cta.title}</h3>
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