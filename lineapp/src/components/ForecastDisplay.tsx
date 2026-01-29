'use client';

import { SurfForecast, SurfingLevel } from '@/types';
import { WAVE_HEIGHT_CATEGORIES } from '@/lib/config';

interface ForecastDisplayProps {
  forecast: SurfForecast | null;
  userLevel: SurfingLevel;
  loading?: boolean;
}

/**
 * Displays personalized surf forecast based on user's skill level
 */
export function ForecastDisplay({ forecast, userLevel, loading }: ForecastDisplayProps) {
  if (loading) {
    return <div className="p-6 text-center">Loading forecast...</div>;
  }

  if (!forecast) {
    return <div className="p-6 text-center text-gray-500">No forecast data available</div>;
  }

  const { waveHeightFt, wavePeriodSec, windSpeedKnots, windDirection, waterTempF } = forecast.conditions;
  const suitability = forecast.suitability[userLevel] || 0;

  // Determine wave height category
  const waveCategory = Object.values(WAVE_HEIGHT_CATEGORIES).find(
    cat => waveHeightFt >= cat.min && waveHeightFt < cat.max
  );

  // Color coding based on suitability
  let suitabilityColor = 'text-red-600';
  let suitabilityBg = 'bg-red-100';
  if (suitability >= 70) {
    suitabilityColor = 'text-green-600';
    suitabilityBg = 'bg-green-100';
  } else if (suitability >= 50) {
    suitabilityColor = 'text-yellow-600';
    suitabilityBg = 'bg-yellow-100';
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Surf Forecast</h3>
        <div className={`text-sm font-semibold px-3 py-1 rounded-full ${suitabilityBg}`}>
          <span className={suitabilityColor}>{suitability}% Suitability</span>
        </div>
      </div>

      {/* Main conditions grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">Wave Height</div>
          <div className="text-3xl font-bold mt-1">{waveHeightFt}</div>
          <div className="text-xs text-gray-500 mt-1">ft {waveCategory?.label}</div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">Period</div>
          <div className="text-3xl font-bold mt-1">{wavePeriodSec}</div>
          <div className="text-xs text-gray-500 mt-1">seconds</div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">Wind</div>
          <div className="text-3xl font-bold mt-1">{windSpeedKnots}</div>
          <div className="text-xs text-gray-500 mt-1">{windDirection} {Math.round(windSpeedKnots)} kts</div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">Water Temp</div>
          <div className="text-3xl font-bold mt-1">{waterTempF}°</div>
          <div className="text-xs text-gray-500 mt-1">Fahrenheit</div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">Confidence</div>
          <div className="text-3xl font-bold mt-1">{forecast.conditions.confidence}%</div>
          <div className="text-xs text-gray-500 mt-1">Forecast accuracy</div>
        </div>
      </div>

      {/* Suitability by level */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-semibold mb-3">Suitability by Level</h4>
        <div className="space-y-2">
          {Object.entries(forecast.suitability).map(([level, score]) => (
            <div key={level} className="flex items-center space-x-3">
              <span className="w-24 text-sm font-medium capitalize">{level}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${score}%` }}
                />
              </div>
              <span className="text-sm font-semibold w-12 text-right">{score}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendation message */}
      <div className={`rounded-lg p-4 text-sm ${suitabilityBg}`}>
        <span className={suitabilityColor}>
          {suitability >= 70 && "🤙 Perfect conditions for your level!"}
          {suitability >= 50 && suitability < 70 && "✨ Pretty good conditions for you."}
          {suitability < 50 && "⚠️ Conditions might be challenging for your level."}
        </span>
      </div>
    </div>
  );
}
