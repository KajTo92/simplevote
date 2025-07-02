import Link from 'next/link';
import { Settings } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative">
      {/* Ikona administratora w rogu */}
      <Link 
        href="/auth/login" 
        className="absolute top-6 right-6 p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-200 group"
      >
        <Settings className="w-6 h-6 text-gray-700 group-hover:text-gray-900 group-hover:rotate-90 transition-all duration-200" />
      </Link>

      {/* Główny content */}
      <div className="text-center space-y-8 max-w-2xl mx-auto px-6">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            Proste
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Głosowanie
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-lg mx-auto leading-relaxed">
            Głosowanie w czasie rzeczywistym dla spotkań firmowych, eventów i warsztatów
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="glass-effect rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl">📱</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Skanuj QR</h3>
            <p className="text-gray-600 text-sm">Uczestnicy łatwo dołączają skanując kod QR</p>
          </div>

          <div className="glass-effect rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl">⚡</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Na Żywo</h3>
            <p className="text-gray-600 text-sm">Wyniki aktualizują się w czasie rzeczywistym</p>
          </div>

          <div className="glass-effect rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl">📊</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Czytelne</h3>
            <p className="text-gray-600 text-sm">Przejrzyste wykresy słupkowe i statystyki</p>
          </div>
        </div>
      </div>
    </div>
  );
} 