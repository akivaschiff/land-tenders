'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UserData {
  idNumber: string;
  birthDate: string;
  age: number;
  sex: 'male' | 'female';
  maritalStatus: 'single' | 'married';
  isReservist: boolean;
  isCombatUnit: boolean;
}

export default function ResultsPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user data from sessionStorage
    const storedData = sessionStorage.getItem('userData');
    if (storedData) {
      setUserData(JSON.parse(storedData));
      setIsLoading(false);
    } else {
      // If no data, redirect to home
      router.push('/');
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-terracotta-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your personalized results...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Your Perfect Lots
            </h1>
            <p className="text-gray-600">
              Based on your profile, here are the best matches for you
            </p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="btn-secondary"
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </span>
          </button>
        </div>
      </header>

      {/* User Profile Summary */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="card-container p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Profile</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-sm text-gray-600 mb-1">Age</div>
              <div className="text-lg font-semibold text-gray-900">{userData.age} years</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Status</div>
              <div className="text-lg font-semibold text-gray-900 capitalize">{userData.maritalStatus}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Reservist</div>
              <div className="text-lg font-semibold text-gray-900">{userData.isReservist ? 'Yes' : 'No'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Combat Unit</div>
              <div className="text-lg font-semibold text-gray-900">{userData.isCombatUnit ? 'Yes' : 'No'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Placeholder */}
      <div className="max-w-7xl mx-auto">
        <div className="card-container p-12 text-center">
          <div className="w-24 h-24 bg-gradient-warm rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Results Page Ready
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            This is a placeholder for the results page. The tender results with personalized
            pricing and filtering based on user data will be designed and implemented here.
          </p>
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-terracotta-50 rounded-full border border-terracotta-200">
            <svg className="w-5 h-5 text-terracotta-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-terracotta-700">
              Coming Soon: Personalized tender results with pricing
            </span>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div
          className="absolute top-20 right-20 w-64 h-64 bg-terracotta-200 organic-blob opacity-20 animate-float"
          style={{ animationDelay: '0s' }}
        />
        <div
          className="absolute bottom-32 left-20 w-80 h-80 bg-sage-200 organic-blob opacity-15 animate-float"
          style={{ animationDelay: '2s' }}
        />
      </div>
    </div>
  );
}
