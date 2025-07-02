'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import QRCode from 'qrcode';
import { Poll } from '@/types';
import { ArrowLeft, QrCode, Users, RotateCcw } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function PollDisplayPage() {
  const params = useParams();
  const pollId = params.id as string;
  const { t } = useLanguage();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (pollId) {
      fetchPoll();
      generateQRCode();
      
      // Odświeżaj dane co 2 sekundy
      const interval = setInterval(fetchPoll, 2000);
      return () => clearInterval(interval);
    }
  }, [pollId]);

  const fetchPoll = async () => {
    try {
      const response = await fetch(`/api/polls/${pollId}`);
      if (response.ok) {
        const data = await response.json();
        setPoll(data);
      } else {
        setError(t.errors.notFound);
      }
    } catch (error) {
      console.error('Error fetching poll:', error);
      setError(t.errors.loadingError);
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async () => {
    try {
      // Użyj zmiennej środowiskowej jeśli jest ustawiona, w przeciwnym razie użyj window.location.origin
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      const voteUrl = `${baseUrl}/vote/${pollId}`;
      const qrUrl = await QRCode.toDataURL(voteUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#1f2937',
          light: '#ffffff'
        }
      });
      setQrCodeUrl(qrUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        {/* Przełącznik języków */}
        <div className="absolute top-6 right-6">
          <LanguageSwitcher />
        </div>
        
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t.errors.loading}</p>
        </div>
      </div>
    );
  }

  if (error || !poll) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        {/* Przełącznik języków */}
        <div className="absolute top-6 right-6">
          <LanguageSwitcher />
        </div>
        
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.errors.error}</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.display.backToAdmin}
          </Link>
        </div>
      </div>
    );
  }

  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
  const maxVotes = Math.max(...poll.options.map(option => option.votes));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/admin"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t.display.backToAdmin}
            </Link>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <LanguageSwitcher />
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{totalVotes} {t.admin.votes}</span>
              </div>
              <div className="flex items-center gap-1">
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>{t.display.live}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Wyniki głosowania */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
                {poll.title}
              </h1>

              <div className="space-y-6">
                {poll.options.map((option) => {
                  const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                  const isWinning = option.votes === maxVotes && maxVotes > 0;
                  
                  return (
                    <div key={option.id} className="relative">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className={`text-xl font-semibold ${isWinning ? 'text-yellow-700' : 'text-gray-900'}`}>
                          {isWinning && '👑 '}{option.text}
                        </h3>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${isWinning ? 'text-yellow-700' : 'text-gray-900'}`}>
                            {option.votes}
                          </div>
                          <div className="text-sm text-gray-500">
                            {percentage.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="relative h-12 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ease-out ${
                            isWinning ? 'shadow-lg scale-y-110' : ''
                          }`}
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: option.color,
                            boxShadow: isWinning ? `0 0 20px ${option.color}40` : 'none'
                          }}
                        />
                        
                        {/* Animated particles for winning option */}
                        {isWinning && option.votes > 0 && (
                          <div className="absolute inset-0 overflow-hidden">
                            {[...Array(3)].map((_, i) => (
                              <div
                                key={i}
                                className="absolute top-1/2 animate-ping"
                                style={{
                                  left: `${Math.random() * percentage}%`,
                                  animationDelay: `${i * 0.5}s`,
                                  transform: 'translateY(-50%)'
                                }}
                              >
                                ✨
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {totalVotes === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-6xl mb-4">🗳️</div>
                  <p className="text-xl">{t.display.waitingForVotes}</p>
                </div>
              )}
            </div>
          </div>

          {/* QR Code i instrukcje */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-6">
                <QrCode className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">{t.display.joinVoting}</h2>
              </div>
              
              {qrCodeUrl && (
                <div className="mb-6">
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code" 
                    className="mx-auto rounded-lg shadow-sm"
                  />
                </div>
              )}
              
              <div className="space-y-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{t.display.scanQR}</h4>
                    <p className="text-gray-600 text-sm">{t.display.instructions.step1}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{t.display.instructions.step2}</h4>
                    <p className="text-gray-600 text-sm">{t.display.instructions.step3}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{t.voting.currentResults}</h4>
                    <p className="text-gray-600 text-sm">{t.features.live.description}</p>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
} 