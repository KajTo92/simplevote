'use client';

import { useState, useEffect } from 'react';
import { Plus, Eye, Calendar, Users, LogOut, User, Trash2, Power, PowerOff } from 'lucide-react';
import Link from 'next/link';
import { Poll } from '@/types';
import { useAuth } from '@/components/AuthProvider';

export default function AdminPage() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [loading, setLoading] = useState(false);
  const [deletingPoll, setDeletingPoll] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const { user, signOut } = useAuth();

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const response = await fetch('/api/polls');
      const data = await response.json();
      setPolls(data);
    } catch (error) {
      console.error('Error fetching polls:', error);
    }
  };

  const createPoll = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/polls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          options: options.filter(opt => opt.trim()).map(opt => opt.trim())
        }),
      });

      if (response.ok) {
        setTitle('');
        setOptions(['', '']);
        setShowCreateForm(false);
        fetchPolls();
      } else {
        const error = await response.json();
        alert('Błąd: ' + error.error);
      }
    } catch (error) {
      console.error('Error creating poll:', error);
      alert('Wystąpił błąd podczas tworzenia głosowania');
    } finally {
      setLoading(false);
    }
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const deletePoll = async (pollId: string) => {
    setDeletingPoll(pollId);
    
    try {
      const response = await fetch(`/api/polls/${pollId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPolls(polls.filter(poll => poll.id !== pollId));
        setShowDeleteConfirm(null);
      } else {
        const error = await response.json();
        alert('Błąd: ' + error.error);
      }
    } catch (error) {
      console.error('Error deleting poll:', error);
      alert('Wystąpił błąd podczas usuwania głosowania');
    } finally {
      setDeletingPoll(null);
    }
  };

  const togglePollStatus = async (pollId: string) => {
    try {
      const response = await fetch(`/api/polls/${pollId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'toggle-status' }),
      });

      if (response.ok) {
        const result = await response.json();
        setPolls(polls.map(poll => 
          poll.id === pollId ? result.poll : poll
        ));
      } else {
        const error = await response.json();
        alert('Błąd: ' + error.error);
      }
    } catch (error) {
      console.error('Error toggling poll status:', error);
      alert('Wystąpił błąd podczas zmiany statusu głosowania');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="text-gray-500 hover:text-gray-700 mb-2 block">
              ← Powrót do strony głównej
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Panel Administratora</h1>
            <p className="text-gray-600 mt-2">Zarządzaj głosowaniami i zobacz wyniki</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* User Info */}
            <div className="flex items-center gap-2 text-gray-600">
              <User className="w-4 h-4" />
              <span className="text-sm">{user?.email}</span>
            </div>
            
            {/* Logout Button */}
            <button
              onClick={signOut}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Wyloguj</span>
            </button>
            
            {/* Create Poll Button */}
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Nowe Głosowanie
            </button>
          </div>
        </div>

        {/* Create Poll Form */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Nowe Głosowanie</h2>
              
              <form onSubmit={createPoll} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tytuł głosowania
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Np. Która opcja jest najlepsza?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Opcje do wyboru
                  </label>
                  <div className="space-y-2">
                    {options.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={`Opcja ${index + 1}`}
                          required
                        />
                        {options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(index)}
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {options.length < 8 && (
                    <button
                      type="button"
                      onClick={addOption}
                      className="mt-2 text-blue-600 hover:text-blue-700"
                    >
                      + Dodaj opcję
                    </button>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Anuluj
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Tworzenie...' : 'Utwórz Głosowanie'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Polls List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {polls.map((poll) => (
            <div key={poll.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-lg line-clamp-2">{poll.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  poll.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {poll.isActive ? 'Aktywne' : 'Nieaktywne'}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                {poll.options.map((option) => {
                  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
                  const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                  
                  return (
                    <div key={option.id} className="text-sm">
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-700">{option.text}</span>
                        <span className="text-gray-900 font-medium">{option.votes} głosów</span>
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

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{poll.options.reduce((sum, opt) => sum + opt.votes, 0)} głosów</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(poll.createdAt).toLocaleDateString('pl-PL')}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Link
                  href={`/poll/${poll.id}`}
                  className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Zobacz Głosowanie
                </Link>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => togglePollStatus(poll.id)}
                    className={`flex items-center justify-center gap-2 flex-1 py-2 rounded-lg transition-colors ${
                      poll.isActive 
                        ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {poll.isActive ? (
                      <>
                        <PowerOff className="w-4 h-4" />
                        Dezaktywuj
                      </>
                    ) : (
                      <>
                        <Power className="w-4 h-4" />
                        Aktywuj
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => setShowDeleteConfirm(poll.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <div className="text-center">
                <Trash2 className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">Usuń głosowanie</h2>
                <p className="text-gray-600 mb-6">
                  Czy na pewno chcesz usunąć to głosowanie? Ta akcja jest nieodwracalna.
                  Wszystkie głosy i dane zostaną trwale utracone.
                </p>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Anuluj
                  </button>
                  <button
                    onClick={() => deletePoll(showDeleteConfirm)}
                    disabled={deletingPoll === showDeleteConfirm}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {deletingPoll === showDeleteConfirm ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Usuwanie...
                      </div>
                    ) : (
                      'Usuń na zawsze'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {polls.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Brak głosowań</h3>
            <p className="text-gray-600 mb-6">Utwórz swoje pierwsze głosowanie, aby rozpocząć</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Utwórz Głosowanie
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 