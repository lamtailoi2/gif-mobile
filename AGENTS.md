Got it! Let's switch to English.

Here is the updated project documentation, incorporating the strict requirements to use **Tailwind CSS** and the workflow rule to **always read designs and ask before coding**:

---

# gif-app — Expo SDK 56 / React Native 0.85

## Commands

| Command           | Action                                            |
| ----------------- | ------------------------------------------------- |
| `npm start`       | Start Expo dev server                             |
| `npm run web`     | Start for web                                     |
| `npm run android` | Start for Android                                 |
| `npm run ios`     | Start for iOS                                     |
| `npm run lint`    | Run `expo lint` (no custom ESLint config in repo) |

No test framework is configured.

## Architecture

- **Entrypoint**: `package.json` → `"main": "expo-router/entry"` (file-based routing)
- **Routes**: `src/app/` — `_layout.tsx` (tab navigator), `index.tsx`, `explore.tsx`
- **Components**: `src/components/` — `.web.tsx` variants override native implementations for web
- **Styling**: **Tailwind CSS** must be used for styling UI components. Avoid standard `StyleSheet` where Tailwind utility classes can achieve the same result.
- **Theme**: `src/constants/theme.ts` — light/dark colors, spacing scale, font definitions (integrate with Tailwind config).
- **Hooks**: `src/hooks/` — `use-color-scheme.ts`, `use-theme.ts` (platform-aware)
- **Path aliases**: `@/` → `src/*`, `@/assets/*` → `assets/*` (from tsconfig.json)

## Development Workflow & Rules

- **Design First**: Always read and analyze the provided design files carefully before implementing any UI.
- **Ask Before Doing**: Do not make assumptions. Always ask for clarification or confirmation on logic, design details, or architecture before writing any code.

## Key config

- `tsconfig.json` extends `expo/tsconfig.base` with `strict: true`
- `app.json`: scheme `gifapp`, web output `static`, plugins: `expo-router`, `expo-splash-screen`
- Experiments: `typedRoutes: true`, `reactCompiler: true`
- `.gitignore` excludes `/ios`, `/android` (generated native folders)

## Tooling

- **No tests, no CI**, no Prettier config — only auto-fix on save from VSCode settings
- VS Code extension: `expo.vscode-expo-tools` (recommended) + Tailwind CSS IntelliSense.
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

---

I have saved these architectural and workflow rules to the project context. Whenever you are ready, please share the design file or requirements for the next feature, and we will analyze it together before executing!
