'use client';

import { useLanguage } from './LanguageProvider';
import { Language } from '@/lib/i18n';

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; flag: string; name: string }[] = [
    { code: 'en', flag: '🇬🇧', name: 'English' },
    { code: 'pl', flag: '🇵🇱', name: 'Polski' }
  ];

  return (
    <div className={`flex gap-1 ${className}`}>
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`
            flex items-center gap-1.5 px-2 py-1.5 rounded-md transition-all duration-200 text-xs
            ${language === lang.code 
              ? 'bg-white/40 text-gray-800 shadow-sm border border-white/30' 
              : 'bg-white/10 text-gray-600 border border-transparent hover:bg-white/20 hover:text-gray-800'
            }
          `}
          title={lang.name}
        >
          <span className="text-sm">{lang.flag}</span>
          <span className="font-medium hidden sm:inline">{lang.code.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
} 