# gif-app — Expo SDK 55 / React Native 0.83.6

## Commands

| Command | Action |
|---------|--------|
| `npm start` | Start Expo dev server |
| `npm run web` | Start for web |
| `npm run android` | Start for Android |
| `npm run ios` | Start for iOS |
| `npm run lint` | Run `expo lint` |

No test framework is configured.

## Architecture

- **Entrypoint**: `package.json` → `"main": "expo-router/entry"` (file-based routing)
- **Routes**: `src/app/` — `(auth)/`, `(onboarding)/`, `(tabs)/` with stack & tab navigators
- **Styling**: **Tailwind CSS (NativeWind v4)** — `tailwind.config.js` extends with custom colors (neon-green, electric-blue), fonts (Montserrat, Inter, JetBrains Mono), custom font sizes, spacing scale, border radius. Uses `nativewind/preset` and `@gluestack-ui/nativewind-utils/tailwind-plugin`. Entry CSS: `src/global.css` (includes Google Fonts import). Babel: `jsxImportSource: "nativewind"` + `react-native-css-interop` + `react-native-reanimated/plugin`. Metro: `withNativeWind` wrapper + SVG transformer (`react-native-svg-transformer`).
- **State Management**: **Zustand** for UI state (filters, onboarding drafts, session machine). **TanStack React Query** (`@tanstack/react-query 5.100.14`) for server-state caching & mutations.
- **Validation**: **Zod** (`^4.4.3`) schemas + **react-hook-form** (`^7.76.1`) + `@hookform/resolvers` for forms (auth, onboarding).
- **Theme**: `src/constants/theme.ts` — light/dark colors, spacing scale, font definitions.
- **Hooks**: `src/hooks/` — `use-color-scheme.ts`, `use-theme.ts`, `use-difficulty-tone.ts`.
- **Path aliases**: `@/` → `src/*`, `@/assets/*` → `assets/*`.

## Routes

| Group | File | Screen |
|---|---|---|
| `(auth)/` | `sign-in.tsx` | Sign-in (email/password + Google OAuth via Clerk) |
| | `sign-up.tsx` | Sign-up (email + verification code + Google OAuth) |
| `(onboarding)/` | `setup-profile.tsx` | Step 1: Personal info (name, gender, DOB, weight, height) |
| | `setup-goal.tsx` | Step 2: Goals (fitness goal, experience level, days/week) |
| `(tabs)/` | `index.tsx` | **Home Dashboard** — AI greeting, readiness gauge, streak, today's workout, recovery map |
| | `coach.tsx` | **Coach** — Placeholder ("Coming soon...") |
| | `profile.tsx` | **Profile** — Avatar, personal info, training goals, sign out |
| | `workout/index.tsx` | **Workout Hub** — Exercise Library tab + AI Plan tab |
| | `workout/[id].tsx` | Exercise detail (currently placeholder) |
| | `workout/guide/[id].tsx` | Exercise guide (YouTube video, execution steps, mistakes, alternatives) |
| | `workout/active-session.tsx` | Active workout session (state-machine driven, TTS, haptics, timer) |
| | `workout/session-complete.tsx` | Session complete summary with energy/intensity ratings |
| | `workout/create-plan.tsx` | AI plan generation via Groq API |
| | `progress/index.tsx` | **Progress Dashboard** — consistency map, volume chart, recovery, AI insight |
| | `progress/history.tsx` | Workout history (filters, search, pagination, calendar) |
| | `progress/session-details.tsx` | Completed session detail with exercise logs |

## Feature Modules

| Feature | Location | Description |
|---|---|---|
| **Auth** | `src/features/auth/` | Sign-in/sign-up forms with Zod validation, Clerk SSO (Google OAuth). Uses `react-hook-form`. |
| **Onboarding** | `src/features/onboarding/` | 2-step wizard (profile → goals). Zustand draft store preserves state across steps. Saves to Clerk `unsafeMetadata`. |
| **Home** | `src/features/home/` | Dashboard aggregating: AI greeting (time-of-day), readiness score (from last session recency + intensity), streak (consecutive days from last 30 sessions), today's workout card (AI plan or pre-set routine), muscle recovery map. |
| **Exercise Library** | `src/features/exercise-library/` | Exercise catalog with search, muscle group pills, advanced filter (body parts, category, difficulty). Zustand filter store. 1hr React Query stale time. |
| **Exercise Guide** | `src/features/exercise-guide/` | Exercise detail with YouTube embed (`react-native-youtube-iframe`), execution steps, common mistakes, alternatives, muscle visualization (`react-native-body-highlighter`). 30min stale time. |
| **Workout Session** | `src/features/workout-session/` | Active session state machine (PREPARING → ACTIVE → RESTING → COMPLETED). Set tracking, rest timer, TTS voice guidance, haptics, keep-awake. Pre-fills weights from previous session. Saves to Firestore. |
| **History** | `src/features/history/` | Paginated workout history with time view (Week/Month/All), date picker, search, type filter (PUSH/PULL/LEGS). Zustand filter store. Session details view. |
| **Progress** | `src/features/progress/` | Analytics: 18-week consistency grid, volume-over-time chart, 7-day recovery/intensity chart, AI text insight, health metrics (HRV, sleep score). |
| **Profile / AI** | `src/features/profile/` | Profile header, editable personal info & goals (reuses onboarding components). AI service uses Groq API (llama-3.3-70b-versatile) to generate personalized weekly workout plans, saved to `user_ai_plans` Firestore collection + SecureStore cache. |

## UI Components

### Shared (`src/components/`)

| Component | Description |
|---|---|
| `AppHeader` | Top bar: avatar, title ("G.I.F"), notification bell (unwired) |
| `AnimatedSplashOverlay` | Blue splash animation on launch (Reanimated keyframes) |
| `AuthLoadingOverlay` | Full-screen loading with logo + animated progress bar |
| `ThemedText` | `<Text>` wrapper with preset variants (title, subtitle, link, code, etc.) |
| `ThemedView` | `<View>` wrapper with theme background color |
| `ExternalLink` | Link opening in-app browser (`expo-web-browser`) |

### UI Kit (`src/components/ui/`)

| Component | Variants / Features |
|---|---|
| **Button** | Solid (neon green), outline (electric blue), link — Gluestack-style TVA |
| **Input** | Focus border (electric blue), error state styling |
| **Radio / RadioGroup** | Gluestack-based radio group with indicator |
| **Select** | Bottom sheet modal with checkmark indicator |
| **FilterTag** | Pill toggle (checked/unchecked) for filter UIs |
| **Collapsible** | Expandable section with chevron + fade animation |
| **Icon** | 40+ inline SVGs (Arrow, Bell, Calendar, Check, Clock, Close, Edit, Heart, Search, Settings, Star, Trash, etc.) |

## Hooks

| File | Purpose |
|---|---|
| `src/hooks/use-color-scheme.ts` | Re-exports `useColorScheme` from React Native |
| `src/hooks/use-theme.ts` | Returns `Colors[scheme]` (light/dark colors from theme constants) |
| `src/hooks/use-difficulty-tone.ts` | Returns Tailwind classes (bg, border, text) by difficulty (beginner=green, intermediate=orange, advanced=red) |
| Feature hooks | `useHomeDashboard`, `useExercisesFilter`, `useFilteredExercisesCount`, `useRoutineWithExercises`, `useSaveWorkoutSession` |

## Zustand Stores

| Store | File | State Machine / State |
|---|---|---|
| `useExerciseLibraryStore` | `features/exercise-library/store/` | Filters (muscleGroup, bodyParts, category, difficulty), selectedExerciseId |
| `useOnboardingDraftStore` | `features/onboarding/store/` | Hydrated flag, profile (step 1), goal/level/daysPerWeek (step 2) |
| `useHistoryStore` | `features/history/store/` | TimeView, selectedDate, searchQuery, selectedFilter |
| `useWorkoutSessionStore` | `features/workout-session/store/` | PREPARING → ACTIVE → RESTING → COMPLETED. Tracks routine, exercises, sets, sessionStartedAt, sessionSaved flag. Actions: startSession, updateSet, completeCurrentSet, skipRest, getPayloadLogs. |

## React Query

- **Key enums**: `EHomeQueryKeys`, `exerciseLibraryQueryKeys`, `exerciseGuideQueryKeys`, `EWorkoutSessionQueryKeys`, `historyQueryKey`, `progressQueryKey`
- **Stale time**: Dashboards 5min, routines 1h, guides 30min, session details 10min
- **Mutations**: `useSaveWorkoutSession` (injects userId from Clerk, writes to `workout_sessions`)
- Invalidates: home dashboard queries after session save

## Key Interfaces & Enums

| File | Exports |
|---|---|
| `src/interfaces/profile.interface.ts` | `IUserProfile` (gender, dateOfBirth, weightKg, heightCm, goal, level, daysPerWeek, onboarded) |
| `src/interfaces/workout-routine.interface.ts` | `IWorkoutRoutine` (name, focus, durationMin, intensity, load, exerciseIds, muscleGroups, dayOfWeek) |
| `src/interfaces/workout-session.interface.ts` | `IWorkoutSession`, `IExerciseLog`, `ISetLog`, `EnergyLevel` (drained \| steady \| charged) |
| `src/constants/profile.constant.ts` | `EFitnessGoal` (LoseWeight/BuildMuscle/ImproveEndurance/GeneralFitness), `EExperienceLevel` (Beginner/Intermediate/Advanced), `EGender` (Male/Female/Other) |
| `src/features/exercise-library/types/exercise.ts` | `IExercise` (name, slug, category, muscleGroups, equipment, difficulty, defaultSets, defaultReps) |
| `src/features/exercise-guide/types/guide.ts` | `IExerciseGuide`, `IExecutionStep`, `IMistake`, `IAlternativeExercise` |
| `src/features/home/types/dashboard.ts` | `ERecoveryState` (Recovered \| Fatigued), `MuscleSlug`, `IReadiness`, `IStreak`, `ITodaysWorkout`, `IRecoveryMap` |
| `src/features/history/types/history.ts` | `EIntensity` (HighIntensity \| Intense \| Normal) |
| `src/features/progress/types/progress.ts` | `IProgressDashboardData`, `IRecoveryItem`, `IHealthMetrics`, `IAiInsight` |
| `src/features/profile/ai-service/types.ts` | `IGeneratedExercise`, `IDaySchedule`, `IWorkoutPlanResponse` |

## Core Libraries

| File | Purpose |
|---|---|
| `src/lib/firebase.ts` | `initializeApp` + `getFirestore()` → exports `db` |
| `src/lib/clerk.ts` | Token cache using `expo-secure-store` (graceful no-op on web) |
| `src/lib/env.ts` | Reads `EXPO_PUBLIC_*` env vars for Clerk + Firebase |
| `src/lib/profile.ts` | `getUserProfile()`, `isProfileComplete()`, `isOnboarded()`, `getNextOnboardingStep()`, option arrays (GOAL_OPTIONS, GENDER_OPTIONS, LEVEL_OPTIONS, DAYS_OPTIONS) |
| `src/lib/get-youtube-video-id.ts` | Extracts YouTube video ID from URL |
| `src/context/auth-loading-context.tsx` | `AuthLoadingProvider` + `useAuthLoading` (boolean loading state) |

## Config

| File | Details |
|---|---|
| `tsconfig.json` | Extends `expo/tsconfig.base` with `strict: true`, path aliases `@/` → `src/*` |
| `app.json` | Scheme `gifapp`, web output `static`, plugins: `expo-router`, `expo-splash-screen`, `@clerk/expo`, `expo-web-browser` |
| `tailwind.config.js` | 3.4.17. Extends NativeWind preset with custom colors (surface, primary/neon-green, secondary/electric-blue, tertiary, error), fonts (Montserrat/Inter/JetBrains Mono), font sizes (display-lg 48px → stat-value 24px), spacing (container-mobile 20px, gutter 16px, stack-sm/md/lg), border radius (sm → xl → full). Plugin: `@gluestack-ui/nativewind-utils/tailwind-plugin` |
| `babel.config.js` | `babel-preset-expo` with `jsxImportSource: "nativewind"`, plugins: `react-native-css-interop/dist/babel-plugin`, `react-native-reanimated/plugin` |
| `metro.config.js` | `withNativeWind(config, { input: "./src/global.css" })`, SVG transformer via `react-native-svg-transformer` |
| `src/global.css` | Tailwind directives + Google Fonts import (Montserrat, Inter, JetBrains Mono) |
| `experiments` | `typedRoutes: true` |
| `.gitignore` | Excludes `/ios`, `/android` (generated native folders) |

## Tooling

- **No tests, no CI**, no Prettier config
- VS Code extensions: `expo.vscode-expo-tools`, Tailwind CSS IntelliSense
- `npm run reset-project` moves `/src` → `/example` and scaffolds blank project

## Platform variants

- Native tab bar: `expo-router/unstable-native-tabs`; web tab bar: `expo-router/ui`
- Platform-specific component files: `.web.tsx` suffix
- Key platform-aware libraries: `react-native-svg`, `react-native-youtube-iframe`, `react-native-webview`, `react-native-body-highlighter`

## Auth & Data

- **Auth**: Clerk with email/password + Google OAuth. Wired via `<ClerkProvider>` in root `_layout.tsx`. Token cache via `expo-secure-store` (no-op on web).
- **Signed-out users**: `src/app/(auth)/sign-in.tsx`, `sign-up.tsx`
- **Signed-in users**: Main tabs; onboarding guard redirects to `(onboarding)/` if profile incomplete, home if already onboarded.
- **Firestore**: JS SDK (`firebase 12.13.0`) in `src/lib/firebase.ts` → exports `db`. Collections: `workout_routines`, `workout_sessions`, `exercise_library`, `exercise_guides`, `user_ai_plans`. Optimize with `orderBy()` and `limit()`.
- **AI Integration**: Groq API (llama-3.3-70b-versatile) in `src/features/profile/ai-service/` — generates personalized weekly workout plans, saves to `user_ai_plans` (Firestore) + `expo-secure-store` cache. Requires `EXPO_PUBLIC_GROQ_API_KEY`.

## Known Issues & Edge Cases

| Issue | Impact | Location |
|---|---|---|
| **Date inconsistency** | Progress (`toISOString().split('T')[0]`, UTC) and History (`completedAt.split('T')[0]`) use UTC while Home dashboard uses `getLocalDateString()` (local time). Breaks date matching for streak/today's workout checks. | `progress/apis/index.tsx:75`, `history/apis/index.ts:43` |
| **Missing exercise IDs** | AI-generated or deleted exercise IDs are silently filtered in `getRoutineWithExercises` — user sees a workout with missing exercises and no feedback. | `workout-session/apis/routines.ts:59-66` |
| `completedAt` guard | `getWorkoutHistory` filters out docs without `completedAt`, but `saveWorkoutSession` has no validation — could save incomplete data. | `history/apis/index.ts:36` |
| **Session double-save** | `sessionSaved` flag lives in Zustand memory — if app crashes after flag set but before navigation, flag resets → user can save duplicate session. | `workout-session/store/use-workout-session-store.ts:32` |

## Naming Conventions

- **Files & folders**: `kebab-case` (e.g. `exercise-card.tsx`, `use-exercises-filter.ts`)
- **React components**: `PascalCase` export, kebab-case file (e.g. `exercise-guide.tsx` → `ExerciseGuide`)
- **Hooks**: file `use-*.ts`, hook `useFoo`
- **Zustand stores**: file `use-*-store.ts`, hook `useFooStore`
- **Interfaces**: `I` prefix (`IExercise`, `IUserProfile`)
- **Types**: `I` prefix for object shapes; plain `PascalCase` for unions/utilities
- **Enums**: `E` prefix (`ERecoveryState`, `EFitnessGoal`); prefer `enum` over string unions
- **Constants**: `SCREAMING_SNAKE_CASE` for primitives; `PascalCase` for grouped objects (`Colors`, `Spacing`)
- **Functions**: `camelCase`, must start with verb (`getAllExercises`, `handleExercisePress`)

## Best Practices

- **Firestore Collections**: NEVER hardcode names — use constants from `src/constants/collections.ts` (`ROUTINES_COLLECTION`, `WORKOUT_SESSIONS_COLLECTION`, `EXERCISE_LIBRARY_COLLECTION`, `GUIDES_COLLECTION`, `USER_AI_PLANS_COLLECTION`).
- **Date & Timezone**: NEVER use `new Date().toISOString().slice(0, 10)` — use `getLocalDateString()` from `src/utils/date.ts`. Note: this rule is currently violated in Progress and History.
- **Unit**: Always `kg` (Vietnamese audience).
- **Design First**: Read designs before implementing UI.
- **Ask Before Doing**: Confirm logic/design before coding.
- **Plan & Confirm**: Produce plan first, get approval before writing code.
