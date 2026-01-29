'use client';

import { useState } from 'react';
import { useBeachSearch } from '@/hooks/useBeachSearch';
import { SurfingLevel } from '@/types';

interface OnboardingStepProps {
  onComplete: (data: OnboardingData) => void;
}

export interface OnboardingData {
  homeBeach: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
  };
  surfingLevel: SurfingLevel;
  availabilitySchedule: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];
}

/**
 * Onboarding flow component for new users
 * Collects: home beach, surfing level, availability schedule
 */
export function OnboardingFlow({ onComplete }: OnboardingStepProps) {
  const [step, setStep] = useState<'beach' | 'level' | 'availability'>('beach');
  const [data, setData] = useState<Partial<OnboardingData>>({});

  const { beaches, loading: searchLoading, searchBeaches } = useBeachSearch();
  const [searchQuery, setSearchQuery] = useState('');

  const handleBeachSelect = (beach: any) => {
    setData({ ...data, homeBeach: beach });
    setStep('level');
  };

  const handleLevelSelect = (level: SurfingLevel) => {
    setData({ ...data, surfingLevel: level });
    setStep('availability');
  };

  const handleAvailabilityComplete = (schedule: OnboardingData['availabilitySchedule']) => {
    setData({ ...data, availabilitySchedule: schedule });
    onComplete(data as OnboardingData);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      {step === 'beach' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome to LineUp! 🌊</h2>
            <p className="text-gray-600">Let's set up your profile to personalize your experience.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">What's your home beach?</h3>
            <input
              type="text"
              placeholder="Search beaches..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                searchBeaches(e.target.value);
              }}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {searchLoading && <div className="mt-4">Searching...</div>}

            <div className="mt-4 space-y-2">
              {beaches.map(beach => (
                <button
                  key={beach.id}
                  onClick={() => handleBeachSelect(beach)}
                  className="w-full p-4 text-left border rounded-lg hover:bg-blue-50 transition"
                >
                  <div className="font-semibold">{beach.name}</div>
                  <div className="text-sm text-gray-600">{beach.region}, {beach.country}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 'level' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">What's your surfing level?</h3>
            <p className="text-gray-600 mb-4">This helps us personalize recommendations and connect you with compatible surfers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.values(SurfingLevel).map(level => (
              <button
                key={level}
                onClick={() => handleLevelSelect(level)}
                className="p-6 border-2 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-center"
              >
                <div className="text-xl font-bold capitalize">{level}</div>
                <div className="text-sm text-gray-600 mt-2">
                  {level === SurfingLevel.BEGINNER && 'New to surfing, learning basics'}
                  {level === SurfingLevel.INTERMEDIATE && 'Can paddle out safely, riding some waves'}
                  {level === SurfingLevel.ADVANCED && 'Comfortable in various conditions'}
                  {level === SurfingLevel.EXPERT && 'Seeking challenging conditions'}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'availability' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">When do you usually surf?</h3>
            <p className="text-gray-600 mb-4">This helps us recommend sessions that fit your schedule.</p>
          </div>

          <AvailabilityScheduler onComplete={handleAvailabilityComplete} />
        </div>
      )}
    </div>
  );
}

function AvailabilityScheduler({ onComplete }: { onComplete: (schedule: OnboardingData['availabilitySchedule']) => void }) {
  const [schedule, setSchedule] = useState<OnboardingData['availabilitySchedule']>([
    {
      dayOfWeek: 6, // Saturday
      startTime: '06:00',
      endTime: '12:00'
    }
  ]);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="space-y-4">
      {schedule.map((slot, index) => (
        <div key={index} className="border rounded-lg p-4 space-y-3">
          <select
            value={slot.dayOfWeek}
            onChange={(e) => {
              const newSchedule = [...schedule];
              newSchedule[index].dayOfWeek = parseInt(e.target.value);
              setSchedule(newSchedule);
            }}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {daysOfWeek.map((day, i) => (
              <option key={i} value={i}>{day}</option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="time"
              value={slot.startTime}
              onChange={(e) => {
                const newSchedule = [...schedule];
                newSchedule[index].startTime = e.target.value;
                setSchedule(newSchedule);
              }}
              className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="time"
              value={slot.endTime}
              onChange={(e) => {
                const newSchedule = [...schedule];
                newSchedule[index].endTime = e.target.value;
                setSchedule(newSchedule);
              }}
              className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      ))}

      <button
        onClick={() => onComplete(schedule)}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Complete Setup
      </button>
    </div>
  );
}
