'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Poll } from '@/types';
import { CheckCircle, AlertCircle, Vote } from 'lucide-react';

export default function VotePage() {
  const params = useParams();
  const pollId = params.id as string;
  const [poll, setPoll] = useState<Poll | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [voted, setVoted] = useState(false);
  const [error, setError] = useState<string>('');
  const [voterFingerprint, setVoterFingerprint] = useState<string>('');

  useEffect(() => {
    // Generuj fingerprint użytkownika
    generateVoterFingerprint();
    
    if (pollId) {
      fetchPoll();
    }
  }, [pollId]);

  const generateVoterFingerprint = () => {
    const fingerprint = `${navigator.userAgent}_${screen.width}x${screen.height}_${Date.now()}_${Math.random()}`;
    const hash = btoa(fingerprint).substring(0, 16);
    setVoterFingerprint(hash);
  };

  const fetchPoll = async () => {
    try {
      const response = await fetch(`/api/polls/${pollId}`);
      if (response.ok) {
        const data = await response.json();
        setPoll(data);
      } else {
        setError('Głosowanie nie zostało znalezione');
      }
    } catch (error) {
      console.error('Error fetching poll:', error);
      setError('Wystąpił błąd podczas ładowania głosowania');
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
          setError('Już zagłosowałeś w tym głosowaniu');
          setVoted(true);
        } else {
          setError(result.error || 'Wystąpił błąd podczas głosowania');
        }
      }
    } catch (error) {
      console.error('Error voting:', error);
      setError('Wystąpił błąd podczas głosowania');
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie głosowania...</p>
        </div>
      </div>
    );
  }

  if (error || !poll) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Błąd</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (voted) {
    const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
    const maxVotes = Math.max(...poll.options.map(option => option.votes));

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Dziękujemy za głos!</h2>
            <p className="text-gray-600 mb-6">Twój głos został zaliczony</p>
            
            <div className="text-left space-y-4">
              <h3 className="font-semibold text-gray-900 text-center mb-4">Aktualne wyniki:</h3>
              {poll.options.map((option) => {
                const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                const isWinning = option.votes === maxVotes && maxVotes > 0;
                
                return (
                  <div key={option.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className={`font-medium ${isWinning ? 'text-yellow-700' : 'text-gray-900'}`}>
                        {isWinning && '👑 '}{option.text}
                      </span>
                      <span className="text-sm text-gray-600">
                        {option.votes} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
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
            
            <p className="text-sm text-gray-500 mt-6">
              Łącznie głosów: {totalVotes}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <Vote className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{poll.title}</h1>
            <p className="text-gray-600">Wybierz jedną opcję</p>
          </div>

          <div className="space-y-3">
            {poll.options.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  setSelectedOption(option.id);
                  submitVote(option.id);
                }}
                disabled={voting}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
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
                  <span className="font-medium text-gray-900">{option.text}</span>
                  <div
                    className="w-4 h-4 rounded-full border-2"
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
            <div className="text-center mt-6">
              <div className="inline-flex items-center gap-2 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Zapisywanie głosu...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 