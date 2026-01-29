'use client';

import BottomNav from '@/components/BottomNav';
import { useState } from 'react';

export default function FeedPage() {
  const [filter, setFilter] = useState<'all' | 'home' | 'nearby'>('all');

  // Mock feed data
  const feedItems = [
    { id: 1, beach: 'Frishman Beach', user: 'Yoni S.', time: '12 min ago', type: 'photo', description: 'Clean 3ft sets coming through!', likes: 8 },
    { id: 2, beach: 'Gordon Beach', user: 'Maya L.', time: '28 min ago', type: 'photo', description: 'Light offshore, glassy conditions', likes: 15 },
    { id: 3, beach: 'Hilton Beach', user: 'Amit R.', time: '1h ago', type: 'video', description: 'Crowded but fun waves today', likes: 23 },
  ];

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Feed</h1>
            <p className="text-sm text-slate-500 mt-1">Live updates from the beach</p>
          </div>
          <button className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border-b border-slate-200 px-4 py-2">
        <div className="flex gap-2">
          {[
            { id: 'all', label: 'All Beaches' },
            { id: 'home', label: 'Home Beach' },
            { id: 'nearby', label: 'Nearby' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`py-1.5 px-4 rounded-full text-sm font-medium transition-colors ${
                filter === f.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Feed Items */}
      <div className="p-4 space-y-4">
        {feedItems.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {/* Image placeholder */}
            <div className="bg-gradient-to-br from-blue-400 to-cyan-500 h-48 relative">
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}
              {/* TTL badge */}
              <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                Expires in 2h 48m
              </div>
            </div>
            
            {/* Content */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-sm font-semibold text-slate-600">
                    {item.user.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">{item.user}</div>
                    <div className="text-xs text-slate-500">{item.beach} · {item.time}</div>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-red-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              <p className="text-slate-700 text-sm">{item.description}</p>
              <div className="mt-2 text-xs text-slate-500">{item.likes} likes</div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Banner */}
      <div className="mx-4 bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-medium text-blue-800">Fresh conditions only</div>
            <div className="text-xs text-blue-600 mt-0.5">Posts expire after 3 hours to ensure you see current conditions. Must be at the beach to post.</div>
          </div>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
