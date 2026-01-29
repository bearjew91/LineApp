# LineUp 🌊

A mobile-first surfing community platform for Israel that provides personalized wave forecasts, session recommendations, and community features for surfers of all skill levels.

**Geographic Focus**: 🇮🇱 Israel (Launch Phase) → Mediterranean & Global (Expansion)

---

## Current Features (Implemented)

### 🏠 Home Dashboard
- **Real-time Conditions** - Live wave height, period, wind, direction, water temp, swell data
- **Flippable Smart Cards** - Tap any condition card to see educational explanations
- **Condition Rating** - Color-coded background (green/amber/red) based on suitability
- **3-Day Forecast Tab** - Quick view of upcoming conditions with weather icons
- **Weather Tab** - Current weather with city-specific display
- **Wetsuit Guide** - Temperature-based recommendations
- **Beach Map Tab** - Location view
- **Swipe Navigation** - Swipe between tabs

### 🔍 Session Finder
- **Perfect Match** - Based on your schedule and home beach
- **Explore** - Nearby beaches with better conditions
- **Challenge** - Bigger waves for skill progression
- **Chill** - Mellow sessions for easy days

### 🏖️ Beaches
- Near Me - Location-based beach discovery
- Search - Find beaches by name
- Map View - Visual beach browser
- Favorites - Quick access to saved spots

### 📷 Feed
- Live beach photos/videos with 3-hour TTL
- Location-verified uploads
- Filter by home beach or nearby
- AI photo verification (planned)

### 📅 Sessions
- Schedule surf sessions
- Open sessions for community
- Session history with ratings
- Post-session feedback

### ⚙️ Settings
- Unit preferences (°C/°F, ft/m, kts/km/h/mph)
- Home beach selection with Hebrew search
- Skill level configuration
- Availability schedule

### 📱 More Menu
- Profile management
- Surf Cams (coming soon)
- Tide Charts (coming soon)
- Find Lessons (coming soon)
- Photo Market (coming soon) - Photographers sell surf photos
- Help & Feedback

---

## Tech Stack

### Frontend (Implemented)
- **Framework**: Next.js 16 + React 19
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Navigation**: Bottom tab bar (5 sections)

### APIs (Implemented)
- **Wave Data**: Open-Meteo Marine API (free)
- **Weather Data**: Open-Meteo Weather API (free)
- **Caching**: 15-minute in-memory cache

### Backend (Planned)
- **Database**: PostgreSQL
- **Auth**: NextAuth.js or Clerk
- **Storage**: S3/Vercel Blob
- **Real-time**: Socket.io

---

## Project Structure

```
lineapp/
├── src/
│   ├── app/
│   │   ├── dashboard/       # Home screen
│   │   ├── beaches/         # Beach discovery
│   │   ├── feed/            # Community feed
│   │   ├── sessions/        # Session scheduling
│   │   ├── more/            # Menu & extras
│   │   ├── settings/        # Preferences
│   │   ├── onboarding/      # New user setup
│   │   └── api/             # API routes
│   ├── components/
│   │   ├── BottomNav.tsx    # Navigation
│   │   └── OnboardingFlow.tsx
│   ├── hooks/
│   │   ├── useBeachSearch.ts
│   │   └── useForecast.ts
│   └── lib/
│       ├── config.ts        # 12 Israeli beaches
│       └── forecast.ts      # Suitability scoring
├── public/
│   └── logo.png
└── package.json
```

---

## Getting Started

```bash
cd lineapp
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Israeli Beaches (12)

Tel Aviv: Frishman, Gordon, Hilton, Banana, Dolphinarium  
Herzliya: Acadia, Zvulun  
Haifa: Dado, Bat Galim  
Others: Netanya (Sironit), Ashkelon, Ashdod

---

## Documentation

- [ROADMAP.md](ROADMAP.md) - Feature roadmap & progress
