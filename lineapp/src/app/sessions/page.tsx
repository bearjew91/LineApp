'use client';

import BottomNav from '@/components/BottomNav';
import { useState } from 'react';

export default function SessionsPage() {
  const [activeView, setActiveView] = useState<'upcoming' | 'history' | 'discover'>('upcoming');

  // Mock data
  const upcomingSessions = [
    { id: 1, beach: 'Frishman Beach', date: 'Tomorrow', time: '7:00 AM', participants: 3, isOpen: true },
    { id: 2, beach: 'Gordon Beach', date: 'Sat, Feb 1', time: '6:30 AM', participants: 1, isOpen: false },
  ];

  const pastSessions = [
    { id: 1, beach: 'Hilton Beach', date: 'Jan 26', conditions: 'Good', rating: 4, notes: 'Fun session, slight crowd' },
    { id: 2, beach: 'Frishman Beach', date: 'Jan 24', conditions: 'Fair', rating: 3, notes: 'Waves smaller than expected' },
  ];

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Sessions</h1>
            <p className="text-sm text-slate-500 mt-1">Plan and track your surfs</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 shadow-lg">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Session
          </button>
        </div>
      </div>

      {/* View Tabs */}
      <div className="bg-white border-b border-slate-200 px-4 py-2">
        <div className="flex gap-2">
          {[
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'history', label: 'History' },
            { id: 'discover', label: 'Discover' },
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
        {activeView === 'upcoming' && (
          <div className="space-y-3">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="bg-white rounded-xl p-4 border border-slate-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-semibold text-slate-800">{session.beach}</div>
                    <div className="text-sm text-slate-500">{session.date} · {session.time}</div>
                  </div>
                  {session.isOpen && (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                      Open to join
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[...Array(session.participants)].map((_, i) => (
                        <div key={i} className="w-7 h-7 bg-slate-200 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-slate-600">
                          {String.fromCharCode(65 + i)}
                        </div>
                      ))}
                    </div>
                    <span className="text-sm text-slate-500">{session.participants} going</span>
                  </div>
                  <button className="text-blue-600 text-sm font-medium">View</button>
                </div>
              </div>
            ))}
            
            {upcomingSessions.length === 0 && (
              <div className="text-center text-slate-400 py-12">
                <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth={1.5} />
                  <line x1="16" y1="2" x2="16" y2="6" strokeWidth={1.5} />
                  <line x1="8" y1="2" x2="8" y2="6" strokeWidth={1.5} />
                  <line x1="3" y1="10" x2="21" y2="10" strokeWidth={1.5} />
                </svg>
                <p className="font-medium text-slate-600 mb-1">No upcoming sessions</p>
                <p className="text-sm">Schedule your next surf!</p>
              </div>
            )}
          </div>
        )}

        {activeView === 'history' && (
          <div className="space-y-3">
            {pastSessions.map((session) => (
              <div key={session.id} className="bg-white rounded-xl p-4 border border-slate-200">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-semibold text-slate-800">{session.beach}</div>
                    <div className="text-sm text-slate-500">{session.date}</div>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    session.conditions === 'Good' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {session.conditions}
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < session.rating ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-slate-600">{session.notes}</p>
              </div>
            ))}
          </div>
        )}

        {activeView === 'discover' && (
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wide mb-3">Open Sessions Nearby</div>
            <div className="space-y-3">
              <div className="bg-white rounded-xl p-4 border border-slate-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-semibold text-slate-800">Dawn Patrol at Hilton</div>
                    <div className="text-sm text-slate-500">Tomorrow · 6:00 AM</div>
                  </div>
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                    4 spots left
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-3">Early morning session, all levels welcome. Looking for chill vibes!</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center text-xs font-medium text-slate-600">D</div>
                    <span className="text-sm text-slate-500">Hosted by Dan K.</span>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium">Join</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}
