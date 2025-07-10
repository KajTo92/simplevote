'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Settings, QrCode, BarChart3, Eye, CheckCircle, Smartphone, Monitor, Palette, Zap, Globe, Shield } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

export default function HowItWorksPage() {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Fallback dla urządzeń mobilnych - próba wymuszenia autoodtwarzania
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Zapobieganie przełączeniu na pełny ekran
      const handleFullscreenChange = () => {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
      };

      const handleWebkitFullscreenChange = () => {
        const webkitDoc = document as any;
        if (webkitDoc.webkitFullscreenElement) {
          webkitDoc.webkitExitFullscreen();
        }
      };

      // Spróbuj odtworzyć film z małym opóźnieniem
      const playVideo = async () => {
        try {
          await video.play();
        } catch (error) {
          console.log('Autoplay blocked on this device:', error);
        }
      };
      
      // Dodaj event listenery do zapobiegania pełnemu ekranowi
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      document.addEventListener('webkitfullscreenchange', handleWebkitFullscreenChange);
      
      // Opóźnienie pozwala na pełne załadowanie elementu
      setTimeout(playVideo, 500);

      // Cleanup
      return () => {
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        document.removeEventListener('webkitfullscreenchange', handleWebkitFullscreenChange);
      };
    }
  }, []);

  return (
    <div className="min-h-screen relative">


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

        {/* Video Section */}
        <div className="mb-24 text-center">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t.howItWorks.videoSection.question}
            </h2>
            <p className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-semibold">
              {t.howItWorks.videoSection.solution}
            </p>
          </div>
          
          <div className="glass-effect rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-xl shadow-2xl">
              <video 
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                webkit-playsinline="true"
                x-webkit-airplay="deny"
                disablePictureInPicture
                controlsList="nodownload nofullscreen noremoteplayback"
                className="w-full h-auto [&::-webkit-media-controls-fullscreen-button]:hidden"
                preload="metadata"
                controls={false}
                style={{
                  objectFit: 'contain',
                  maxWidth: '100%',
                  height: 'auto',
                }}
                onLoadedMetadata={(e) => {
                  const video = e.currentTarget;
                  video.setAttribute('webkit-playsinline', 'true');
                  video.setAttribute('playsinline', 'true');
                }}
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.howItWorks.step1.title}</h2>
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
                        <h3 className="text-lg font-semibold mb-2">{t.howItWorks.mockups.exampleQuestion}</h3>
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