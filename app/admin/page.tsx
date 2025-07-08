'use client';

import { useState, useEffect } from 'react';
import { Plus, Eye, Calendar, Users, LogOut, User, Trash2, Power, PowerOff, Settings, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Poll } from '@/types';
import { useAuth } from '@/components/AuthProvider';
import { useLanguage } from '@/components/LanguageProvider';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function AdminPage() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [loading, setLoading] = useState(false);
  const [deletingPoll, setDeletingPoll] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showDisplaySettings, setShowDisplaySettings] = useState<string | null>(null);
  const [displaySettingsLoading, setDisplaySettingsLoading] = useState(false);
  const [chartType, setChartType] = useState<'horizontal' | 'vertical' | 'pie'>('horizontal');
  const [showPercentages, setShowPercentages] = useState(true);
  const [showVoteCounts, setShowVoteCounts] = useState(true);
  const [hideBars, setHideBars] = useState(false);
  const { user, signOut } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    fetchPolls();
  }, []);

  // Aktualizuj stan formularza gdy otwieramy modal
  useEffect(() => {
    if (showDisplaySettings) {
      const poll = polls.find(p => p.id === showDisplaySettings);
      if (poll) {
        setChartType(poll.displaySettings?.chartType || 'horizontal');
        setShowPercentages(poll.displaySettings?.showPercentages ?? true);
        setShowVoteCounts(poll.displaySettings?.showVoteCounts ?? true);
        setHideBars(poll.displaySettings?.hideBars ?? false);
      }
    }
  }, [showDisplaySettings, polls]);

  const fetchPolls = async () => {
    try {
      const response = await fetch('/api/polls');
      const data = await response.json();
      
      // Sprawdź czy API zwróciło sukces i czy data jest tablicą
      if (response.ok && Array.isArray(data)) {
        setPolls(data);
      } else {
        console.error('API error:', data);
        setPolls([]); // Ustaw pustą tablicę jako fallback
        // Opcjonalnie pokaż komunikat użytkownikowi
        if (data.error) {
          alert(t.errors.loadingError + ': ' + data.error);
        }
      }
    } catch (error) {
      console.error('Error fetching polls:', error);
      setPolls([]); // Ustaw pustą tablicę jako fallback
      alert(t.errors.loadingError);
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
        alert(t.errors.error + ': ' + error.error);
      }
    } catch (error) {
      console.error('Error creating poll:', error);
      alert(t.errors.creationError);
    } finally {
      setLoading(false);
    }
  };

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
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
        alert(t.errors.error + ': ' + error.error);
      }
    } catch (error) {
      console.error('Error deleting poll:', error);
      alert(t.errors.error);
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
        alert(t.errors.error + ': ' + error.error);
      }
    } catch (error) {
      console.error('Error toggling poll status:', error);
      alert(t.errors.error);
    }
  };

  const updateDisplaySettings = async () => {
    if (!showDisplaySettings) return;
    
    setDisplaySettingsLoading(true);
    
    try {
      const response = await fetch(`/api/polls/${showDisplaySettings}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'update-display-settings', 
          displaySettings: {
            chartType,
            showPercentages,
            showVoteCounts,
            hideBars
          }
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setPolls(polls.map(poll => 
          poll.id === showDisplaySettings ? result.poll : poll
        ));
        setShowDisplaySettings(null);
      } else {
        const error = await response.json();
        alert(t.errors.error + ': ' + error.error);
      }
    } catch (error) {
      console.error('Error updating display settings:', error);
      alert(t.errors.error);
    } finally {
      setDisplaySettingsLoading(false);
    }
  };

  const adjustVotes = async (pollId: string, optionId: string, adjustment: number) => {
    try {
      const response = await fetch(`/api/polls/${pollId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'adjust-votes', 
          optionId,
          adjustment
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setPolls(polls.map(poll => 
          poll.id === pollId ? result.poll : poll
        ));
      } else {
        const error = await response.json();
        alert(t.errors.error + ': ' + error.error);
      }
    } catch (error) {
      console.error('Error adjusting votes:', error);
      alert(t.errors.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                {t.title.split(' ')[0]}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  {' '}{t.title.split(' ').slice(1).join(' ')}
                </span>
              </h1>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{t.admin.title}</h1>
            <p className="text-gray-600 mt-2">{t.admin.subtitle}</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <LanguageSwitcher />
            
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
              <span className="text-sm">{t.auth.logout}</span>
            </button>
            
            {/* Create Poll Button */}
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              {t.admin.newPoll}
            </button>
          </div>
        </div>

        {/* Create Poll Form */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">{t.admin.newPoll}</h2>
              
              <form onSubmit={createPoll} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.admin.pollTitle}
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t.admin.pollTitlePlaceholder}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.admin.options}
                  </label>
                  <div className="space-y-2">
                    {options.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={`${t.admin.optionPlaceholder} ${index + 1}`}
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
                  
                  {options.length < 6 && (
                    <button
                      type="button"
                      onClick={addOption}
                      className="mt-2 text-blue-600 hover:text-blue-700"
                    >
                      + {t.admin.addOption}
                    </button>
                  )}
                  
                  {options.length >= 6 && (
                    <p className="mt-2 text-sm text-amber-600 bg-amber-50 p-2 rounded-lg">
                      ⚠️ {t.admin.maxOptionsReached}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    {t.admin.cancel}
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? t.admin.creating : t.admin.createPoll}
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
                <h3 className="font-bold text-gray-900 text-lg break-words">{poll.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  poll.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {poll.isActive ? t.admin.active : t.admin.inactive}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                {poll.options.map((option) => {
                  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
                  const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                  
                  return (
                    <div key={option.id} className="text-sm">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-700">{option.text}</span>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => adjustVotes(poll.id, option.id, -1)}
                              className="w-5 h-5 flex items-center justify-center text-xs text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Usuń głos"
                              disabled={option.votes === 0}
                            >
                              −
                            </button>
                            <span className="text-gray-900 font-medium min-w-[3rem] text-center">
                              {option.votes} {t.admin.votes}
                            </span>
                            <button
                              onClick={() => adjustVotes(poll.id, option.id, 1)}
                              className="w-5 h-5 flex items-center justify-center text-xs text-gray-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                              title="Dodaj głos"
                            >
                              +
                            </button>
                          </div>
                        </div>
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
                  <span>{poll.options.reduce((sum, opt) => sum + opt.votes, 0)} {t.admin.votes}</span>
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
                  {t.admin.view}
                </Link>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDisplaySettings(poll.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    title={t.admin.displaySettings}
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  
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
                        {t.admin.deactivate}
                      </>
                    ) : (
                      <>
                        <Power className="w-4 h-4" />
                        {t.admin.activate}
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
                <h2 className="text-xl font-bold text-gray-900 mb-2">{t.admin.delete}</h2>
                <p className="text-gray-600 mb-6">
                  {t.admin.confirmDelete} {t.admin.deleteWarning}
                </p>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    {t.admin.cancel}
                  </button>
                  <button
                    onClick={() => deletePoll(showDeleteConfirm)}
                    disabled={deletingPoll === showDeleteConfirm}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {deletingPoll === showDeleteConfirm ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        {t.admin.deleting}
                      </div>
                    ) : (
                      t.admin.delete
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Display Settings Modal */}
        {showDisplaySettings && (() => {
          const poll = polls.find(p => p.id === showDisplaySettings);
          if (!poll) return null;
          
          return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="w-6 h-6 text-gray-600" />
                  <h2 className="text-xl font-bold text-gray-900">{t.admin.displaySettings}</h2>
                </div>
                
                <div className="space-y-4">
                  {/* Chart Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.admin.chartType}
                    </label>
                    <div className="space-y-2">
                                              <label className="flex items-center">
                          <input
                            type="radio"
                            name="chartType"
                            value="horizontal"
                            checked={chartType === 'horizontal'}
                            onChange={(e) => setChartType(e.target.value as any)}
                            className="mr-2"
                          />
                          <div className="flex items-center gap-2">
                            {/* Horizontal Bar Icon */}
                            <div className="flex flex-col gap-1">
                              <div className="w-8 h-1.5 bg-blue-400 rounded-full"></div>
                              <div className="w-6 h-1.5 bg-blue-300 rounded-full"></div>
                              <div className="w-10 h-1.5 bg-blue-500 rounded-full"></div>
                            </div>
                            <span className="text-sm">{t.admin.horizontalChart}</span>
                          </div>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="chartType"
                            value="vertical"
                            checked={chartType === 'vertical'}
                            onChange={(e) => setChartType(e.target.value as any)}
                            className="mr-2"
                          />
                          <div className="flex items-center gap-2">
                            {/* Vertical Bar Icon */}
                            <div className="flex items-end gap-0.5 h-6">
                              <div className="w-1.5 h-4 bg-green-400 rounded-t"></div>
                              <div className="w-1.5 h-3 bg-green-300 rounded-t"></div>
                              <div className="w-1.5 h-5 bg-green-500 rounded-t"></div>
                              <div className="w-1.5 h-2 bg-green-300 rounded-t"></div>
                            </div>
                            <span className="text-sm">{t.admin.verticalChart}</span>
                          </div>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="chartType"
                            value="pie"
                            checked={chartType === 'pie'}
                            onChange={(e) => setChartType(e.target.value as any)}
                            className="mr-2"
                          />
                          <div className="flex items-center gap-2">
                            {/* Pie Chart Icon */}
                            <div className="relative w-6 h-6">
                              <div className="w-6 h-6 rounded-full border-2 border-purple-300"></div>
                              <div className="absolute top-0 left-0 w-6 h-6 rounded-full border-t-2 border-r-2 border-purple-500 transform rotate-45"></div>
                              <div className="absolute top-0 left-0 w-6 h-6 rounded-full border-t-2 border-purple-400"></div>
                            </div>
                            <span className="text-sm">{t.admin.pieChart}</span>
                          </div>
                        </label>
                    </div>
                  </div>
                  
                  {/* Display Options */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.admin.displayOptions}
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={showPercentages}
                          onChange={(e) => setShowPercentages(e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm">{t.admin.showPercentages}</span>
                      </label>
                                              <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={showVoteCounts}
                            onChange={(e) => setShowVoteCounts(e.target.checked)}
                            className="mr-2"
                          />
                          <span className="text-sm">{t.admin.showVoteCounts}</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={hideBars}
                            onChange={(e) => setHideBars(e.target.checked)}
                            className="mr-2"
                          />
                          <span className="text-sm">{t.admin.hideBars}</span>
                        </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-6">
                  <button
                    onClick={() => setShowDisplaySettings(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    {t.admin.cancel}
                  </button>
                  <button
                    onClick={updateDisplaySettings}
                    disabled={displaySettingsLoading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {displaySettingsLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        {t.admin.saving}
                      </div>
                    ) : (
                      t.common.save
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {polls.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">{t.display.waitingForVotes}</h3>
            <p className="text-gray-600 mb-6">{t.admin.subtitle}</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              {t.admin.createPoll}
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 