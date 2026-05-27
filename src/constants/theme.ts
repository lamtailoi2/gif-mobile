import '@/global.css';

import { Platform } from 'react-native';

// Full DESIGN.md palette — camelCase tokens for use in StyleSheet / inline styles
export const GIFColors = {
  // Surface
  surface: '#131313',
  surfaceDim: '#131313',
  surfaceBright: '#3a3939',
  surfaceContainerLowest: '#0e0e0e',
  surfaceContainerLow: '#1c1b1b',
  surfaceContainer: '#201f1f',
  surfaceContainerHigh: '#2a2a2a',
  surfaceContainerHighest: '#353534',
  surfaceVariant: '#353534',
  surfaceTint: '#abd600',
  onSurface: '#e5e2e1',
  onSurfaceVariant: '#c4c9ac',
  inverseSurface: '#e5e2e1',
  inverseOnSurface: '#313030',
  outline: '#8e9379',
  outlineVariant: '#444933',

  // Primary — Neon Green (Action & Growth)
  primary: '#ffffff',
  onPrimary: '#283500',
  primaryContainer: '#c3f400',
  onPrimaryContainer: '#556d00',
  inversePrimary: '#506600',
  primaryFixed: '#c3f400',
  primaryFixedDim: '#abd600',
  onPrimaryFixed: '#161e00',
  onPrimaryFixedVariant: '#3c4d00',

  // Secondary — Electric Blue (Intelligence & Data)
  secondary: '#adc6ff',
  onSecondary: '#002e69',
  secondaryContainer: '#4b8eff',
  onSecondaryContainer: '#00285c',
  secondaryFixed: '#d8e2ff',
  secondaryFixedDim: '#adc6ff',
  onSecondaryFixed: '#001a41',
  onSecondaryFixedVariant: '#004493',

  // Tertiary — White / Soft Gray
  tertiary: '#ffffff',
  onTertiary: '#2f3131',
  tertiaryContainer: '#e2e2e2',
  onTertiaryContainer: '#636565',
  tertiaryFixed: '#e2e2e2',
  tertiaryFixedDim: '#c6c6c7',
  onTertiaryFixed: '#1a1c1c',
  onTertiaryFixedVariant: '#454747',

  // Error
  error: '#ffb4ab',
  onError: '#690005',
  errorContainer: '#93000a',
  onErrorContainer: '#ffdad6',

  // Background
  background: '#131313',
  onBackground: '#e5e2e1',

  // Semantic shortcuts used throughout the design system
  neonGreen: '#abd600',
  electricBlue: '#4b8eff',
} as const;

export type GIFColor = keyof typeof GIFColors;

// G.I.F is a dark-theme app — both light and dark schemes share the same obsidian palette
export const Colors = {
  light: {
    text: GIFColors.onSurface,
    background: GIFColors.background,
    backgroundElement: GIFColors.surfaceContainerHigh,
    backgroundSelected: GIFColors.surfaceContainerHighest,
    textSecondary: GIFColors.onSurfaceVariant,
    primary: GIFColors.primaryFixedDim,
    secondary: GIFColors.secondaryContainer,
  },
  dark: {
    text: GIFColors.onSurface,
    background: GIFColors.background,
    backgroundElement: GIFColors.surfaceContainerHigh,
    backgroundSelected: GIFColors.surfaceContainerHighest,
    textSecondary: GIFColors.onSurfaceVariant,
    primary: GIFColors.primaryFixedDim,
    secondary: GIFColors.secondaryContainer,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

// Font families — load Montserrat, Inter, and JetBrains Mono via expo-font in _layout.tsx
export const Fonts = Platform.select({
  ios: {
    display: 'Montserrat',
    body: 'Inter',
    mono: 'JetBrains Mono',
  },
  android: {
    display: 'Montserrat',
    body: 'Inter',
    mono: 'JetBrains Mono',
  },
  web: {
    display: 'var(--font-display)',
    body: 'var(--font-body)',
    mono: 'var(--font-mono)',
  },
  default: {
    display: 'Montserrat',
    body: 'Inter',
    mono: 'JetBrains Mono',
  },
});

// Spacing scale (px values as numbers for StyleSheet)
export const Spacing = {
  base: 8,
  containerMobile: 20,
  containerDesktop: 40,
  gutter: 16,
  stackSm: 12,
  stackMd: 24,
  stackLg: 48,
} as const;

// Border radius (px values as numbers for StyleSheet)
export const Rounded = {
  sm: 4,
  DEFAULT: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
