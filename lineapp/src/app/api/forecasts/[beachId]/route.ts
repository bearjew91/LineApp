import { NextRequest, NextResponse } from 'next/server';

/**
 * In-memory cache for forecast data
 * Key: beachId, Value: { data, timestamp }
 */
interface CacheEntry {
  data: any;
  timestamp: number;
}

const forecastCache = new Map<string, CacheEntry>();

// Cache TTL: 15 minutes (in milliseconds)
// Open-Meteo updates hourly, so 15 min is a good balance
const CACHE_TTL_MS = 15 * 60 * 1000;

/**
 * Check if cached data is still valid
 */
function getCachedForecast(beachId: string): any | null {
  const cached = forecastCache.get(beachId);
  if (!cached) return null;
  
  const now = Date.now();
  if (now - cached.timestamp > CACHE_TTL_MS) {
    // Cache expired, remove it
    forecastCache.delete(beachId);
    return null;
  }
  
  return cached.data;
}

/**
 * Store forecast in cache
 */
function setCachedForecast(beachId: string, data: any): void {
  forecastCache.set(beachId, {
    data,
    timestamp: Date.now()
  });
}

/**
 * GET /api/forecasts/:beachId
 * Returns current surf forecast for a specific beach
 * Uses Open-Meteo Marine API + Weather API (free, no API key required)
 * API Docs: 
 *   - https://open-meteo.com/en/docs/marine-weather-api
 *   - https://open-meteo.com/en/docs
 * 
 * Caching: Results are cached for 15 minutes to reduce API calls
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ beachId: string }> }
) {
  try {
    const { beachId } = await params;

    // Check cache first
    const cachedData = getCachedForecast(beachId);
    if (cachedData) {
      // Return cached data with cache indicator
      return NextResponse.json({
        ...cachedData,
        cached: true,
        cacheAge: Math.round((Date.now() - (forecastCache.get(beachId)?.timestamp || 0)) / 1000)
      });
    }

    // TODO: Get beach coordinates from database
    // For now using placeholder coordinates (you'll map beachId to lat/lng)
    const lat = 32.8753; // Example: Israel coast
    const lon = 34.7694;

    // Fetch from Open-Meteo Marine API (waves, wind at sea)
    const marineUrl = new URL('https://marine-api.open-meteo.com/v1/marine');
    marineUrl.searchParams.append('latitude', lat.toString());
    marineUrl.searchParams.append('longitude', lon.toString());
    marineUrl.searchParams.append('current', 'wave_height,wave_period,wave_direction,swell_wave_height,swell_wave_period,swell_wave_direction');
    marineUrl.searchParams.append('hourly', 'wave_height,wave_period,swell_wave_height');
    marineUrl.searchParams.append('timezone', 'auto');

    // Fetch from Open-Meteo Weather API (air temp, humidity, UV, etc.)
    const weatherUrl = new URL('https://api.open-meteo.com/v1/forecast');
    weatherUrl.searchParams.append('latitude', lat.toString());
    weatherUrl.searchParams.append('longitude', lon.toString());
    weatherUrl.searchParams.append('current', 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index');
    weatherUrl.searchParams.append('hourly', 'temperature_2m,precipitation_probability,weather_code,uv_index');
    weatherUrl.searchParams.append('daily', 'sunrise,sunset,uv_index_max');
    weatherUrl.searchParams.append('timezone', 'auto');

    // Fetch both APIs in parallel
    const [marineResponse, weatherResponse] = await Promise.all([
      fetch(marineUrl.toString()),
      fetch(weatherUrl.toString())
    ]);

    if (!marineResponse.ok) {
      throw new Error('Failed to fetch from Open-Meteo Marine API');
    }

    const marineData = await marineResponse.json();
    const marineCurrent = marineData.current;

    // Weather data is optional - use defaults if it fails
    let weatherCurrent: any = null;
    let weatherDaily: any = null;
    let weatherHourly: any = null;
    
    if (weatherResponse.ok) {
      const weatherData = await weatherResponse.json();
      weatherCurrent = weatherData.current;
      weatherDaily = weatherData.daily;
      weatherHourly = weatherData.hourly;
    }

    // Get weather description from WMO code
    const weatherDescription = weatherCurrent 
      ? getWeatherDescription(weatherCurrent.weather_code) 
      : 'Unknown';

    // Transform combined data to our format
    const forecast = {
      id: `forecast_${beachId}`,
      beachId,
      timestamp: new Date(),
      conditions: {
        // Wave data (from Marine API)
        waveHeightFt: (marineCurrent.wave_height * 3.281).toFixed(1),
        wavePeriodSec: marineCurrent.wave_period || 10,
        waveDirection: getWindDirection(marineCurrent.wave_direction || 0),
        swellHeightFt: marineCurrent.swell_wave_height ? (marineCurrent.swell_wave_height * 3.281).toFixed(1) : null,
        swellPeriodSec: marineCurrent.swell_wave_period || null,
        swellDirection: marineCurrent.swell_wave_direction ? getWindDirection(marineCurrent.swell_wave_direction) : null,
        
        // Wind data (from Weather API - more accurate for land/beach)
        windSpeedKnots: weatherCurrent 
          ? (weatherCurrent.wind_speed_10m * 0.539957).toFixed(1)
          : '0',
        windGustsKnots: weatherCurrent 
          ? (weatherCurrent.wind_gusts_10m * 0.539957).toFixed(1)
          : null,
        windDirection: weatherCurrent 
          ? getWindDirection(weatherCurrent.wind_direction_10m)
          : 'N',
        
        // Weather data (from Weather API)
        airTempF: weatherCurrent 
          ? Math.round(weatherCurrent.temperature_2m * 9/5 + 32)
          : 70,
        feelsLikeF: weatherCurrent 
          ? Math.round(weatherCurrent.apparent_temperature * 9/5 + 32)
          : 70,
        humidity: weatherCurrent?.relative_humidity_2m || 50,
        uvIndex: weatherCurrent?.uv_index || 0,
        cloudCover: weatherCurrent?.cloud_cover || 0,
        precipitation: weatherCurrent?.precipitation || 0,
        weatherCode: weatherCurrent?.weather_code || 0,
        weatherDescription,
        
        // Sun data
        sunrise: weatherDaily?.sunrise?.[0] || null,
        sunset: weatherDaily?.sunset?.[0] || null,
        
        // Water temp estimate (Mediterranean averages by season)
        waterTempF: getWaterTempEstimate(),
        
        tideHeight: 0, // Open-Meteo doesn't provide tide
        confidence: 85
      },
      // Hourly forecast for the day
      hourlyForecast: weatherHourly ? {
        times: weatherHourly.time?.slice(0, 24) || [],
        temps: weatherHourly.temperature_2m?.slice(0, 24) || [],
        precipProb: weatherHourly.precipitation_probability?.slice(0, 24) || [],
        weatherCodes: weatherHourly.weather_code?.slice(0, 24) || [],
        uvIndex: weatherHourly.uv_index?.slice(0, 24) || []
      } : null,
      suitability: {
        beginner: calculateSuitability('beginner', marineCurrent),
        intermediate: calculateSuitability('intermediate', marineCurrent),
        advanced: calculateSuitability('advanced', marineCurrent),
        expert: calculateSuitability('expert', marineCurrent)
      },
      updatedAt: new Date()
    };

    // Store in cache before returning
    setCachedForecast(beachId, forecast);

    return NextResponse.json({
      ...forecast,
      cached: false
    });
  } catch (error) {
    // If API fails but we have stale cached data, return it
    const { beachId } = await params;
    const staleCache = forecastCache.get(beachId);
    if (staleCache) {
      return NextResponse.json({
        ...staleCache.data,
        cached: true,
        stale: true,
        cacheAge: Math.round((Date.now() - staleCache.timestamp) / 1000)
      });
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch forecast' },
      { status: 500 }
    );
  }
}

/**
 * Convert wind direction degrees to compass direction
 */
function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

/**
 * Convert WMO weather code to description
 * https://open-meteo.com/en/docs - WMO Weather interpretation codes
 */
function getWeatherDescription(code: number): string {
  const weatherCodes: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail'
  };
  return weatherCodes[code] || 'Unknown';
}

/**
 * Estimate Mediterranean water temperature based on month
 * Israel coast averages
 */
function getWaterTempEstimate(): number {
  const month = new Date().getMonth(); // 0-11
  const waterTempsF = [
    63, // Jan
    61, // Feb
    62, // Mar
    65, // Apr
    70, // May
    76, // Jun
    81, // Jul
    83, // Aug
    82, // Sep
    78, // Oct
    72, // Nov
    66  // Dec
  ];
  return waterTempsF[month];
}

/**
 * Calculate surf suitability based on conditions
 */
function calculateSuitability(level: string, marine: any): number {
  const waveHeight = marine.wave_height || 0;
  const wavePeriod = marine.wave_period || 0;
  
  // Base scores by wave height for each level
  let score = 50;
  
  switch (level) {
    case 'beginner':
      // Beginners prefer small, gentle waves (0.3-0.8m)
      if (waveHeight >= 0.3 && waveHeight <= 0.8) score = 90;
      else if (waveHeight < 0.3) score = 60; // Too flat
      else if (waveHeight <= 1.2) score = 50; // Getting big
      else score = 20; // Too big
      break;
      
    case 'intermediate':
      // Intermediates like moderate waves (0.6-1.5m)
      if (waveHeight >= 0.6 && waveHeight <= 1.5) score = 85;
      else if (waveHeight < 0.6) score = 50;
      else if (waveHeight <= 2.0) score = 70;
      else score = 40;
      break;
      
    case 'advanced':
      // Advanced surfers prefer larger waves (1.0-2.5m)
      if (waveHeight >= 1.0 && waveHeight <= 2.5) score = 90;
      else if (waveHeight < 1.0) score = 40;
      else if (waveHeight <= 3.5) score = 80;
      else score = 60;
      break;
      
    case 'expert':
      // Experts want big waves (1.5m+)
      if (waveHeight >= 1.5 && waveHeight <= 4.0) score = 95;
      else if (waveHeight >= 1.0) score = 70;
      else score = 30; // Too small
      break;
  }
  
  // Bonus for good wave period (longer = better formed waves)
  if (wavePeriod >= 8) score = Math.min(100, score + 5);
  if (wavePeriod >= 12) score = Math.min(100, score + 5);
  
  return Math.round(score);
}
