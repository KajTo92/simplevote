'use client';

import { useLanguage } from './LanguageProvider';
import { Language } from '@/lib/i18n';

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; flag: string; name: string }[] = [
    { code: 'pl', flag: '🇵🇱', name: 'Polski' },
    { code: 'en', flag: '🇬🇧', name: 'English' }
  ];

  return (
    <div className={`flex gap-2 ${className}`}>
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
            ${language === lang.code 
              ? 'bg-blue-100 text-blue-700 border-2 border-blue-300' 
              : 'bg-white/20 text-gray-700 border-2 border-transparent hover:bg-white/30'
            }
          `}
          title={lang.name}
        >
          <span className="text-lg">{lang.flag}</span>
          <span className="text-sm font-medium hidden sm:inline">{lang.name}</span>
        </button>
      ))}
    </div>
  );
} 