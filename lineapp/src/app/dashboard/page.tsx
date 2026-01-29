'use client';

import BottomNav from '@/components/BottomNav';
import { useForecast } from '@/hooks/useForecast';
import { SurfingLevel } from '@/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { forecast, loading, fetchForecast } = useForecast();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [beachId, setBeachId] = useState('beach_1');
  const [activeTab, setActiveTab] = useState<'conditions' | 'forecast' | 'weather' | 'wetsuit' | 'map'>('conditions');
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const tabs: ('conditions' | 'forecast' | 'weather' | 'wetsuit' | 'map')[] = ['conditions', 'forecast', 'weather', 'wetsuit', 'map'];
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      const currentIndex = tabs.indexOf(activeTab);
      if (currentIndex < tabs.length - 1) {
        setActiveTab(tabs[currentIndex + 1]);
      }
    }
    if (isRightSwipe) {
      const currentIndex = tabs.indexOf(activeTab);
      if (currentIndex > 0) {
        setActiveTab(tabs[currentIndex - 1]);
      }
    }
  };

  const toggleCardFlip = (cardId: string) => {
    setFlippedCards(prev => {
      const next = new Set(prev);
      if (next.has(cardId)) {
        next.delete(cardId);
      } else {
        next.add(cardId);
      }
      return next;
    });
  };

  // Unit conversion helpers
  const getHeight = (ft: number | string | undefined) => {
    const num = typeof ft === 'string' ? parseFloat(ft) : (ft || 0);
    if (isNaN(num)) return '0.0';
    if (userProfile?.heightUnit === 'm') {
      return (num * 0.3048).toFixed(1);
    }
    return num.toFixed(1);
  };
  
  const getHeightUnit = () => userProfile?.heightUnit === 'm' ? 'm' : 'ft';
  
  const getTemp = (f: number) => {
    if (userProfile?.tempUnit === 'C') {
      return Math.round((f - 32) * 5 / 9);
    }
    return f;
  };
  
  const getTempUnit = () => userProfile?.tempUnit === 'C' ? '°C' : '°F';

  // Wind speed conversion (stored as knots)
  const getWindSpeed = (knots: number) => {
    if (userProfile?.windUnit === 'kmh') {
      return Math.round(knots * 1.852);
    }
    if (userProfile?.windUnit === 'mph') {
      return Math.round(knots * 1.151);
    }
    return Math.round(knots);
  };
  
  const getWindUnit = () => {
    if (userProfile?.windUnit === 'kmh') return 'km/h';
    if (userProfile?.windUnit === 'mph') return 'mph';
    return 'kts';
  };

  // Convert compass direction to degrees for arrow rotation
  const getDirectionDegrees = (dir?: string): number => {
    if (!dir) return 0;
    const directions: Record<string, number> = {
      'N': 180, 'NNE': 202.5, 'NE': 225, 'ENE': 247.5,
      'E': 270, 'ESE': 292.5, 'SE': 315, 'SSE': 337.5,
      'S': 0, 'SSW': 22.5, 'SW': 45, 'WSW': 67.5,
      'W': 90, 'WNW': 112.5, 'NW': 135, 'NNW': 157.5
    };
    return directions[dir] || 0;
  };

  // Safe accessor for suitability score
  const getSuitability = () => {
    if (!forecast || !userProfile?.surfingLevel) return 0;
    const level = userProfile.surfingLevel as keyof typeof forecast.suitability;
    return forecast.suitability[level] || 0;
  };

  useEffect(() => {
    // Load user profile from localStorage
    const profile = localStorage.getItem('userProfile');
    if (profile) {
      const parsed = JSON.parse(profile);
      setUserProfile(parsed);
      if (parsed.homeBeach?.id) {
        setBeachId(parsed.homeBeach.id);
      }
    }

    // Fetch forecast for home beach
    fetchForecast(beachId);
  }, []);

  if (!userProfile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Loading your profile...</p>
          <Link
            href="/onboarding"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Complete Onboarding
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col pb-20">
      {/* Clean Navigation */}
      <nav className="bg-white/90 backdrop-blur-md shadow-sm flex-shrink-0 border-b border-slate-200">
        <div className="px-4 py-2.5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center px-1.5 py-1">
              <img src="/logo.png" alt="LineUp" className="h-full w-auto object-contain" />
            </div>
            <span className="text-base font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              LineUp
            </span>
          </div>
          <Link
            href="/settings"
            className="text-slate-500 hover:text-slate-700 transition-colors p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </Link>
        </div>
      </nav>

      <div className="flex-1 px-3 py-3 flex flex-col overflow-hidden gap-3">
        {/* Location Header */}
        <div className="flex-shrink-0 flex justify-between items-center">
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Home Spot</div>
            <div className="text-lg font-bold text-slate-900">{userProfile.homeBeach?.name || 'Select Beach'}</div>
          </div>
          <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{new Date().toLocaleDateString('en-IL', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
        </div>

        {/* TOP SECTION - Tab Cards */}
        <div className="flex-[2] bg-white rounded-xl shadow-sm flex flex-col border border-slate-200 min-h-[320px]">
          {/* Tabs with Modern Icons */}
          <div className="flex border-b border-slate-100 flex-shrink-0">
            {[
              { id: 'conditions', icon: (
                // Wave icon
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 15c2.5 0 4-2 6-2s3.5 2 6 2 3.5-2 6-2" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 11c2.5 0 4-2 6-2s3.5 2 6 2 3.5-2 6-2" opacity="0.5" />
                </svg>
              )},
              { id: 'forecast', icon: (
                // Calendar icon
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <text x="12" y="17" textAnchor="middle" fontSize="6" fill="currentColor" stroke="none" fontWeight="bold">3</text>
                </svg>
              )},
              { id: 'weather', icon: (
                // Sun/weather icon
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="4" />
                  <path strokeLinecap="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              )},
              { id: 'wetsuit', icon: (
                // Shirt/gear icon
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 2l3 3v4l-3 2v11h12V11l-3-2V5l3-3" />
                </svg>
              )},
              { id: 'map', icon: (
                // Map pin icon
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <circle cx="12" cy="11" r="3" />
                </svg>
              )}
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-3 flex items-center justify-center transition-all ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab.icon}
              </button>
            ))}
          </div>

          {/* Tab Content - Swipeable */}
          <div 
            className="flex-1 p-3 flex flex-col touch-pan-y"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : !forecast ? (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">No data available</div>
            ) : (
              <>
                {/* Waves Tab */}
                {activeTab === 'conditions' && (
                  <div className={`flex-1 grid grid-cols-3 gap-2 content-stretch rounded-lg p-1.5 ${
                    (forecast?.conditions.waveHeightFt ?? 0) >= 2 && (forecast?.conditions.waveHeightFt ?? 0) <= 5 && (forecast?.conditions.windSpeedKnots ?? 20) < 15
                      ? 'bg-green-100/60 ring-1 ring-green-300'
                      : (forecast?.conditions.windSpeedKnots ?? 20) > 20 || (forecast?.conditions.waveHeightFt ?? 0) > 6
                        ? 'bg-red-100/60 ring-1 ring-red-300'
                        : 'bg-amber-100/60 ring-1 ring-amber-300'
                  }`}>
                    {/* Wave Height - Flippable */}
                    <div 
                      onClick={() => toggleCardFlip('height')}
                      className="rounded-xl min-h-0 cursor-pointer transition-transform duration-300 [perspective:1000px]"
                    >
                      <div className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${flippedCards.has('height') ? '[transform:rotateY(180deg)]' : ''}`}>
                        {/* Front */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-3 text-white flex flex-col justify-between [backface-visibility:hidden]">
                          <div className="text-[10px] opacity-80 font-medium uppercase tracking-wide">Height</div>
                          <div className="text-2xl font-bold">{getHeight(forecast.conditions.waveHeightFt)}<span className="text-xs ml-0.5">{getHeightUnit()}</span></div>
                        </div>
                        {/* Back */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-2 text-white flex flex-col justify-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                          <div className="text-[8px] leading-snug">
                            <div className="font-semibold mb-0.5">Wave face size</div>
                            <div className="opacity-80 mb-1">Measured from trough to crest. Bigger = more power.</div>
                            <div className="text-[7px] opacity-90 border-t border-white/20 pt-1">
                              {userProfile?.surfingLevel === 'beginner' 
                                ? '💡 Look for 1-2ft to practice'
                                : userProfile?.surfingLevel === 'intermediate'
                                ? '💡 2-4ft ideal for progression'
                                : '💡 4ft+ for power moves'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Wave Period - Flippable */}
                    <div 
                      onClick={() => toggleCardFlip('period')}
                      className="rounded-xl min-h-0 cursor-pointer [perspective:1000px]"
                    >
                      <div className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${flippedCards.has('period') ? '[transform:rotateY(180deg)]' : ''}`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-3 text-white flex flex-col justify-between [backface-visibility:hidden]">
                          <div className="text-[10px] opacity-80 font-medium uppercase tracking-wide">Period</div>
                          <div className="text-2xl font-bold">{forecast.conditions.wavePeriodSec}<span className="text-xs ml-0.5">s</span></div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-2 text-white flex flex-col justify-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                          <div className="text-[8px] leading-snug">
                            <div className="font-semibold mb-0.5">Time between waves</div>
                            <div className="opacity-80 mb-1">Longer period = cleaner, more organized waves with more power.</div>
                            <div className="text-[7px] opacity-90 border-t border-white/20 pt-1">
                              {userProfile?.surfingLevel === 'beginner' 
                                ? '💡 8s+ gives more time to paddle'
                                : '💡 10s+ = quality ground swell'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Wave Direction - Flippable */}
                    <div 
                      onClick={() => toggleCardFlip('direction')}
                      className="rounded-xl min-h-0 cursor-pointer [perspective:1000px]"
                    >
                      <div className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${flippedCards.has('direction') ? '[transform:rotateY(180deg)]' : ''}`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl p-3 text-white flex flex-col justify-between [backface-visibility:hidden]">
                          <div className="text-[10px] opacity-80 font-medium uppercase tracking-wide">Direction</div>
                          <div className="text-xl font-bold flex items-center gap-1">
                            {forecast.conditions.waveDirection || 'N/A'}
                            <svg className="w-4 h-4 opacity-80" viewBox="0 0 24 24" fill="currentColor" style={{ transform: `rotate(${getDirectionDegrees(forecast.conditions.waveDirection)}deg)` }}>
                              <path d="M12 2l-5 9h10l-5-9zm0 20l5-9H7l5 9z" />
                            </svg>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-600 to-cyan-700 rounded-xl p-2 text-white flex flex-col justify-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                          <div className="text-[8px] leading-snug">
                            <div className="font-semibold mb-0.5">Where swell comes from</div>
                            <div className="opacity-80 mb-1">Different angles work better at different beaches.</div>
                            <div className="text-[7px] opacity-90 border-t border-white/20 pt-1">
                              💡 Israel: W/NW swells are most common and consistent
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Skill Match - Flippable */}
                    <div 
                      onClick={() => toggleCardFlip('match')}
                      className="rounded-xl min-h-0 cursor-pointer [perspective:1000px]"
                    >
                      <div className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${flippedCards.has('match') ? '[transform:rotateY(180deg)]' : ''}`}>
                        <div className="absolute inset-0 bg-slate-100 rounded-xl p-3 border border-slate-200 flex flex-col justify-between [backface-visibility:hidden]">
                          <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">Match</div>
                          <div className="text-2xl font-bold text-slate-900">{getSuitability()}<span className="text-xs">%</span></div>
                        </div>
                        <div className="absolute inset-0 bg-slate-200 rounded-xl p-2 border border-slate-300 flex flex-col justify-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                          <div className="text-[8px] text-slate-700 leading-snug">
                            <div className="font-semibold mb-0.5">Skill suitability</div>
                            <div className="opacity-80 mb-1">How well conditions match your {userProfile?.surfingLevel || 'skill'} level.</div>
                            <div className="text-[7px] opacity-90 border-t border-slate-300 pt-1">
                              💡 70%+ = great session, 50-70% = doable, &lt;50% = challenging
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Wind - Flippable */}
                    <div 
                      onClick={() => toggleCardFlip('wind')}
                      className="rounded-xl min-h-0 cursor-pointer [perspective:1000px]"
                    >
                      <div className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${flippedCards.has('wind') ? '[transform:rotateY(180deg)]' : ''}`}>
                        <div className="absolute inset-0 bg-amber-50 rounded-xl p-3 border border-amber-200 flex flex-col justify-between [backface-visibility:hidden]">
                          <div className="text-[10px] text-amber-700 font-medium uppercase tracking-wide">Wind</div>
                          <div className="text-lg font-bold text-amber-900">
                            {getWindSpeed(parseFloat(forecast.conditions.windSpeedKnots.toString()))}
                            <span className="text-[10px] ml-0.5">{getWindUnit()}</span>
                            <span className="text-xs font-normal ml-1">{forecast.conditions.windDirection}</span>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-amber-100 rounded-xl p-2 border border-amber-300 flex flex-col justify-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                          <div className="text-[8px] text-amber-900 leading-snug">
                            <div className="font-semibold mb-0.5">Wind speed & direction</div>
                            <div className="opacity-80 mb-1">Offshore (E/SE) = clean. Onshore (W/NW) = choppy.</div>
                            <div className="text-[7px] opacity-90 border-t border-amber-300 pt-1">
                              💡 Early mornings often have lighter, offshore winds
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Swell - Flippable */}
                    <div 
                      onClick={() => toggleCardFlip('swell')}
                      className="rounded-xl min-h-0 cursor-pointer [perspective:1000px]"
                    >
                      <div className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${flippedCards.has('swell') ? '[transform:rotateY(180deg)]' : ''}`}>
                        <div className="absolute inset-0 bg-violet-50 rounded-xl p-3 border border-violet-200 flex flex-col justify-between [backface-visibility:hidden]">
                          <div className="text-[10px] text-violet-700 font-medium uppercase tracking-wide">Swell</div>
                          {forecast.conditions.swellHeightFt ? (
                            <div className="text-lg font-bold text-violet-900">
                              {getHeight(parseFloat(forecast.conditions.swellHeightFt.toString()))}
                              <span className="text-[10px] ml-0.5">{getHeightUnit()}</span>
                              <span className="text-xs font-normal ml-1">@{forecast.conditions.swellPeriodSec || '--'}s</span>
                            </div>
                          ) : (
                            <div className="text-lg font-bold text-violet-900">--</div>
                          )}
                        </div>
                        <div className="absolute inset-0 bg-violet-100 rounded-xl p-2 border border-violet-300 flex flex-col justify-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                          <div className="text-[8px] text-violet-900 leading-snug">
                            <div className="font-semibold mb-0.5">Primary swell energy</div>
                            <div className="opacity-80 mb-1">The main wave-generating source. Height + period = power.</div>
                            <div className="text-[7px] opacity-90 border-t border-violet-300 pt-1">
                              💡 Ground swell (10s+) travels far, wind swell (&lt;8s) is local
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3-Day Forecast Tab */}
                {activeTab === 'forecast' && (
                  <div className="flex-1 flex gap-1.5 min-h-0">
                    {/* Today */}
                    <div className="flex-1 bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-2 flex flex-col min-h-0">
                      <div className="text-center flex-shrink-0">
                        <div className="text-[9px] text-blue-500 font-medium uppercase tracking-wide">Today</div>
                        <div className="text-xs font-bold text-slate-800">{new Date().toLocaleDateString('en-IL', { weekday: 'short' })}</div>
                      </div>
                      <div className="flex-1 flex flex-col items-center justify-center gap-1 my-1 min-h-0">
                        {/* Weather Icon */}
                        <div className="w-7 h-7 flex items-center justify-center flex-shrink-0">
                          {(forecast?.conditions.weatherCode ?? 0) <= 3 ? (
                            <svg className="w-6 h-6 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                              <circle cx="12" cy="12" r="5" />
                              <g stroke="currentColor" strokeWidth="2" fill="none">
                                <line x1="12" y1="1" x2="12" y2="4" />
                                <line x1="12" y1="20" x2="12" y2="23" />
                                <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
                                <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
                                <line x1="1" y1="12" x2="4" y2="12" />
                                <line x1="20" y1="12" x2="23" y2="12" />
                              </g>
                            </svg>
                          ) : (forecast?.conditions.weatherCode ?? 0) >= 61 && (forecast?.conditions.weatherCode ?? 0) <= 82 ? (
                            <svg className="w-6 h-6 text-slate-500" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19.47 10.54A6 6 0 0012 4a5.99 5.99 0 00-5.47 3.54A5.002 5.002 0 007 17h12a4 4 0 00.47-7.96z"/>
                              <path d="M9 19v2M12 19v2M15 19v2" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
                            </svg>
                          ) : (
                            <svg className="w-6 h-6 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19.47 10.54A6 6 0 0012 4a5.99 5.99 0 00-5.47 3.54A5.002 5.002 0 007 17h12a4 4 0 00.47-7.96z"/>
                            </svg>
                          )}
                        </div>
                        {/* Wave Height */}
                        <div className="text-center flex-shrink-0">
                          <div className="text-lg font-bold text-blue-700 leading-tight">
                            {getHeight(forecast?.conditions.waveHeightFt)}
                            <span className="text-[10px]">{getHeightUnit()}</span>
                          </div>
                          <div className="text-[8px] text-slate-500">waves</div>
                        </div>
                        {/* Period */}
                        <div className="text-center flex-shrink-0">
                          <div className="text-xs font-semibold text-slate-700">{forecast?.conditions.swellPeriodSec || '--'}s</div>
                          <div className="text-[8px] text-slate-500">period</div>
                        </div>
                        {/* Wind */}
                        <div className="text-center flex-shrink-0">
                          <div className="text-xs font-semibold text-slate-700">
                            {getWindSpeed(forecast?.conditions.windSpeedKnots)}{getWindUnit()}
                          </div>
                          <div className="text-[8px] text-slate-500">{forecast?.conditions.windDirection || '--'}</div>
                        </div>
                      </div>
                      {/* Match indicator */}
                      <div className={`text-center py-1 rounded-md text-[10px] font-semibold flex-shrink-0 ${
                        (forecast?.conditions.waveHeightFt ?? 0) >= 2 && (forecast?.conditions.waveHeightFt ?? 0) <= 5 && (forecast?.conditions.windSpeedKnots ?? 20) < 15
                          ? 'bg-green-100 text-green-700'
                          : (forecast?.conditions.windSpeedKnots ?? 20) > 20 || (forecast?.conditions.waveHeightFt ?? 0) > 6
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                      }`}>
                        {(forecast?.conditions.waveHeightFt ?? 0) >= 2 && (forecast?.conditions.waveHeightFt ?? 0) <= 5 && (forecast?.conditions.windSpeedKnots ?? 20) < 15
                          ? 'Good'
                          : (forecast?.conditions.windSpeedKnots ?? 20) > 20 || (forecast?.conditions.waveHeightFt ?? 0) > 6
                            ? 'Challenging'
                            : 'Fair'}
                      </div>
                    </div>

                    {/* Tomorrow */}
                    <div className="flex-1 bg-gradient-to-b from-slate-50 to-slate-100 rounded-lg border border-slate-200 p-2 flex flex-col min-h-0">
                      <div className="text-center flex-shrink-0">
                        <div className="text-[9px] text-slate-500 font-medium uppercase tracking-wide">Tomorrow</div>
                        <div className="text-xs font-bold text-slate-800">{new Date(Date.now() + 86400000).toLocaleDateString('en-IL', { weekday: 'short' })}</div>
                      </div>
                      <div className="flex-1 flex flex-col items-center justify-center gap-1 my-1 min-h-0">
                        {/* Weather Icon */}
                        <div className="w-7 h-7 flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.47 10.54A6 6 0 0012 4a5.99 5.99 0 00-5.47 3.54A5.002 5.002 0 007 17h12a4 4 0 00.47-7.96z"/>
                          </svg>
                        </div>
                        {/* Wave Height */}
                        <div className="text-center flex-shrink-0">
                          <div className="text-lg font-bold text-slate-600 leading-tight">
                            {getHeight((forecast?.conditions.waveHeightFt ?? 3) * 0.9)}
                            <span className="text-[10px]">{getHeightUnit()}</span>
                          </div>
                          <div className="text-[8px] text-slate-500">waves</div>
                        </div>
                        {/* Period */}
                        <div className="text-center flex-shrink-0">
                          <div className="text-xs font-semibold text-slate-600">{forecast?.conditions.swellPeriodSec || '--'}s</div>
                          <div className="text-[8px] text-slate-500">period</div>
                        </div>
                        {/* Wind */}
                        <div className="text-center flex-shrink-0">
                          <div className="text-xs font-semibold text-slate-600">
                            {getWindSpeed((forecast?.conditions.windSpeedKnots ?? 10) * 0.8)}{getWindUnit()}
                          </div>
                          <div className="text-[8px] text-slate-500">{forecast?.conditions.windDirection || '--'}</div>
                        </div>
                      </div>
                      <div className="text-center py-1 rounded-md text-[10px] font-semibold bg-amber-100 text-amber-700 flex-shrink-0">
                        Fair
                      </div>
                    </div>

                    {/* Day After */}
                    <div className="flex-1 bg-gradient-to-b from-slate-50 to-slate-100 rounded-lg border border-slate-200 p-2 flex flex-col min-h-0">
                      <div className="text-center flex-shrink-0">
                        <div className="text-[9px] text-slate-500 font-medium uppercase tracking-wide">{new Date(Date.now() + 172800000).toLocaleDateString('en-IL', { weekday: 'short' })}</div>
                        <div className="text-xs font-bold text-slate-800">{new Date(Date.now() + 172800000).toLocaleDateString('en-IL', { day: 'numeric', month: 'short' })}</div>
                      </div>
                      <div className="flex-1 flex flex-col items-center justify-center gap-1 my-1 min-h-0">
                        {/* Weather Icon */}
                        <div className="w-7 h-7 flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="12" r="5" />
                            <g stroke="currentColor" strokeWidth="2" fill="none">
                              <line x1="12" y1="1" x2="12" y2="4" />
                              <line x1="12" y1="20" x2="12" y2="23" />
                              <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
                              <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
                              <line x1="1" y1="12" x2="4" y2="12" />
                              <line x1="20" y1="12" x2="23" y2="12" />
                            </g>
                          </svg>
                        </div>
                        {/* Wave Height */}
                        <div className="text-center flex-shrink-0">
                          <div className="text-lg font-bold text-slate-600 leading-tight">
                            {getHeight((forecast?.conditions.waveHeightFt ?? 3) * 1.1)}
                            <span className="text-[10px]">{getHeightUnit()}</span>
                          </div>
                          <div className="text-[8px] text-slate-500">waves</div>
                        </div>
                        {/* Period */}
                        <div className="text-center flex-shrink-0">
                          <div className="text-xs font-semibold text-slate-600">{((forecast?.conditions.swellPeriodSec ?? 8) + 1)}s</div>
                          <div className="text-[8px] text-slate-500">period</div>
                        </div>
                        {/* Wind */}
                        <div className="text-center flex-shrink-0">
                          <div className="text-xs font-semibold text-slate-600">
                            {getWindSpeed((forecast?.conditions.windSpeedKnots ?? 10) * 0.7)}{getWindUnit()}
                          </div>
                          <div className="text-[8px] text-slate-500">{forecast?.conditions.windDirection || '--'}</div>
                        </div>
                      </div>
                      <div className="text-center py-1 rounded-md text-[10px] font-semibold bg-green-100 text-green-700 flex-shrink-0">
                        Good
                      </div>
                    </div>
                  </div>
                )}

                {/* Weather Tab */}
                {activeTab === 'weather' && (
                  <div className="flex-1 flex flex-col gap-1.5 min-h-0">
                    {/* Weather Description Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg p-2.5 text-white flex items-center justify-between flex-shrink-0">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            {(forecast.conditions.weatherCode ?? 0) <= 3 ? (
                              <circle cx="12" cy="12" r="5" />
                            ) : (forecast.conditions.weatherCode ?? 0) >= 61 && (forecast.conditions.weatherCode ?? 0) <= 82 ? (
                              <path d="M12 2C9.24 2 7 4.24 7 7c0 .69.14 1.35.39 1.95C5.45 9.67 4 11.46 4 13.5 4 16.54 6.46 19 9.5 19h6c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96C15.28 7.14 13.81 6 12 6c-.35 0-.69.04-1.02.11A3.003 3.003 0 0012 2zm-2 15l2-4-2-1 3-4v4l-2 1-1 4z"/>
                            ) : (
                              <path d="M19.47 10.54A6 6 0 0012 4a5.99 5.99 0 00-5.47 3.54A5.002 5.002 0 007 17h12a4 4 0 00.47-7.96z"/>
                            )}
                          </svg>
                          <span className="font-medium text-xs">{forecast.conditions.weatherDescription || 'Clear'}</span>
                        </div>
                        <div className="text-[10px] opacity-80 mt-0.5">
                          {(() => {
                            const beachName = userProfile?.homeBeach?.name || '';
                            if (beachName.includes('Tel Aviv')) return 'Tel Aviv';
                            if (beachName.includes('Herzliya')) return 'Herzliya';
                            if (beachName.includes('Haifa')) return 'Haifa';
                            if (beachName.includes('Netanya')) return 'Netanya';
                            if (beachName.includes('Ashkelon')) return 'Ashkelon';
                            if (beachName.includes('Ashdod')) return 'Ashdod';
                            if (beachName.includes('Bat Yam')) return 'Bat Yam';
                            if (beachName.includes('Rishon')) return 'Rishon LeZion';
                            if (beachName.includes('Hadera')) return 'Hadera';
                            if (beachName.includes('Caesarea')) return 'Caesarea';
                            if (beachName.includes('Nahariya')) return 'Nahariya';
                            return userProfile?.homeBeach?.region || 'Tel Aviv';
                          })()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{getTemp(forecast.conditions.airTempF ?? 70)}{getTempUnit()}</div>
                        <div className="text-[10px] opacity-80">Feels {getTemp(forecast.conditions.feelsLikeF ?? 70)}{getTempUnit()}</div>
                      </div>
                    </div>

                    {/* Weather Grid - 2x2 */}
                    <div className="flex-1 grid grid-cols-2 gap-1.5 min-h-0">
                      <div className="bg-amber-50 rounded-lg p-2 border border-amber-200 flex flex-col justify-between">
                        <div className="text-[10px] text-amber-700 font-medium uppercase">Wind</div>
                        <div>
                          <div className="text-base font-bold text-amber-900">
                            {getWindSpeed(parseFloat(forecast.conditions.windSpeedKnots.toString()))}
                            <span className="text-[10px] font-normal ml-0.5">{getWindUnit()}</span>
                            <span className="text-[10px] font-normal ml-1 text-amber-600">{forecast.conditions.windDirection}</span>
                          </div>
                          {forecast.conditions.windGustsKnots && (
                            <div className="text-[10px] text-amber-600">Gusts {getWindSpeed(parseFloat(forecast.conditions.windGustsKnots.toString()))}</div>
                          )}
                        </div>
                      </div>

                      <div className="bg-cyan-50 rounded-lg p-2 border border-cyan-200 flex flex-col justify-between">
                        <div className="text-[10px] text-cyan-700 font-medium uppercase">Water</div>
                        <div className="text-base font-bold text-cyan-900">{getTemp(forecast.conditions.waterTempF)}{getTempUnit()}</div>
                      </div>

                      <div className="bg-purple-50 rounded-lg p-2 border border-purple-200 flex flex-col justify-between">
                        <div className="text-[10px] text-purple-700 font-medium uppercase">UV Index</div>
                        <div className="text-base font-bold text-purple-900">
                          {(forecast.conditions.uvIndex ?? 0).toFixed(0)}
                          <span className="text-[10px] font-normal ml-1">
                            {(forecast.conditions.uvIndex ?? 0) >= 8 ? 'Very High' : 
                             (forecast.conditions.uvIndex ?? 0) >= 6 ? 'High' : 
                             (forecast.conditions.uvIndex ?? 0) >= 3 ? 'Moderate' : 'Low'}
                          </span>
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-lg p-2 border border-slate-200 flex flex-col justify-between">
                        <div className="text-[10px] text-slate-600 font-medium uppercase">Humidity</div>
                        <div className="text-base font-bold text-slate-900">{forecast.conditions.humidity || 0}<span className="text-[10px] font-normal">%</span></div>
                      </div>
                    </div>

                    {/* Sunrise/Sunset - compact */}
                    {forecast.conditions.sunrise && forecast.conditions.sunset && (
                      <div className="flex justify-between bg-slate-50 rounded-lg px-3 py-1.5 border border-slate-200 text-[10px] flex-shrink-0">
                        <div className="flex items-center gap-1">
                          <svg className="w-3 h-3 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path d="M12 3v3m0 0a5 5 0 015 5m-5-5a5 5 0 00-5 5m-5 0h2m16 0h-2" />
                          </svg>
                          <span className="text-slate-600">{new Date(forecast.conditions.sunrise).toLocaleTimeString('en-IL', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-3 h-3 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path d="M12 21v-3m0 0a5 5 0 01-5-5m5 5a5 5 0 005-5m5 0h-2M4 13h2" />
                          </svg>
                          <span className="text-slate-600">{new Date(forecast.conditions.sunset).toLocaleTimeString('en-IL', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Gear Tab */}
                {activeTab === 'wetsuit' && (
                  <div className="flex-1 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 text-white flex flex-col items-center justify-center">
                    <svg className="w-16 h-16 mb-3 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <div className="text-sm text-slate-400 mb-2">Water: {getTemp(forecast.conditions.waterTempF)}{getTempUnit()}</div>
                    <div className="text-2xl font-bold">
                      {forecast.conditions.waterTempF >= 75 ? 'Board Shorts' : 
                       forecast.conditions.waterTempF >= 65 ? 'Spring Suit' : 
                       forecast.conditions.waterTempF >= 55 ? 'Full Suit' : 'Winter Gear'}
                    </div>
                    <div className="text-sm text-slate-400 mt-2">
                      {forecast.conditions.waterTempF >= 75 ? 'No wetsuit needed' : 
                       forecast.conditions.waterTempF >= 65 ? '2-3mm recommended' : 
                       forecast.conditions.waterTempF >= 55 ? '4-5mm recommended' : '5-6mm + hood & booties'}
                    </div>
                  </div>
                )}

                {/* Map Tab */}
                {activeTab === 'map' && (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-slate-400">
                      <svg className="w-16 h-16 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      <div className="text-lg font-medium">Wave Map</div>
                      <div className="text-sm mt-1">Coming Soon</div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* BOTTOM SECTION - Session Suggestions */}
        <div className="bg-white rounded-xl p-3 flex-shrink-0 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 7a5 5 0 015 5h2a7 7 0 00-14 0h2a5 5 0 015-5zm0-4V1h-1v2h1zm0 20v-2h-1v2h1zM4.22 5.64l1.42-1.42.7.71-1.41 1.41-.71-.7zm14.14 0l-.7.71 1.41 1.41.71-.7-1.42-1.42zM1 12h2v1H1v-1zm19 0h2v1h-2v-1z"/>
            </svg>
            <span className="text-sm font-semibold text-slate-800">Session Finder</span>
          </div>
          
          {/* Suggestion Cards - Horizontal Scroll */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory">
            {/* Perfect Match - Based on schedule + skill + home beach */}
            {(() => {
              const slot = userProfile.availabilitySchedule?.[0];
              const hasScheduledSlot = slot && slot.day;
              const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
              const today = new Date().getDay();
              const slotDayIndex = slot ? days.indexOf(slot.day) : -1;
              const isToday = slotDayIndex === today;
              const isTomorrow = slotDayIndex === (today + 1) % 7;
              const dayLabel = isToday ? 'Today' : isTomorrow ? 'Tomorrow' : slot?.day?.slice(0, 3);
              const baseHeight = forecast?.conditions.waveHeightFt || 0;
              
              return hasScheduledSlot ? (
                <div className="flex-shrink-0 w-[140px] h-[100px] bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg p-3 snap-start flex flex-col">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                    <span className="text-[10px] text-emerald-600 font-medium uppercase">Perfect</span>
                  </div>
                  <div className="text-sm font-semibold text-slate-800 truncate" title={userProfile.homeBeach?.name}>
                    {userProfile.homeBeach?.name || 'Home Beach'}
                  </div>
                  <div className="text-xs text-slate-500 flex-1">
                    {dayLabel} · {slot?.time || 'Morning'}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-slate-800">{getHeight(baseHeight)}<span className="text-[10px] ml-0.5">{getHeightUnit()}</span></span>
                    <span className="bg-emerald-500 text-white px-1.5 py-0.5 rounded text-xs font-bold">{getSuitability()}%</span>
                  </div>
                </div>
              ) : null;
            })()}

            {/* Explore - Other beach with potentially better conditions */}
            {(() => {
              const baseHeight = forecast?.conditions.waveHeightFt || 0;
              const exploreHeight = baseHeight + 0.5;
              return (
                <div className="flex-shrink-0 w-[140px] h-[100px] bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-3 snap-start flex flex-col">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span className="text-[10px] text-blue-600 font-medium uppercase">Explore</span>
                  </div>
                  <div className="text-sm font-semibold text-slate-800 truncate">Hilton Beach</div>
                  <div className="text-xs text-slate-500 flex-1">Better swell · 15 min</div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-slate-800">{getHeight(exploreHeight)}<span className="text-[10px] ml-0.5">{getHeightUnit()}</span></span>
                    <span className="bg-blue-500 text-white px-1.5 py-0.5 rounded text-xs font-bold">{Math.min(99, getSuitability() + 5)}%</span>
                  </div>
                </div>
              );
            })()}

            {/* Challenge - Push your limits */}
            {(() => {
              const baseHeight = forecast?.conditions.waveHeightFt || 0;
              const challengeHeight = baseHeight + 1.5;
              return (
                <div className="flex-shrink-0 w-[140px] h-[100px] bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-lg p-3 snap-start flex flex-col">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                    <span className="text-[10px] text-orange-600 font-medium uppercase">Challenge</span>
                  </div>
                  <div className="text-sm font-semibold text-slate-800 truncate">Dolphinarium</div>
                  <div className="text-xs text-slate-500 flex-1">Bigger · Expert</div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-slate-800">{getHeight(challengeHeight)}<span className="text-[10px] ml-0.5">{getHeightUnit()}</span></span>
                    <span className="bg-orange-500 text-white px-1.5 py-0.5 rounded text-xs font-bold">{Math.max(40, getSuitability() - 25)}%</span>
                  </div>
                </div>
              );
            })()}

            {/* Chill - Easy session */}
            {(() => {
              const baseHeight = forecast?.conditions.waveHeightFt || 0;
              const chillHeight = Math.max(1, baseHeight - 0.5);
              return (
                <div className="flex-shrink-0 w-[140px] h-[100px] bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-lg p-3 snap-start flex flex-col">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-violet-500 rounded-full"></div>
                    <span className="text-[10px] text-violet-600 font-medium uppercase">Chill</span>
                  </div>
                  <div className="text-sm font-semibold text-slate-800 truncate">Gordon Beach</div>
                  <div className="text-xs text-slate-500 flex-1">Mellow · All levels</div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-slate-800">{getHeight(chillHeight)}<span className="text-[10px] ml-0.5">{getHeightUnit()}</span></span>
                    <span className="bg-violet-500 text-white px-1.5 py-0.5 rounded text-xs font-bold">{Math.min(99, getSuitability() + 10)}%</span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
