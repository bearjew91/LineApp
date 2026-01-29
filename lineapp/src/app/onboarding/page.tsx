'use client';

import { OnboardingFlow } from '@/components/OnboardingFlow';
import { useState } from 'react';

export default function OnboardingPage() {
  const [completed, setCompleted] = useState(false);

  const handleOnboardingComplete = async (data: any) => {
    console.log('Onboarding completed:', data);
    
    // TODO: Save user data to database
    // For now, just store in localStorage for development
    localStorage.setItem('userProfile', JSON.stringify(data));
    
    setCompleted(true);
    
    // Redirect to home/dashboard after 1 second
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1000);
  };

  if (completed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="text-center">
          <div className="text-6xl mb-4">✨</div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome to LineUp!</h1>
          <p className="text-gray-600 mt-2">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-12">
      <OnboardingFlow onComplete={handleOnboardingComplete} />
    </main>
  );
}
