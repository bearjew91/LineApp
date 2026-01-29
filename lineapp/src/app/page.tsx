'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🌊</div>
          <h1 className="text-2xl font-bold text-gray-800">LineUp</h1>
          <p className="text-gray-600 mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">🌊 LineUp</div>
          <div className="space-x-4">
            <Link
              href="/onboarding"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            AI-Powered Surfing Community 🌊
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get personalized wave forecasts, discover perfect sessions, and connect with surfers 
            in your skill level. Launching in Israel 🇮🇱
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/onboarding"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Start Free
            </Link>
            <a
              href="https://github.com/bearjew91/LineApp"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition"
            >
              GitHub
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {[
            {
              icon: '📊',
              title: 'Smart Forecasts',
              description: 'Wave conditions personalized to your skill level'
            },
            {
              icon: '🤖',
              title: 'AI Recommendations',
              description: 'Get the perfect session suggestions based on your preferences'
            },
            {
              icon: '👥',
              title: 'Community',
              description: 'Connect with surfers and share your sessions'
            }
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Phase Info */}
        <div className="mt-20 bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Phase 1: MVP (Foundation)</h2>
          <p className="text-gray-600 mb-4">
            We're starting with the core features: personalized wave forecasts, user profiles, and availability scheduling.
          </p>
          <ul className="space-y-2 text-gray-600">
            <li>✅ User onboarding with home beach selection</li>
            <li>✅ Real-time wave forecasts (Open-Meteo API)</li>
            <li>✅ Personalized suitability scoring by skill level</li>
            <li>⏳ Home dashboard with recommendations</li>
            <li>⏳ Session management (Phase 2)</li>
            <li>⏳ Live beach feed (Phase 2)</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
