import { SurfingLevel, LevelSuitability } from '@/types';

/**
 * Rates forecast conditions for each surfing level
 * Returns a score 0-100 indicating suitability
 */
export function rateForecastForLevel(
  waveHeightFt: number,
  windSpeedKnots: number,
  level: SurfingLevel
): number {
  let score = 100;

  // Wave height suitability by level
  switch (level) {
    case SurfingLevel.BEGINNER:
      if (waveHeightFt < 1) score -= 20; // Too flat
      if (waveHeightFt > 3) score -= 30; // Too big
      if (waveHeightFt > 4) score -= 50;
      break;

    case SurfingLevel.INTERMEDIATE:
      if (waveHeightFt < 1) score -= 15;
      if (waveHeightFt < 2) score -= 10;
      if (waveHeightFt > 6) score -= 20;
      if (waveHeightFt > 8) score -= 50;
      break;

    case SurfingLevel.ADVANCED:
      if (waveHeightFt < 1) score -= 10;
      if (waveHeightFt > 10) score -= 15;
      break;

    case SurfingLevel.EXPERT:
      if (waveHeightFt < 2) score -= 5; // Experts can handle anything
      break;
  }

  // Wind suitability
  if (windSpeedKnots > 20) score -= 15;
  if (windSpeedKnots > 30) score -= 35;

  // Ensure score is within bounds
  return Math.max(0, Math.min(100, score));
}

/**
 * Generate suitability scores for all levels
 */
export function generateLevelSuitability(
  waveHeightFt: number,
  windSpeedKnots: number
): LevelSuitability {
  return {
    beginner: rateForecastForLevel(waveHeightFt, windSpeedKnots, SurfingLevel.BEGINNER),
    intermediate: rateForecastForLevel(waveHeightFt, windSpeedKnots, SurfingLevel.INTERMEDIATE),
    advanced: rateForecastForLevel(waveHeightFt, windSpeedKnots, SurfingLevel.ADVANCED),
    expert: rateForecastForLevel(waveHeightFt, windSpeedKnots, SurfingLevel.EXPERT)
  };
}
