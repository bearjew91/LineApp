// Configuration constants for LineApp

export const APP_CONFIG = {
  // Beach Feed
  FEED_EXPIRY_HOURS: 12,
  FEED_LOCATION_RADIUS_KM: 5,

  // Recommendations
  RECOMMENDATION_MIN_SCORE: 30,

  // Session
  MAX_SESSION_PARTICIPANTS: 20,
  SESSION_DURATION_MINUTES: 120,

  // Pagination
  DEFAULT_PAGE_SIZE: 20,

  // API
  FORECAST_UPDATE_INTERVAL_MINUTES: 60,
  CACHE_TTL_MINUTES: 30,

  // Notifications
  NOTIFICATION_BATCH_DELAY_MS: 5000
};

// Wave height categories for display
export const WAVE_HEIGHT_CATEGORIES = {
  TINY: { min: 0, max: 1, label: 'Tiny', emoji: '🌊' },
  SMALL: { min: 1, max: 3, label: 'Small', emoji: '🌊🌊' },
  MEDIUM: { min: 3, max: 6, label: 'Medium', emoji: '🌊🌊🌊' },
  LARGE: { min: 6, max: 10, label: 'Large', emoji: '🌊🌊🌊🌊' },
  HUGE: { min: 10, max: Infinity, label: 'Huge', emoji: '🌊🌊🌊🌊🌊' }
};
