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
        <Link 
          href="/how-it-works" 
          className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-200 group"
        >
          <span className="text-gray-700 group-hover:text-gray-900 font-medium">{t.common.howItWorks}</span>
        </Link>
        <Link 
          href="/pricing" 
          className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-200 group"
        >
          <span className="text-gray-700 group-hover:text-gray-900 font-medium">{t.common.pricing}</span>
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

      {/* Główny content */}
      <div className="text-center space-y-8 max-w-5xl mx-auto px-6">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-gray-900 mb-8">
            {t.title.split(' ')[0]}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {' '}{t.title.split(' ').slice(1).join(' ')}
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-lg mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <Link href="/how-it-works" className="glass-effect rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-300 aspect-square flex flex-col justify-center cursor-pointer">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white text-xl">📱</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2 text-base">{t.features.qr.title}</h3>
            <p className="text-gray-600 text-sm">{t.features.qr.description}</p>
          </Link>

          <Link href="/how-it-works" className="glass-effect rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-300 aspect-square flex flex-col justify-center cursor-pointer">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white text-xl">⚡</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2 text-base">{t.features.live.title}</h3>
            <p className="text-gray-600 text-sm">{t.features.live.description}</p>
          </Link>

          <Link href="/how-it-works" className="glass-effect rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-300 aspect-square flex flex-col justify-center cursor-pointer">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white text-xl">📊</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2 text-base">{t.features.clear.title}</h3>
            <p className="text-gray-600 text-sm">{t.features.clear.description}</p>
          </Link>
        </div>

        {/* Call to Action Buttons */}
        <div className="mt-16 space-y-4">
          <div>
            <Link 
              href="/how-it-works"
              className="inline-flex items-center px-6 py-2 bg-white/20 backdrop-blur-sm text-gray-700 font-medium text-sm rounded-full hover:bg-white/30 hover:text-gray-900 transition-all duration-200 group"
            >
              <span className="mr-2">{t.common.howItWorks}</span>
              <span className="text-sm group-hover:translate-x-1 transition-transform duration-200">📖</span>
            </Link>
          </div>
          <div>
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
    </div>
  );
} 