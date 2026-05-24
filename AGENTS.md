# gif-app — Expo SDK 56 / React Native 0.85

## Commands

| Command | Action |
|---------|--------|
| `npm start` | Start Expo dev server |
| `npm run web` | Start for web |
| `npm run android` | Start for Android |
| `npm run ios` | Start for iOS |
| `npm run lint` | Run `expo lint` (no custom ESLint config in repo) |

No test framework is configured.

## Architecture

- **Entrypoint**: `package.json` → `"main": "expo-router/entry"` (file-based routing)
- **Routes**: `src/app/` — `_layout.tsx` (tab navigator), `index.tsx`, `explore.tsx`
- **Components**: `src/components/` — `.web.tsx` variants override native implementations for web
- **Theme**: `src/constants/theme.ts` — light/dark colors, spacing scale, font definitions
- **Hooks**: `src/hooks/` — `use-color-scheme.ts`, `use-theme.ts` (platform-aware)
- **Path aliases**: `@/` → `src/*`, `@/assets/*` → `assets/*` (from tsconfig.json)

## Key config

- `tsconfig.json` extends `expo/tsconfig.base` with `strict: true`
- `app.json`: scheme `gifapp`, web output `static`, plugins: `expo-router`, `expo-splash-screen`
- Experiments: `typedRoutes: true`, `reactCompiler: true`
- `.gitignore` excludes `/ios`, `/android` (generated native folders)

## Tooling

- **No tests, no CI**, no Prettier config — only auto-fix on save from VSCode settings
- VS Code extension: `expo.vscode-expo-tools` (recommended)
- `npm run reset-project` moves `/src` → `/example` and scaffolds a blank project

## Platform variants

Native tab bar uses `expo-router/unstable-native-tabs`; web tab bar uses `expo-router/ui`.
Platform-specific component files follow `.web.tsx` suffix convention.

## Auth & Firestore

- **Auth**: Clerk with email/password + Google OAuth. Wired in `src/app/_layout.tsx` via `<ClerkProvider>`.
  - Signed-out users see `src/app/sign-in.tsx`; signed-in users see `<AppTabs>`.
  - Token cache uses `expo-secure-store` (graceful no-op on web).
- **Firestore**: Initialized in `src/lib/firebase.ts` — exports `db` via `getFirestore()`. JS SDK (works in Expo Go).
- **Credentials**: Set `EXPO_PUBLIC_*` vars in `.env` (copy `.env.example`). Expo SDK 56 inlines `EXPO_PUBLIC_*` vars at bundle time — no manual config loading needed.
