import { SessionRecommendation, RecommendationContext, Session, SurfingLevel } from '@/types';

/**
 * AI-powered recommendation engine for surf sessions
 * Considers: user skill level, availability, forecast conditions, and friend activity
 */
export class RecommendationEngine {
  /**
   * Generate session recommendations for a user
   */
  static generateSessionRecommendations(
    context: RecommendationContext,
    availableSessions: Session[]
  ): SessionRecommendation[] {
    const recommendations: SessionRecommendation[] = [];

    for (const session of availableSessions) {
      const score = this.calculateSessionScore(context, session);
      if (score > 30) {
        // Only recommend if score > 30
        recommendations.push({
          sessionId: session.id,
          score,
          reasons: this.generateReasons(context, session, score),
          timestamp: new Date()
        });
      }
    }

    // Sort by score descending
    return recommendations.sort((a, b) => b.score - a.score);
  }

  /**
   * Calculate recommendation score (0-100) for a session
   */
  private static calculateSessionScore(
    context: RecommendationContext,
    session: Session
  ): number {
    let score = 50; // Base score

    // 1. Skill level match (0-30 points)
    const levelScore = this.calculateLevelMatch(context.userId, session);
    score += levelScore;

    // 2. Forecast suitability (0-25 points)
    const forecastScore = this.calculateForecastMatch(context.currentForecast, session);
    score += forecastScore;

    // 3. Availability match (0-20 points)
    const availabilityScore = this.calculateAvailabilityMatch(
      context.userAvailability,
      session.scheduledTime
    );
    score += availabilityScore;

    // 4. Social factor - friends joining (0-25 points)
    const friendScore = this.calculateFriendFactor(context, session);
    score += friendScore;

    // 5. Historical preference (0-10 points)
    const historyScore = this.calculateHistoryMatch(context.userHistory, session);
    score += historyScore;

    return Math.min(100, Math.max(0, score));
  }

  private static calculateLevelMatch(userId: string, session: Session): number {
    // Get user level from context (simplified)
    // In real app, fetch from database
    let score = 0;
    // More points if user level is within session range
    score = 25;
    return score;
  }

  private static calculateForecastMatch(forecast: any, session: Session): number {
    if (!forecast) return 0;

    const suitability = forecast.suitability[session.minLevel] || 0;
    return (suitability / 100) * 25; // Normalize to 0-25 points
  }

  private static calculateAvailabilityMatch(
    availability: any[],
    sessionTime: Date
  ): number {
    const dayOfWeek = sessionTime.getDay();
    const sessionHour = sessionTime.getHours();

    const isAvailable = availability.some(slot => {
      if (slot.dayOfWeek !== dayOfWeek) return false;

      const [startHour] = slot.startTime.split(':').map(Number);
      const [endHour] = slot.endTime.split(':').map(Number);

      return sessionHour >= startHour && sessionHour < endHour;
    });

    return isAvailable ? 20 : 0;
  }

  private static calculateFriendFactor(context: RecommendationContext, session: Session): number {
    // Check if any friends are in this session
    const friendsInSession = session.participants.filter(p =>
      context.userHistory.some(s => s.participants.some(p2 => p2.userId === p.userId))
    );

    return Math.min(25, friendsInSession.length * 8);
  }

  private static calculateHistoryMatch(userHistory: Session[], session: Session): number {
    // Give bonus points if user frequently visits this beach
    const beachVisits = userHistory.filter(s => s.beachId === session.beachId).length;
    return Math.min(10, beachVisits * 2);
  }

  private static generateReasons(
    context: RecommendationContext,
    session: Session,
    score: number
  ): string[] {
    const reasons: string[] = [];

    if (score > 80) reasons.push('Perfect conditions for your level');
    if (score > 60) reasons.push('Good wave forecast for your skill');

    const suitability = context.currentForecast?.suitability?.[session.minLevel] || 0;
    if (suitability > 75) reasons.push('Excellent forecast suitability');

    const hasFrequency = context.userHistory.filter(s => s.beachId === session.beachId).length > 0;
    if (hasFrequency) reasons.push('You often surf this beach');

    return reasons;
  }
}
