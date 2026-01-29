'use client';

import BottomNav from '@/components/BottomNav';
import Link from 'next/link';

export default function MorePage() {
  const menuSections: { title: string; items: { label: string; icon: string; href: string; description: string; badge?: string }[] }[] = [
    {
      title: 'Account',
      items: [
        { label: 'Profile', icon: '👤', href: '/profile', description: 'Edit your info and preferences' },
        { label: 'Settings', icon: '⚙️', href: '/settings', description: 'Units, notifications, privacy' },
      ],
    },
    {
      title: 'Surf Tools',
      items: [
        { label: 'Surf Cams', icon: '📹', href: '/cams', description: 'Live beach cameras', badge: 'Soon' },
        { label: 'Tide Charts', icon: '🌊', href: '/tides', description: 'Tide times and heights', badge: 'Soon' },
      ],
    },
    {
      title: 'Community',
      items: [
        { label: 'Find Lessons', icon: '🏄', href: '/lessons', description: 'Local instructors', badge: 'Soon' },
        { label: 'Photo Market', icon: '📸', href: '/marketplace', description: 'Buy surf photos', badge: 'Soon' },
      ],
    },
    {
      title: 'Support',
      items: [
        { label: 'Help Center', icon: '❓', href: '/help', description: 'FAQs and tutorials' },
        { label: 'Feedback', icon: '💬', href: '/feedback', description: 'Share your thoughts' },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 pt-12 pb-4">
        <h1 className="text-2xl font-bold text-slate-800">More</h1>
      </div>

      {/* User Card */}
      <div className="p-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
            U
          </div>
          <div className="flex-1">
            <div className="font-semibold text-slate-800">Surfer</div>
            <div className="text-sm text-slate-500">Intermediate · Tel Aviv</div>
          </div>
          <Link href="/profile" className="text-blue-600 text-sm font-medium">Edit</Link>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="px-4 space-y-6">
        {menuSections.map((section) => (
          <div key={section.title}>
            <div className="text-xs text-slate-500 uppercase tracking-wide mb-2 px-1">{section.title}</div>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
              {section.items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="text-2xl w-8 text-center">{item.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-800 flex items-center gap-2">
                      {item.label}
                      {item.badge && (
                        <span className="bg-slate-100 text-slate-500 text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-slate-500">{item.description}</div>
                  </div>
                  <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* App Info */}
      <div className="p-4 mt-6">
        <div className="text-center text-slate-400 text-sm">
          <div className="font-medium text-slate-500 mb-1">LineUp</div>
          <div>Version 1.0.0</div>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
