'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SurfingLevel } from '@/types';
import { useBeachSearch } from '@/hooks/useBeachSearch';

export default function SettingsPage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [editMode, setEditMode] = useState<'none' | 'beach' | 'level' | 'availability'>('none');
  const [searchQuery, setSearchQuery] = useState('');
  const { beaches, loading: searchLoading, searchBeaches } = useBeachSearch();
  const [tempSchedule, setTempSchedule] = useState<any[]>([]);

  useEffect(() => {
    const profile = localStorage.getItem('userProfile');
    if (profile) {
      const parsed = JSON.parse(profile);
      setUserProfile(parsed);
      setTempSchedule(parsed.availabilitySchedule || []);
    }
  }, []);

  const saveProfile = (updates: any) => {
    const newProfile = { ...userProfile, ...updates };
    localStorage.setItem('userProfile', JSON.stringify(newProfile));
    setUserProfile(newProfile);
    setEditMode('none');
  };

  const handleLogout = () => {
    localStorage.removeItem('userProfile');
    router.push('/');
  };

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center">
          <Link href="/dashboard" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>

        {/* Home Beach */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex justify-between items-start">
            <div>
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Home Beach</label>
              <p className="text-lg font-semibold text-slate-900 mt-1">{userProfile.homeBeach?.name}</p>
            </div>
            <button 
              onClick={() => setEditMode(editMode === 'beach' ? 'none' : 'beach')}
              className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
            >
              {editMode === 'beach' ? 'Cancel' : 'Edit'}
            </button>
          </div>
          
          {editMode === 'beach' && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <input
                type="text"
                placeholder="Search beaches..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  searchBeaches(e.target.value);
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              {searchLoading && <p className="text-sm text-slate-500 mt-2">Searching...</p>}
              <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                {beaches.map(beach => (
                  <button
                    key={beach.id}
                    onClick={() => {
                      saveProfile({ homeBeach: beach });
                      setSearchQuery('');
                    }}
                    className="w-full p-2 text-left rounded-lg hover:bg-blue-50 transition text-sm"
                  >
                    <span className="font-medium text-slate-900">{beach.name}</span>
                    <span className="text-slate-500 ml-2">{beach.region}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Surfing Level */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex justify-between items-start">
            <div>
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Surfing Level</label>
              <p className="text-lg font-semibold text-slate-900 mt-1 capitalize">{userProfile.surfingLevel}</p>
            </div>
            <button 
              onClick={() => setEditMode(editMode === 'level' ? 'none' : 'level')}
              className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
            >
              {editMode === 'level' ? 'Cancel' : 'Edit'}
            </button>
          </div>
          
          {editMode === 'level' && (
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
              {Object.values(SurfingLevel).map(level => (
                <button
                  key={level}
                  onClick={() => saveProfile({ surfingLevel: level })}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition ${
                    userProfile.surfingLevel === level
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 hover:border-blue-300 text-slate-700'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Availability */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex justify-between items-start">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Availability</label>
            <button 
              onClick={() => {
                if (editMode === 'availability') {
                  saveProfile({ availabilitySchedule: tempSchedule });
                } else {
                  setTempSchedule(userProfile.availabilitySchedule || []);
                  setEditMode('availability');
                }
              }}
              className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
            >
              {editMode === 'availability' ? 'Save' : 'Edit'}
            </button>
          </div>
          
          <div className="mt-3 space-y-2">
            {(editMode === 'availability' ? tempSchedule : userProfile.availabilitySchedule)?.map((slot: any, i: number) => (
              <div key={i} className="py-2 border-b border-slate-100 last:border-0">
                {editMode === 'availability' ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <select
                        value={slot.dayOfWeek}
                        onChange={(e) => {
                          const newSchedule = [...tempSchedule];
                          newSchedule[i].dayOfWeek = parseInt(e.target.value);
                          setTempSchedule(newSchedule);
                        }}
                        className="text-sm border border-slate-300 rounded px-2 py-1.5 flex-1"
                      >
                        {daysOfWeek.map((day, idx) => (
                          <option key={idx} value={idx}>{day}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => setTempSchedule(tempSchedule.filter((_, idx) => idx !== i))}
                        className="text-red-500 hover:text-red-600 ml-3 p-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => {
                          const newSchedule = [...tempSchedule];
                          newSchedule[i].startTime = e.target.value;
                          setTempSchedule(newSchedule);
                        }}
                        className="text-sm border border-slate-300 rounded px-2 py-1.5 flex-1"
                      />
                      <span className="text-slate-400 text-xs">to</span>
                      <input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => {
                          const newSchedule = [...tempSchedule];
                          newSchedule[i].endTime = e.target.value;
                          setTempSchedule(newSchedule);
                        }}
                        className="text-sm border border-slate-300 rounded px-2 py-1.5 flex-1"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-900">{daysOfWeek[slot.dayOfWeek]}</span>
                    <span className="text-slate-600 text-sm">{slot.startTime} - {slot.endTime}</span>
                  </div>
                )}
              </div>
            ))}
            
            {editMode === 'availability' && (
              <button
                onClick={() => setTempSchedule([...tempSchedule, { dayOfWeek: 0, startTime: '06:00', endTime: '12:00' }])}
                className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-medium border border-dashed border-slate-300 rounded-lg hover:border-blue-300 transition"
              >
                + Add Time Slot
              </button>
            )}
          </div>
        </div>

        {/* Units Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Units</label>
          
          <div className="mt-3 space-y-3">
            {/* Temperature Unit */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700">Temperature</span>
              <div className="flex bg-slate-100 rounded-lg p-0.5">
                <button
                  onClick={() => saveProfile({ tempUnit: 'C' })}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                    userProfile.tempUnit === 'C' || !userProfile.tempUnit
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  °C
                </button>
                <button
                  onClick={() => saveProfile({ tempUnit: 'F' })}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                    userProfile.tempUnit === 'F'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  °F
                </button>
              </div>
            </div>

            {/* Height Unit */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700">Wave Height</span>
              <div className="flex bg-slate-100 rounded-lg p-0.5">
                <button
                  onClick={() => saveProfile({ heightUnit: 'ft' })}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                    userProfile.heightUnit === 'ft' || !userProfile.heightUnit
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Feet
                </button>
                <button
                  onClick={() => saveProfile({ heightUnit: 'm' })}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                    userProfile.heightUnit === 'm'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Meters
                </button>
              </div>
            </div>

            {/* Wind Speed Unit */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700">Wind Speed</span>
              <div className="flex bg-slate-100 rounded-lg p-0.5">
                <button
                  onClick={() => saveProfile({ windUnit: 'kts' })}
                  className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition ${
                    userProfile.windUnit === 'kts' || !userProfile.windUnit
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  kts
                </button>
                <button
                  onClick={() => saveProfile({ windUnit: 'kmh' })}
                  className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition ${
                    userProfile.windUnit === 'kmh'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  km/h
                </button>
                <button
                  onClick={() => saveProfile({ windUnit: 'mph' })}
                  className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition ${
                    userProfile.windUnit === 'mph'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  mph
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition"
        >
          Log Out
        </button>
      </div>
    </main>
  );
}
