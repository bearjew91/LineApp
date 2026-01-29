// Core types for LineApp

export enum SurfingLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

export enum SessionStatus {
  PLANNED = 'planned',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// User & Profile
export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  homeBeach: Beach;
  surfingLevel: SurfingLevel;
  preferences: UserPreferences;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Beach {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  region?: string;
  country?: string;
}

export interface UserPreferences {
  preferredBoardType?: string[];
  waveHeightMin?: number;
  waveHeightMax?: number;
  preferredWindDirection?: string;
  notificationSettings?: NotificationSettings;
}

export interface NotificationSettings {
  sessionInvites: boolean;
  friendActivity: boolean;
  forecastAlerts: boolean;
  nearbyActivity: boolean;
}

// Availability & Schedule
export interface UserAvailability {
  id: string;
  userId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm format
  endTime: string;
}

// Forecast & Weather
export interface SurfForecast {
  id: string;
  beachId: string;
  timestamp: Date;
  conditions: ForecastConditions;
  suitability: LevelSuitability; // AI-generated suitability for each level
  externalId?: string; // Reference to external API
  updatedAt: Date;
}

export interface ForecastConditions {
  // Wave data
  waveHeightFt: number;
  wavePeriodSec: number;
  waveDirection?: string;
  swellHeightFt?: number | null;
  swellPeriodSec?: number | null;
  swellDirection?: string | null;
  
  // Wind data
  windSpeedKnots: number;
  windGustsKnots?: number | null;
  windDirection: string;
  
  // Weather data
  airTempF?: number;
  feelsLikeF?: number;
  humidity?: number;
  uvIndex?: number;
  cloudCover?: number;
  precipitation?: number;
  weatherCode?: number;
  weatherDescription?: string;
  
  // Sun times
  sunrise?: string | null;
  sunset?: string | null;
  
  // Water & other
  tideHeight: number;
  waterTempF: number;
  confidence: number; // 0-100
}

export interface LevelSuitability {
  beginner: number;
  intermediate: number;
  advanced: number;
  expert: number;
}

// Sessions
export interface Session {
  id: string;
  creatorId: string;
  beachId: string;
  scheduledTime: Date;
  estimatedDurationMinutes: number;
  minLevel: SurfingLevel;
  maxLevel: SurfingLevel;
  maxParticipants: number;
  participants: SessionParticipant[];
  description?: string;
  status: SessionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionParticipant {
  userId: string;
  joinedAt: Date;
  status: 'confirmed' | 'pending' | 'declined';
}

// Feed & Posts
export interface FeedPost {
  id: string;
  userId: string;
  beachId: string;
  location: Location;
  mediaUrls: string[];
  caption?: string;
  tags?: string[];
  likes: number;
  comments: FeedComment[];
  expiresAt: Date;
  createdAt: Date;
}

export interface FeedComment {
  id: string;
  userId: string;
  text: string;
  createdAt: Date;
}

export interface Location {
  latitude: number;
  longitude: number;
}

// Relationships
export interface UserFollow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
}

// Recommendations
export interface SessionRecommendation {
  sessionId: string;
  score: number; // 0-100
  reasons: string[]; // Why this is recommended
  timestamp: Date;
}

export interface RecommendationContext {
  userId: string;
  currentForecast: SurfForecast;
  userAvailability: UserAvailability[];
  userHistory: Session[];
  friendSessions: Session[];
}
