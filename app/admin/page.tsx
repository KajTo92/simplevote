'use client';

import { useState, useEffect } from 'react';
import { Plus, Eye, Calendar, Users, LogOut, User, Trash2, Power, PowerOff, Settings, ArrowLeft, Upload, Image, Cloud, Info, DollarSign, CheckCircle, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Poll, CompanySettings } from '@/types';
import { useAuth } from '@/components/AuthProvider';
import { useLanguage } from '@/components/LanguageProvider';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function AdminPage() {
  const searchParams = useSearchParams();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [loading, setLoading] = useState(false);
  const [deletingPoll, setDeletingPoll] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showDisplaySettings, setShowDisplaySettings] = useState<string | null>(null);
  const [displaySettingsLoading, setDisplaySettingsLoading] = useState(false);
  const [chartType, setChartType] = useState<'horizontal' | 'vertical' | 'pie'>('vertical');
  const [showPercentages, setShowPercentages] = useState(true);
  const [showVoteCounts, setShowVoteCounts] = useState(true);
  const [hideBars, setHideBars] = useState(true);
  
  // Payment success notification
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successPlan, setSuccessPlan] = useState<string>('');
  
  // Vote limits
  const [voteLimits, setVoteLimits] = useState<{
    currentVotes: number;
    voteLimit: number;
    plan: string;
    canVote: boolean;
  } | null>(null);
  const [showVoteLimitWarning, setShowVoteLimitWarning] = useState(false);
  
  // Logout notification
  const [showLogoutNotification, setShowLogoutNotification] = useState(false);
  
  // Company Settings
  const [companySettings, setCompanySettings] = useState<CompanySettings | null>(null);
  const [companyLogoUploading, setCompanyLogoUploading] = useState(false);
  const [selectedCompanyLogo, setSelectedCompanyLogo] = useState<File | null>(null);
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  
  const { user, signOut } = useAuth();
  const { t, language } = useLanguage();

  useEffect(() => {
    fetchPolls();
    fetchCompanySettings();
    fetchVoteLimits();
  }, []);

  // Handle payment success notification
  useEffect(() => {
    const success = searchParams.get('success');
    const plan = searchParams.get('plan');
    
    if (success === 'true' && plan) {
      setShowSuccessNotification(true);
      setSuccessPlan(plan);
      
      // Auto-hide notification after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccessNotification(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  // Aktualizuj stan formularza gdy otwieramy modal
  useEffect(() => {
    if (showDisplaySettings) {
      const poll = polls.find(p => p.id === showDisplaySettings);
      if (poll) {
        setChartType(poll.displaySettings?.chartType || 'vertical');
        setShowPercentages(poll.displaySettings?.showPercentages ?? true);
        setShowVoteCounts(poll.displaySettings?.showVoteCounts ?? true);
        setHideBars(poll.displaySettings?.hideBars ?? true);
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

  const fetchVoteLimits = async () => {
    try {
      const response = await fetch('/api/vote-limits');
      if (response.ok) {
        const limits = await response.json();
        setVoteLimits(limits);
      }
    } catch (error) {
      console.error('Error fetching vote limits:', error);
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
    // Check vote limits before adding votes
    if (adjustment > 0 && voteLimits) {
      if (!voteLimits.canVote || (voteLimits.currentVotes + adjustment) > voteLimits.voteLimit) {
        const message = language === 'pl'
          ? `Nie można dodać ${adjustment} głosów. Limit głosów: ${voteLimits.currentVotes}/${voteLimits.voteLimit} dla planu ${voteLimits.plan.toUpperCase()}.`
          : `Cannot add ${adjustment} votes. Vote limit: ${voteLimits.currentVotes}/${voteLimits.voteLimit} for ${voteLimits.plan.toUpperCase()} plan.`;
        alert(message);
        setShowVoteLimitWarning(true);
        return;
      }
    }
    
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
        // Refresh vote limits after successful vote adjustment
        fetchVoteLimits();
      } else {
        const error = await response.json();
        if (error.error && error.error.includes('Vote limit')) {
          const message = language === 'pl'
            ? 'Osiągnięto limit głosów dla twojego planu. Przejdź na wyższy plan aby kontynuować.'
            : 'Vote limit reached for your plan. Upgrade to continue voting.';
          alert(message);
          setShowVoteLimitWarning(true);
        } else {
          alert(t.errors.error + ': ' + error.error);
        }
      }
    } catch (error) {
      console.error('Error adjusting votes:', error);
      alert(t.errors.error);
    }
  };

  const uploadCompanyLogo = async () => {
    if (!selectedCompanyLogo) return;
    
    setCompanyLogoUploading(true);
    
    try {
      // Upload file
      const formData = new FormData();
      formData.append('logo', selectedCompanyLogo);
      
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!uploadResponse.ok) {
        const error = await uploadResponse.json();
        alert(t.errors.error + ': ' + error.error);
        return;
      }
      
      const uploadResult = await uploadResponse.json();
      
      // Update company settings with logo URL
      const updateResponse = await fetch('/api/company-settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'update-logo', 
          logoUrl: uploadResult.url
        }),
      });

      if (updateResponse.ok) {
        const result = await updateResponse.json();
        setCompanySettings(result.settings);
        setSelectedCompanyLogo(null);
        setLogoPreviewUrl(null);
        alert(t.admin.logoUploaded);
      } else {
        const error = await updateResponse.json();
        alert(t.errors.error + ': ' + error.error);
      }
    } catch (error) {
      console.error('Error uploading company logo:', error);
      alert(t.errors.error);
    } finally {
      setCompanyLogoUploading(false);
    }
  };

  const removeCompanyLogo = async () => {
    try {
      const response = await fetch('/api/company-settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'update-logo', 
          logoUrl: null
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setCompanySettings(result.settings);
      } else {
        const error = await response.json();
        alert(t.errors.error + ': ' + error.error);
      }
    } catch (error) {
      console.error('Error removing company logo:', error);
      alert(t.errors.error);
    }
  };

  // Handle logo file selection and preview
  const handleLogoFileSelect = (file: File) => {
    setSelectedCompanyLogo(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setLogoPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop handlers
  const handleLogoDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingLogo(true);
  };

  const handleLogoDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingLogo(false);
  };

  const handleLogoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingLogo(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'image/png') {
        handleLogoFileSelect(file);
      }
    }
  };

  const handleLogoInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleLogoFileSelect(file);
    }
  };

  const handleSignOut = async () => {
    try {
      // Show logout notification
      setShowLogoutNotification(true);
      
      // Wait a moment to show the notification
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Sign out
      await signOut();
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        window.location.href = '/auth/login';
      }, 1000);
    } catch (error) {
      console.error('Error during logout:', error);
      setShowLogoutNotification(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {/* Left side - Back arrow and TeamVote logo */}
          <div className="flex items-center gap-3">
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
          
          {/* Right side - Navigation menu */}
          <div className="flex items-center gap-4">
            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-2">
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
            </div>
            
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {/* User Info */}
            <div className="flex items-center gap-2 text-gray-600">
              <User className="w-4 h-4" />
              <span className="text-sm">{user?.email}</span>
            </div>
            
            {/* Logout Button */}
            <button
              onClick={handleSignOut}
              disabled={showLogoutNotification}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
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

        {/* Title and Subtitle Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t.admin.title}</h1>
          <p className="text-gray-600 mt-2">{t.admin.subtitle}</p>
        </div>

        {/* Payment Success Notification */}
        {showSuccessNotification && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900">
                  {language === 'pl' ? 'Płatność zakończona sukcesem!' : 'Payment successful!'}
                </h3>
                <p className="text-green-700 text-sm">
                  {language === 'pl' 
                    ? `Gratulacje! Wykupiłeś plan ${successPlan.toUpperCase()}. Teraz możesz korzystać ze wszystkich funkcji.`
                    : `Congratulations! You've purchased the ${successPlan.toUpperCase()} plan. You can now enjoy all features.`
                  }
                </p>
              </div>
              <button
                onClick={() => setShowSuccessNotification(false)}
                className="ml-auto text-green-600 hover:text-green-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Vote Limits Information */}
        {voteLimits && (
          <div className={`mb-6 p-4 border rounded-lg ${
            voteLimits.canVote 
              ? 'bg-blue-50 border-blue-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-3">
              <Users className={`w-6 h-6 ${
                voteLimits.canVote ? 'text-blue-600' : 'text-red-600'
              }`} />
              <div className="flex-1">
                <h3 className={`font-semibold ${
                  voteLimits.canVote ? 'text-blue-900' : 'text-red-900'
                }`}>
                  {language === 'pl' ? 'Limit głosów' : 'Vote Limit'}
                </h3>
                <p className={`text-sm ${
                  voteLimits.canVote ? 'text-blue-700' : 'text-red-700'
                }`}>
                  {language === 'pl' 
                    ? `Wykorzystano ${voteLimits.currentVotes} z ${voteLimits.voteLimit === 999999 ? '∞' : voteLimits.voteLimit} głosów w planie ${voteLimits.plan.toUpperCase()}`
                    : `Used ${voteLimits.currentVotes} of ${voteLimits.voteLimit === 999999 ? '∞' : voteLimits.voteLimit} votes in ${voteLimits.plan.toUpperCase()} plan`
                  }
                </p>
                {!voteLimits.canVote && (
                  <p className="text-red-700 text-sm mt-1">
                    {language === 'pl' 
                      ? 'Osiągnięto limit głosów. Przejdź na wyższy plan aby kontynuować.'
                      : 'Vote limit reached. Upgrade to a higher plan to continue.'
                    }
                  </p>
                )}
              </div>
              {!voteLimits.canVote && (
                <Link 
                  href="/pricing"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  {language === 'pl' ? 'Przejdź na wyższy plan' : 'Upgrade Plan'}
                </Link>
              )}
            </div>
            {/* Progress bar */}
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    voteLimits.canVote ? 'bg-blue-600' : 'bg-red-600'
                  }`}
                  style={{ 
                    width: `${Math.min((voteLimits.currentVotes / (voteLimits.voteLimit === 999999 ? voteLimits.currentVotes + 100 : voteLimits.voteLimit)) * 100, 100)}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}

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

        {/* Company Settings and Polls List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {/* Company Settings Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow max-h-96 overflow-hidden">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Your Company Logo</h2>
            
            <div className="space-y-4">
              {/* Company Logo */}
              <div>
                {companySettings?.companyLogoUrl ? (
                  <div className="relative group">
                    {/* Current Logo Display - Enhanced */}
                    <div className="p-4 border-2 border-gray-200 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img 
                            src={companySettings.companyLogoUrl} 
                            alt="Company Logo" 
                            className="w-20 h-20 object-contain rounded-lg border-2 border-white shadow-md"
                          />
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <Upload className="w-3 h-3 text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{t.admin.logoActive}</h3>
                          <p className="text-sm text-gray-600">{t.admin.logoDescription}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-green-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>{t.admin.logoReady}</span>
                          </div>
                        </div>
                        <button
                          onClick={removeCompanyLogo}
                          className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200 hover:border-red-300"
                        >
                          {t.admin.removeLogo}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Modern Upload Area with Mockup */}
                    <div 
                      className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-300 ${
                        isDraggingLogo 
                          ? 'border-blue-500 bg-blue-50 scale-105' 
                          : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                      onDragOver={voteLimits?.plan === 'enterprise' ? handleLogoDragOver : undefined}
                      onDragLeave={voteLimits?.plan === 'enterprise' ? handleLogoDragLeave : undefined}
                      onDrop={voteLimits?.plan === 'enterprise' ? handleLogoDrop : undefined}
                    >
                      {/* Blur Background Layer (tylko dla non-enterprise) */}
                      {voteLimits?.plan !== 'enterprise' && (
                        <div className="absolute inset-0 bg-gray-50 rounded-xl blur-sm z-0"></div>
                      )}
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-5">
                        <div className="grid grid-cols-8 gap-2 h-full">
                          {[...Array(32)].map((_, i) => (
                            <div key={i} className="bg-gray-400 rounded-sm"></div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="relative z-10 text-center">
                        {selectedCompanyLogo && logoPreviewUrl ? (
                          /* Preview Selected Logo */
                          <div className="space-y-3">
                            <div className="relative inline-block">
                              <img 
                                src={logoPreviewUrl} 
                                alt="Logo Preview" 
                                className="w-20 h-20 object-contain rounded-lg border-2 border-white shadow-lg"
                              />
                              <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <Image className="w-3 h-3 text-white" />
                              </div>
                            </div>
                                                         <div>
                               <h3 className="text-base font-semibold text-gray-900 mb-1">{t.admin.logoReadyToUpload}</h3>
                               <p className="text-sm text-gray-600 mb-3">{t.admin.logoUploadHint}</p>
                               <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
                                 <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                 <span>{t.admin.logoFilePreview}</span>
                               </div>
                             </div>
                          </div>
                        ) : (
                          /* Upload Mockup */
                          <div className="space-y-3">
                            <div className="relative">
                              {/* Mockup Logo Placeholder */}
                              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg border-2 border-dashed border-gray-400 flex items-center justify-center mb-3">
                                <div className="text-center">
                                  <Image className="w-8 h-8 text-gray-500 mx-auto mb-1" />
                                  <div className="text-xs text-gray-500 font-medium">LOGO</div>
                                </div>
                              </div>
                              
                              {/* Upload Icon with Animation */}
                              <div className={`absolute -top-2 -right-8 transition-transform duration-300 ${
                                isDraggingLogo ? 'scale-125 rotate-12' : 'scale-100'
                              }`}>
                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                                  <Upload className="w-5 h-5 text-white" />
                                </div>
                              </div>
                            </div>
                            
                                                         <div>
                               <h3 className="text-base font-semibold text-gray-900 mb-2">
                                 {isDraggingLogo ? t.admin.logoDropHere : t.admin.logoUploadTitle}
                               </h3>
                               <p className="text-sm text-gray-600 mb-3">
                                 {t.admin.logoDragDropHint}
                               </p>
                               
                               {/* Visual Indicators */}
                               <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                                 <div className="flex items-center gap-1">
                                   <Cloud className="w-4 h-4" />
                                   <span>{t.admin.logoDragDrop}</span>
                                 </div>
                                 <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                 <div className="flex items-center gap-1">
                                   <Image className="w-4 h-4" />
                                   <span>{t.admin.logoFormat}</span>
                                 </div>
                               </div>
                             </div>
                          </div>
                        )}
                        
                        {/* Hidden File Input */}
                        <input
                          type="file"
                          accept=".png"
                          onChange={voteLimits?.plan === 'enterprise' ? handleLogoInputChange : undefined}
                          className="hidden"
                          id="logo-upload-input"
                          disabled={voteLimits?.plan !== 'enterprise'}
                        />
                        
                        {/* Upload Button */}
                        {!selectedCompanyLogo && (
                                                     <label 
                             htmlFor="logo-upload-input"
                             className={`inline-flex items-center gap-2 mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                               voteLimits?.plan === 'enterprise' ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                             }`}
                             onClick={voteLimits?.plan !== 'enterprise' ? (e) => e.preventDefault() : undefined}
                           >
                             <Plus className="w-4 h-4" />
                             {t.admin.logoSelectFile}
                           </label>
                        )}
                      </div>
                      
                      {/* Enterprise Only Overlay */}
                      {voteLimits?.plan !== 'enterprise' && (
                        <div className="absolute inset-0 bg-white bg-opacity-80 rounded-xl flex items-center justify-center z-20">
                          <div className="text-center p-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                              <Image className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {t.admin.enterpriseOnly}
                            </h3>
                            <p className="text-sm text-gray-600 mb-4 max-w-xs">
                              {t.admin.enterpriseUploadText}
                            </p>
                            <Link 
                              href="/pricing"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                            >
                              <span>{t.admin.upgradeToEnterprise}</span>
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Upload Action Button */}
                    {selectedCompanyLogo && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setSelectedCompanyLogo(null);
                            setLogoPreviewUrl(null);
                          }}
                                                     className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                         >
                           {t.common.cancel}
                         </button>
                        <button
                          onClick={uploadCompanyLogo}
                          disabled={companyLogoUploading}
                          className="flex-1 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                          {companyLogoUploading ? (
                            <div className="flex items-center justify-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              {t.admin.saving}
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              <Upload className="w-4 h-4" />
                              {t.admin.uploadLogo}
                            </div>
                          )}
                        </button>
                      </div>
                    )}
                    
                    {/* Additional Info */}
                    <div className="text-center">
                      <p className="text-xs text-gray-500">{t.admin.logoDescription}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
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
          <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-40">
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl border border-white/20 animate-in fade-in duration-700">
              {/* Animated Icon */}
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <div className="text-white text-3xl">📊</div>
                </div>
                <div className="absolute inset-0 w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-ping opacity-20"></div>
              </div>
              
              {/* Title with gradient */}
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3">
                {t.display.waitingForVotes}
              </h3>
              
              {/* Subtitle */}
              <p className="text-gray-600 mb-8 text-sm leading-relaxed">
                {t.admin.subtitle}
              </p>
              
              {/* Modern CTA Button */}
              <button
                onClick={() => setShowCreateForm(true)}
                className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                  <span className="font-medium">{t.admin.createPoll}</span>
                </div>
                
                {/* Subtle shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-purple-500/20 rounded-full blur-xl"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 