# LineUp Feature Roadmap 🗺️

## Phase 1: Foundation ✅ COMPLETE
*Core surfing features that provide immediate value*

### ✅ Onboarding
- [x] Name, skill level, gear collection
- [x] Home beach selection (Hebrew search)
- [x] Unit preferences (°C/°F, ft/m, kts)
- [x] Weekly availability schedule
- [x] localStorage persistence

### ✅ Dashboard
- [x] Real-time wave conditions (Open-Meteo Marine API)
- [x] Weather data (Open-Meteo Weather API)
- [x] 15-minute cache with stale fallback
- [x] Flippable educational cards
- [x] Condition rating (green/amber/red background)
- [x] 3-day forecast tab
- [x] Weather, wetsuit, map tabs
- [x] Session Finder (Perfect/Explore/Challenge/Chill)

### ✅ Navigation
- [x] Bottom tab bar (5 sections)
- [x] Home, Beaches, Feed, Sessions, More
- [x] Smooth page transitions
- [x] Active state indicators

### ✅ Settings
- [x] Home beach configuration
- [x] Unit preference toggles
- [x] Skill level adjustment
- [x] Availability schedule

---

## Phase 2: Community 🚧 IN PROGRESS
*Social features that build engagement*

### 📷 Feed (Structure Complete)
- [x] UI structure with TTL badges
- [x] Filter tabs (all, home beach, nearby)
- [x] Upload FAB button
- [ ] Image upload with geolocation
- [ ] 3-hour TTL auto-expiration
- [ ] AI photo verification
- [ ] Like/comment system

### 📅 Sessions (Structure Complete)
- [x] UI structure with tabs
- [x] Upcoming/history/discover views
- [ ] Create session flow
- [ ] Session sharing (open/friends/private)
- [ ] RSVP system
- [ ] Post-session feedback & ratings
- [ ] Surf buddy matching

### 🏖️ Beaches (Structure Complete)
- [x] Near me / search / map / favorites tabs
- [ ] Beach detail pages
- [ ] Real-time crowd indicators
- [ ] User check-ins
- [ ] Live conditions per beach

---

## Phase 3: Premium 💎 PLANNED
*Monetization & advanced features*

### 📹 Surf Cams
- [ ] Public cam integrations
- [ ] Private cam subscriptions
- [ ] AI wave quality analysis
- [ ] Session recording clips

### 🎓 Lessons
- [ ] Instructor profiles & verification
- [ ] Booking & payment
- [ ] Skill progression tracking
- [ ] Personalized tips

### 📸 Photo Market
- [ ] Photographer profiles
- [ ] Session photo galleries
- [ ] Purchase & download
- [ ] Photographer earnings dashboard

### 📊 Advanced Analytics
- [ ] Personal session statistics
- [ ] Spot trends & best times
- [ ] Skill progression insights
- [ ] Beach comparison tools

---

## Phase 4: Scale 🌍 FUTURE
*Geographic expansion & optimization*

### 🌐 Expansion
- [ ] Mediterranean region
- [ ] European surf destinations
- [ ] Global beach database

### 🔧 Technical
- [ ] Native mobile app (React Native)
- [ ] Push notifications
- [ ] Offline mode
- [ ] PWA installation

---

## Current Sprint Focus

1. **Feed functionality** - Image upload with geo-verification
2. **Session creation** - Full flow with sharing options
3. **Beach details** - Deep dive pages with full forecasts
4. **Backend setup** - Database, auth, file storage

---

## Tech Debt & Improvements

- [ ] Error boundaries for API failures
- [ ] Loading skeletons for all sections
- [ ] Accessibility audit (ARIA labels)
- [ ] Performance optimization
- [ ] Test coverage
- [ ] CI/CD pipeline
