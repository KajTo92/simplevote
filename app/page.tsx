'use client';

import Link from 'next/link';
import { Settings } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative">
      {/* Ikona administratora i przełącznik języków w prawym górnym rogu */}
      <div className="absolute top-6 right-6 flex items-center gap-3">
        <LanguageSwitcher />
        <Link 
          href="/auth/login" 
          className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-200 group"
          title={t.auth.adminPanel}
        >
          <Settings className="w-6 h-6 text-gray-700 group-hover:text-gray-900 group-hover:rotate-90 transition-all duration-200" />
        </Link>
      </div>

      {/* Główny content */}
      <div className="text-center space-y-8 max-w-2xl mx-auto px-6">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-gray-900 mb-8">
            {t.title.split(' ')[0]}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {t.title.split(' ').slice(1).join(' ')}
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-lg mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="glass-effect rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-white text-2xl">📱</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-3 text-lg">{t.features.qr.title}</h3>
            <p className="text-gray-600 text-base">{t.features.qr.description}</p>
          </div>

          <div className="glass-effect rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-white text-2xl">⚡</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-3 text-lg">{t.features.live.title}</h3>
            <p className="text-gray-600 text-base">{t.features.live.description}</p>
          </div>

          <div className="glass-effect rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-white text-2xl">📊</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-3 text-lg">{t.features.clear.title}</h3>
            <p className="text-gray-600 text-base">{t.features.clear.description}</p>
          </div>
        </div>

        {/* Call to Action Button */}
        <div className="mt-16">
          <Link 
            href="/auth/login"
            className="inline-flex items-center px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
          >
            <span className="mr-3">{t.common.createFirstPoll}</span>
            <span className="text-xl group-hover:translate-x-1 transition-transform duration-300">🚀</span>
          </Link>
        </div>
      </div>
    </div>
  );
} 