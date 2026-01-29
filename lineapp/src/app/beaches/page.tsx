'use client';

import BottomNav from '@/components/BottomNav';
import { useState } from 'react';

export default function BeachesPage() {
  const [activeView, setActiveView] = useState<'nearby' | 'search' | 'map' | 'favorites'>('nearby');

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 pt-12 pb-4">
        <h1 className="text-2xl font-bold text-slate-800">Beaches</h1>
        <p className="text-sm text-slate-500 mt-1">Find your perfect spot</p>
      </div>

      {/* View Tabs */}
      <div className="bg-white border-b border-slate-200 px-4 py-2">
        <div className="flex gap-2">
          {[
            { id: 'nearby', label: 'Near Me', icon: '📍' },
            { id: 'search', label: 'Search', icon: '🔍' },
            { id: 'map', label: 'Map', icon: '🗺️' },
            { id: 'favorites', label: 'Favorites', icon: '⭐' },
          ].map((view) => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id as any)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                activeView === view.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {view.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeView === 'nearby' && (
          <div className="space-y-3">
            <div className="text-xs text-slate-500 uppercase tracking-wide mb-2">Within 10km</div>
            {['Frishman Beach', 'Gordon Beach', 'Hilton Beach', 'Banana Beach'].map((beach, i) => (
              <div key={beach} className="bg-white rounded-xl p-4 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">{beach}</div>
                  <div className="text-sm text-slate-500">{(i + 1) * 0.8}km away · Tel Aviv</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">{2.5 + i * 0.3}ft</div>
                  <div className={`text-xs px-2 py-0.5 rounded-full ${i === 0 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {i === 0 ? 'Good' : 'Fair'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeView === 'search' && (
          <div>
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search beaches..."
                className="w-full px-4 py-3 pl-10 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
              </svg>
            </div>
            <div className="text-center text-slate-400 py-8">
              Type to search for beaches
            </div>
          </div>
        )}

        {activeView === 'map' && (
          <div className="bg-slate-200 rounded-xl h-96 flex items-center justify-center">
            <div className="text-center text-slate-500">
              <svg className="w-12 h-12 mx-auto mb-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 9m0 8V9m0 0L9 7" />
              </svg>
              <p>Map coming soon</p>
            </div>
          </div>
        )}

        {activeView === 'favorites' && (
          <div className="text-center text-slate-400 py-12">
            <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <p className="font-medium text-slate-600 mb-1">No favorites yet</p>
            <p className="text-sm">Add beaches to quickly access them</p>
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}
