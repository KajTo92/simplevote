'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings, Menu, X, ArrowLeft, Info, DollarSign, User, LogOut } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useAuth } from './AuthProvider';

export function Navbar() {
  const { t, language } = useLanguage();
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutNotification, setShowLogoutNotification] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Zamknij menu przy kliknięciu poza nim
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Zamknij menu przy zmianie ścieżki
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      // Show logout notification
      setShowLogoutNotification(true);
      setIsMenuOpen(false);
      
      // Wait a moment before signing out to show notification
      setTimeout(async () => {
        await signOut();
        // Redirect to login page after logout
        window.location.href = '/auth/login';
      }, 1500);
    } catch (error) {
      console.error('Error during logout:', error);
      setShowLogoutNotification(false);
    }
  };

  // Różne warianty navbar zależnie od strony
  const isHomePage = pathname === '/';
  const isAuthPage = pathname.startsWith('/auth');
  const isAdminPage = pathname === '/admin';
  const isPollDisplayPage = pathname.startsWith('/poll/');
  const isVotePage = pathname.startsWith('/vote/');

  // Jeśli to strona wyświetlania wyników, nie pokazuj navbara (ma swój własny header)
  if (isPollDisplayPage) {
    return null;
  }

  // Jeśli to strona logowania/rejestracji/głosowania, pokazuj tylko Language Switcher
  if (isAuthPage || isVotePage) {
    return (
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>
    );
  }

  return (
    <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-50">
      {/* Logo / Back button */}
      <div className="flex items-center gap-3">
        {!isHomePage && (
          <Link 
            href="/" 
            className="flex items-center gap-2 p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-200 group"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700 group-hover:text-gray-900 group-hover:-translate-x-1 transition-all duration-200" />
            <span className="text-gray-700 group-hover:text-gray-900 font-medium hidden sm:inline">{t.common.backToHome}</span>
          </Link>
        )}
        
        {isAdminPage && (
          <h1 className="text-2xl font-bold text-gray-900">
            {t.title.split(' ')[0]}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {' '}{t.title.split(' ').slice(1).join(' ')}
            </span>
          </h1>
        )}
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-3">
        {/* Navigation Links */}
        {!isAdminPage && (
          <>
            <Link 
              href="/pricing" 
              className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-200 group"
            >
              <span className="text-gray-700 group-hover:text-gray-900 font-medium">{t.common.pricing}</span>
            </Link>
            <Link 
              href="/how-it-works" 
              className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-200 group"
            >
              <span className="text-gray-700 group-hover:text-gray-900 font-medium">{t.common.howItWorks}</span>
            </Link>
          </>
        )}
        
        {/* Admin Panel Links */}
        {isAdminPage && (
          <>
            <Link 
              href="/how-it-works"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Info className="w-4 h-4" />
              <span className="text-sm">{t.common.howItWorks}</span>
            </Link>
            <Link 
              href="/pricing"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <DollarSign className="w-4 h-4" />
              <span className="text-sm">{t.common.pricing}</span>
            </Link>
            
            {/* User Info */}
            {user && (
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-4 h-4" />
                <span className="text-sm">{user.email}</span>
              </div>
            )}
            
            {/* Logout Button */}
            {user && (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">{t.auth.logout}</span>
              </button>
            )}
          </>
        )}

        {/* Language Switcher */}
        <LanguageSwitcher />
        
        {/* Login/Settings Button */}
        {!isAdminPage && (
          <Link 
            href="/auth/login" 
            className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-200 group"
            title={t.auth.adminPanel}
          >
            <Settings className="w-6 h-6 text-gray-700 group-hover:text-gray-900 group-hover:rotate-90 transition-all duration-200" />
          </Link>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden" ref={menuRef}>
        {/* Burger Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-200 group"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6 text-gray-700 group-hover:text-gray-900 transition-colors duration-200" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700 group-hover:text-gray-900 transition-colors duration-200" />
          )}
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute right-0 top-full mt-2 py-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 min-w-[200px]">
            {/* Navigation Links */}
            {!isAdminPage && (
              <>
                <Link 
                  href="/pricing"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>{t.common.pricing}</span>
                </Link>
                <Link 
                  href="/how-it-works"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Info className="w-4 h-4" />
                  <span>{t.common.howItWorks}</span>
                </Link>
                <div className="border-t border-gray-200 my-2"></div>
                <Link 
                  href="/auth/login"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>{t.auth.adminPanel}</span>
                </Link>
              </>
            )}
            
            {/* Admin Panel Links */}
            {isAdminPage && (
              <>
                <Link 
                  href="/how-it-works"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Info className="w-4 h-4" />
                  <span>{t.common.howItWorks}</span>
                </Link>
                <Link 
                  href="/pricing"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>{t.common.pricing}</span>
                </Link>
                
                {user && (
                  <>
                    <div className="border-t border-gray-200 my-2"></div>
                    <div className="flex items-center gap-3 px-4 py-3 text-gray-600">
                      <User className="w-4 h-4" />
                      <span className="text-sm truncate">{user.email}</span>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t.auth.logout}</span>
                    </button>
                  </>
                )}
              </>
            )}
            
            <div className="border-t border-gray-200 my-2"></div>
            
            {/* Language Switcher w menu mobilnym */}
            <div className="px-4 py-2">
              <LanguageSwitcher className="w-full" />
            </div>
          </div>
        )}
      </div>

      {/* Logout Notification */}
      {showLogoutNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {language === 'pl' ? 'Wylogowywanie...' : 'Logging out...'}
              </h3>
              <p className="text-gray-600">
                {language === 'pl' 
                  ? 'Zostałeś pomyślnie wylogowany. Przekierowanie do strony logowania...'
                  : 'You have been successfully logged out. Redirecting to login page...'
                }
              </p>
            </div>
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 