# G.I.F - Hyper-Performance AI Fitness App

G.I.F is a modern, AI-powered fitness mobile application built with React Native and Expo. It features a futuristic glassmorphic design and acts as an intelligent command center for users' bodies, offering personalized workout plans, biometric tracking, and daily readiness scores.

## Tech Stack

- **Framework:** Expo SDK 56 / React Native 0.85
- **Routing:** Expo Router (File-based routing)
- **Styling:** Tailwind CSS (NativeWind)
- **State Management:** Zustand
- **Authentication:** Clerk
- **Database:** Firebase Firestore
- **AI Engine:** Groq (Llama-3.1)

## Architecture Highlights

- **AI Workout Generation:** Uses Groq's blazing-fast API to generate personalized JSON workout routines based on the user's fitness goals, weight, and experience level.
- **Centralized Collections:** All Firebase Firestore collection names are strictly managed via `src/constants/collections.ts`.
- **Timezone-Safe Logic:** Uses a custom `getLocalDateString()` utility to handle daily streaks and readiness calculations safely across different time zones.
- **Optimized Queries:** Dashboard APIs are optimized with `limit()` and `orderBy()` to minimize Firestore reads and maximize performance.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Copy `.env.example` to `.env` and fill in your keys:
   - `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `EXPO_PUBLIC_FIREBASE_*` credentials
   - `EXPO_PUBLIC_GROQ_API_KEY`

3. **Start the development server:**
   ```bash
   npm start
   ```

## Key Documentation

- **[AGENTS.md](./AGENTS.md):** Strict coding guidelines, naming conventions, and architecture rules for developers and AI agents.
- **[DESIGN.md](./DESIGN.md):** The comprehensive Design System, covering the Futuristic Glassmorphism aesthetic, typography, and color tokens.
