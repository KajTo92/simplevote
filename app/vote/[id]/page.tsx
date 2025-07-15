'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Poll } from '@/types';
import { CheckCircle, AlertCircle, Vote } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

export default function VotePage() {
  const params = useParams();
  const pollId = params.id as string;
  const { t, language } = useLanguage();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [voted, setVoted] = useState(false);
  const [error, setError] = useState<string>('');
  const [voterFingerprint, setVoterFingerprint] = useState<string>('');
  const [showResetOption, setShowResetOption] = useState(false);

  useEffect(() => {
    // Generuj fingerprint użytkownika
    generateVoterFingerprint();
    
    if (pollId) {
      fetchPoll();
    }
  }, [pollId]);

  const resetVotingAbility = () => {
    try {
      // Usuń fingerprint z localStorage
      localStorage.removeItem('voterFingerprint');
      localStorage.removeItem('deviceId');
    } catch (error) {
      // Ignoruj błędy localStorage
    }
    
    // Wygeneruj nowy fingerprint
    generateVoterFingerprint();
    
    // Resetuj stan
    setVoted(false);
    setError('');
    setShowResetOption(false);
    
    alert(t.voting.canVoteAgain);
  };

  const generateVoterFingerprint = () => {
    try {
      // Sprawdź czy już mamy fingerprint w localStorage
      const existingFingerprint = localStorage.getItem('voterFingerprint');
      
      if (existingFingerprint) {
        setVoterFingerprint(existingFingerprint);
        return;
      }
    } catch (error) {
      // localStorage może być niedostępny (incognito, stara przeglądarka)
      console.warn('localStorage not available, using session-only fingerprint');
    }
    
    // Utwórz stabilny fingerprint oparty na cechach urządzenia
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width,
      screen.height,
      screen.colorDepth,
      new Date().getTimezoneOffset(),
      navigator.platform,
      navigator.cookieEnabled ? '1' : '0',
      typeof navigator.onLine !== 'undefined' ? (navigator.onLine ? '1' : '0') : '0'
    ];
    
    // Dodaj losowy komponent tylko dla unikalności, ale STAŁY dla tego urządzenia
    let deviceId;
    try {
      deviceId = localStorage.getItem('deviceId');
      if (!deviceId) {
        deviceId = Math.random().toString(36).substring(2, 15);
        localStorage.setItem('deviceId', deviceId);
      }
    } catch (error) {
      // Fallback jeśli localStorage nie działa
      deviceId = 'session_' + Math.random().toString(36).substring(2, 15);
    }
    
    components.push(deviceId);
    
    const fingerprint = components.join('|');
    
    // Utwórz hash z fingerprint
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    const finalFingerprint = Math.abs(hash).toString(36).substring(0, 16);
    
    // Zapisz fingerprint w localStorage (jeśli dostępny)
    try {
      localStorage.setItem('voterFingerprint', finalFingerprint);
    } catch (error) {
      // Ignoruj błędy localStorage
    }
    
    setVoterFingerprint(finalFingerprint);
  };

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

  const submitVote = async (optionId: string) => {
    if (voting || voted) return;
    
    setVoting(true);
    
    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pollId,
          optionId,
          voterFingerprint
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setVoted(true);
        setPoll(result.poll);
      } else {
        if (response.status === 409) {
          setError(t.voting.alreadyVoted);
          setVoted(true);
        } else if (response.status === 403 && result.error === 'Vote limit reached') {
          // Special handling for vote limit reached
          const { currentVotes, voteLimit, plan } = result;
          const limitMessage = language === 'pl' 
            ? `Osiągnięto maksymalną liczbę głosów (${currentVotes}/${voteLimit}) dla planu ${plan.toUpperCase()}. Aby kontynuować głosowanie, przejdź na wyższy plan.`
            : `Maximum vote limit reached (${currentVotes}/${voteLimit}) for ${plan.toUpperCase()} plan. To continue voting, upgrade to a higher plan.`;
          setError(limitMessage);
        } else {
          setError(result.error || t.errors.votingError);
        }
      }
    } catch (error) {
      console.error('Error voting:', error);
      setError(t.errors.votingError);
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t.errors.loading}</p>
        </div>
      </div>
    );
  }

  if (error || !poll) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.errors.error}</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (voted) {
    const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
    const maxVotes = Math.max(...poll.options.map(option => option.votes));

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-2">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-gray-900 mb-1">{t.voting.thankYou}</h2>
            <p className="text-gray-600 mb-4 text-sm">{t.voting.voteRecorded}</p>
            
            <div className="text-left space-y-3">
              <h3 className="font-semibold text-gray-900 text-center mb-3 text-lg">{t.voting.currentResults}</h3>
              {poll.options.map((option) => {
                const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                const isWinning = option.votes === maxVotes && maxVotes > 0;
                
                return (
                  <div key={option.id} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className={`font-medium ${isWinning ? 'text-yellow-700' : 'text-gray-900'} text-sm`}>
                        {isWinning && '👑 '}{option.text}
                      </span>
                      <span className="text-xs text-gray-600">
                        {option.votes} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: option.color 
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            
            <p className="text-xs text-gray-500 mt-4">
              {t.voting.totalVotes} {totalVotes}
            </p>
            
            {/* Opcja resetu (ukryta domyślnie) */}
            <div className="mt-3 pt-3 border-t border-gray-200">
              {!showResetOption ? (
                <button
                  onClick={() => setShowResetOption(true)}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  ⚙️ {t.voting.devOptions}
                </button>
              ) : (
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">
                    {t.voting.testingOnly}
                  </p>
                  <div className="space-y-1">
                    <button
                      onClick={resetVotingAbility}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200"
                    >
                      {t.voting.resetVoting}
                    </button>
                    <br />
                    <button
                      onClick={() => setShowResetOption(false)}
                      className="text-xs text-gray-400 hover:text-gray-600"
                    >
                      {t.common.cancel}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-2">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center mb-6">
            <Vote className="w-10 h-10 text-blue-600 mx-auto mb-3" />
            <h1 className="text-xl font-bold text-gray-900 mb-1">{poll.title}</h1>
            <p className="text-gray-600 text-sm">{t.voting.chooseOption}</p>
          </div>

          <div className="space-y-2">
            {poll.options.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  setSelectedOption(option.id);
                  submitVote(option.id);
                }}
                disabled={voting}
                className={`w-full p-3 rounded-xl border-2 text-left transition-all duration-200 text-sm ${
                  selectedOption === option.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                } ${voting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                style={{
                  borderColor: selectedOption === option.id ? option.color : undefined,
                  backgroundColor: selectedOption === option.id ? `${option.color}10` : undefined
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 text-sm">{option.text}</span>
                  <div
                    className="w-3 h-3 rounded-full border-2"
                    style={{
                      backgroundColor: selectedOption === option.id ? option.color : 'transparent',
                      borderColor: option.color
                    }}
                  />
                </div>
              </button>
            ))}
          </div>

          {voting && (
            <div className="text-center mt-4">
              <div className="inline-flex items-center gap-2 text-blue-600">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                <span className="text-sm">{t.common.loading}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 