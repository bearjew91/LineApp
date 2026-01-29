# Getting Started with LineApp

## Quick Start (5 minutes)

### 1. Install Dependencies
```bash
cd lineapp
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env.local
# Edit .env.local with your settings (API keys, etc.)
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app!

---

### 2. API Integration

For development, we use the **Open-Meteo Marine API** (free, no API key required):
- **Documentation**: https://open-meteo.com/en/docs/marine-weather-api
- **Features**: Wave height, period, wind direction
- **Authentication**: None required! Just make HTTP requests
- **Rate Limits**: 10,000 requests/day (free tier - more than enough for development)

Example API request:
```bash
curl "https://marine-api.open-meteo.com/v1/marine?latitude=32.8753&longitude=34.7694&current=wave_height,wave_period,wind_speed_10m,wind_direction_10m"
```

**Implementation**: See [src/app/api/forecasts/[beachId]/route.ts](src/app/api/forecasts/[beachId]/route.ts) for how we integrate with Open-Meteo.

---

### Project Structure
```
src/
├── app/              # Next.js pages & API routes
├── components/       # Reusable React components
├── hooks/            # Custom React hooks
├── lib/              # Business logic & utilities
├── types/            # TypeScript definitions
└── styles/           # Styling
```

### Creating a New Feature

1. **Define Types** (`src/types/`)
   ```typescript
   export interface MyFeature {
     id: string;
     name: string;
     // ...
   }
   ```

2. **Create Components** (`src/components/`)
   ```tsx
   export function MyFeatureComponent() {
     return <div>Feature</div>;
   }
   ```

3. **Add Hooks** (`src/hooks/`)
   ```typescript
   export function useMyFeature() {
     // Hook logic
   }
   ```

4. **Implement Business Logic** (`src/lib/`)
   ```typescript
   export function calculateSomething() {
     // Logic
   }
   ```

5. **Add API Endpoints** (`src/app/api/`)
   ```typescript
   export async function GET(request: NextRequest) {
     // Handler
   }
   ```

### File Naming Conventions

- **Components**: PascalCase (e.g., `OnboardingFlow.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useForecast.ts`)
- **Utilities**: camelCase (e.g., `forecast.ts`)
- **Types**: PascalCase for interfaces (e.g., `index.ts`)
- **API Routes**: kebab-case (e.g., `/api/forecasts/[beachId]/route.ts`)

---

## Key Concepts

### 1. Surfing Levels
```typescript
enum SurfingLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}
```

Users select their level during onboarding. This is used for:
- Forecast suitability scoring
- Session recommendations
- Community matching

### 2. Forecast Suitability
```typescript
interface LevelSuitability {
  beginner: number;      // 0-100 score
  intermediate: number;
  advanced: number;
  expert: number;
}
```

Suitability scores are calculated based on:
- Wave height
- Wind speed
- Water temperature
- Wave period

**Higher score = Better conditions for that level**

Example: 4ft waves with 10kt winds
- Beginners: 45/100 (might be too big)
- Intermediates: 75/100 (great conditions)
- Advanced: 85/100 (good)
- Experts: 80/100 (okay, not challenging enough)

### 3. Session Recommendations
```typescript
interface SessionRecommendation {
  sessionId: string;
  score: number;        // 0-100 recommendation score
  reasons: string[];    // Why recommended
  timestamp: Date;
}
```

Recommendations use the `RecommendationEngine` which considers:
- User skill level match
- Current forecast suitability
- User's availability
- Friends joining
- Historical preferences

**Score > 30 = Worth recommending to user**

### 4. Feed Posts
Posts are visible for **12 hours** to users within a **5km radius** of the beach.

This encourages:
- Real-time community awareness
- Spontaneous session discovery
- Local beach activity tracking

---

## Component Examples

### Using ForecastDisplay
```tsx
import { ForecastDisplay } from '@/components/ForecastDisplay';
import { useForecast } from '@/hooks/useForecast';
import { SurfingLevel } from '@/types';

export function HomePage() {
  const { forecast, loading } = useForecast();

  return (
    <ForecastDisplay 
      forecast={forecast}
      userLevel={SurfingLevel.INTERMEDIATE}
      loading={loading}
    />
  );
}
```

### Using OnboardingFlow
```tsx
import { OnboardingFlow } from '@/components/OnboardingFlow';

export function OnboardingPage() {
  const handleComplete = async (data) => {
    // Save user data
    console.log('User onboarded:', data);
    // Redirect to dashboard
  };

  return <OnboardingFlow onComplete={handleComplete} />;
}
```

### Using Custom Hooks
```tsx
import { useBeachSearch } from '@/hooks/useBeachSearch';

export function BeachSearch() {
  const { beaches, loading, searchBeaches } = useBeachSearch();

  return (
    <>
      <input 
        onChange={(e) => searchBeaches(e.target.value)}
        placeholder="Search beaches..."
      />
      {beaches.map(beach => (
        <div key={beach.id}>{beach.name}</div>
      ))}
    </>
  );
}
```

---

## API Integration Examples

### Fetching Forecast
```typescript
const response = await fetch('/api/forecasts/beach_123');
const forecast = await response.json();
```

### Searching Beaches
```typescript
const response = await fetch(`/api/beaches/search?q=pipeline`);
const beaches = await response.json();
```

### Getting Recommendations
```typescript
const response = await fetch('/api/recommendations');
const recommendations = await response.json();
```

---

## Styling with Tailwind CSS

### Common Patterns

**Responsive Layout**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards */}
</div>
```

**Card Component**
```tsx
<div className="bg-white rounded-lg shadow-md p-6">
  {/* Content */}
</div>
```

**Button Styles**
```tsx
<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
  Click me
</button>
```

**Text Hierarchy**
```tsx
<h1 className="text-3xl font-bold">Title</h1>
<h2 className="text-xl font-semibold">Subtitle</h2>
<p className="text-gray-600">Body text</p>
```

---

## Testing Components

### Manual Testing Checklist
- [ ] Component renders without errors
- [ ] Responsive on mobile, tablet, desktop
- [ ] All interactive elements work
- [ ] Loading states display correctly
- [ ] Error states are handled
- [ ] API calls are made correctly

### Example API Test
```typescript
// Test fetching forecast
const response = await fetch('/api/forecasts/beach_1');
console.log(response.status); // Should be 200
const data = await response.json();
console.log(data.conditions.waveHeightFt); // Should have value
```

---

## Common Tasks

### Add a New Beach
1. Insert into database
2. Beach will be available in search
3. Can create forecasts for it

### Change Forecast Suitability Scoring
Edit `src/lib/forecast.ts`:
```typescript
function rateForecastForLevel(waveHeight, windSpeed, level) {
  // Adjust scoring logic here
}
```

### Add New User Preference
1. Add to `UserPreferences` type in `src/types/index.ts`
2. Update database schema
3. Update onboarding form
4. Use in recommendations

### Create New API Endpoint
```typescript
// src/app/api/your-feature/route.ts
export async function GET(request: NextRequest) {
  return NextResponse.json({ data: 'value' });
}
```

---

## Debugging Tips

### Check Browser Console
Open DevTools (F12) → Console tab for client-side errors

### Check Terminal Output
Development server logs appear in your terminal

### React DevTools
Install React DevTools browser extension to inspect components

### Network Tab
DevTools → Network tab to inspect API calls and responses

---

## Next Steps

1. ✅ Project is set up and running
2. 📋 Review [PROJECT_PLAN.md](../PROJECT_PLAN.md) for vision
3. 🏗️ Read [ARCHITECTURE.md](../ARCHITECTURE.md) for technical details
4. 🗺️ Check [FEATURE_ROADMAP.md](../FEATURE_ROADMAP.md) for timeline
5. 💻 Start building Phase 1 features!

---

## Need Help?

- **Project Plan**: See [PROJECT_PLAN.md](../PROJECT_PLAN.md)
- **Architecture**: See [ARCHITECTURE.md](../ARCHITECTURE.md)
- **Feature Details**: See [FEATURE_ROADMAP.md](../FEATURE_ROADMAP.md)
- **Code Issues**: Check browser console and terminal logs
- **API Questions**: See ARCHITECTURE.md API Endpoints section

---

Happy coding! 🌊🤙
