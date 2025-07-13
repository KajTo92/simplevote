'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import QRCode from 'qrcode';
import { Poll, CompanySettings } from '@/types';
import { ArrowLeft, QrCode, Users, RotateCcw } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { HorizontalChart, VerticalChart, PieChart } from '@/components/Charts';

export default function PollDisplayPage() {
  const params = useParams();
  const pollId = params.id as string;
  const { t } = useLanguage();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [companySettings, setCompanySettings] = useState<CompanySettings | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (pollId) {
      fetchPoll();
      fetchCompanySettings();
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

  const fetchCompanySettings = async () => {
    try {
      const response = await fetch('/api/company-settings');
      if (response.ok) {
        const settings = await response.json();
        setCompanySettings(settings);
      }
    } catch (error) {
      console.error('Error fetching company settings:', error);
    }
  };

  const generateQRCode = async () => {
    try {
      // Get base URL and ensure it doesn't end with slash
      const baseUrl = (process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || window.location.origin);
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
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.errors.error}</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/admin"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4" />
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
            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                {t.title.split(' ')[0]}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  {' '}{t.title.split(' ').slice(1).join(' ')}
                </span>
              </h1>
            </div>
            
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

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          
          {/* Wyniki głosowania */}
          <div className="xl:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm p-6 h-[calc(100vh-200px)] flex flex-col">
              <h1 className="text-3xl xl:text-4xl font-bold text-gray-900 mb-6 text-center flex-shrink-0">
                {poll.title}
              </h1>

              {/* Wyświetl odpowiedni typ wykresu */}
              <div className="flex-1 overflow-hidden">
                {(() => {
                  const chartType = poll.displaySettings?.chartType || 'horizontal';
                  const showPercentages = poll.displaySettings?.showPercentages ?? true;
                  const showVoteCounts = poll.displaySettings?.showVoteCounts ?? true;
                  const hideBars = poll.displaySettings?.hideBars ?? false;
                  const hideBarsNoAnimation = poll.displaySettings?.hideBarsNoAnimation ?? false;
                  
                  if (totalVotes === 0) {
                    return (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                          <div className="text-6xl mb-4">🗳️</div>
                          <p className="text-xl">{t.display.waitingForVotes}</p>
                        </div>
                      </div>
                    );
                  }
                  
                  switch (chartType) {
                    case 'vertical':
                      return (
                        <VerticalChart 
                          options={poll.options}
                          showPercentages={showPercentages}
                          showVoteCounts={showVoteCounts}
                          hideBars={hideBars}
                          hideBarsNoAnimation={hideBarsNoAnimation}
                        />
                      );
                    case 'pie':
                      return (
                        <PieChart 
                          options={poll.options}
                          showPercentages={showPercentages}
                          showVoteCounts={showVoteCounts}
                          hideBars={hideBars}
                          hideBarsNoAnimation={hideBarsNoAnimation}
                        />
                      );
                    default:
                      return (
                        <HorizontalChart 
                          options={poll.options}
                          showPercentages={showPercentages}
                          showVoteCounts={showVoteCounts}
                          hideBars={hideBars}
                          hideBarsNoAnimation={hideBarsNoAnimation}
                        />
                      );
                  }
                })()}
              </div>
            </div>
          </div>

          {/* QR Code i instrukcje */}
          <div className="xl:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col">
              <div className="flex items-center justify-center gap-2 mb-6">
                <QrCode className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900 text-center">{t.display.joinVoting}</h2>
              </div>
              
              {qrCodeUrl && (
                <div className="mb-6 flex-shrink-0">
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code" 
                    className="mx-auto rounded-lg shadow-sm w-full max-w-48"
                  />
                </div>
              )}
              
              <div className="space-y-3 text-left">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{t.display.scanQR}</h4>
                    <p className="text-gray-600 text-xs">{t.display.instructions.step1}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{t.display.instructions.step2}</h4>
                    <p className="text-gray-600 text-xs">{t.display.instructions.step3}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{t.voting.currentResults}</h4>
                    <p className="text-gray-600 text-xs">{t.features.live.description}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Company Logo */}
            {companySettings?.companyLogoUrl && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="text-center">
                  <img 
                    src={companySettings.companyLogoUrl} 
                    alt="Company Logo" 
                    className="mx-auto max-w-full max-h-24 object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 