/**
 * G.I.F Design System - Hyper-Performance AI Aesthetic
 * Colors, Typography, and Spacing constants
 */

import "@/global.css";

import { Platform } from "react-native";

// G.I.F Color Palette - Dark theme with neon accents
export const Colors = {
  light: {
    // Surface & Background
    background: "#131313",
    surface: "#131313",
    surfaceDim: "#131313",
    surfaceContainer: "#201f1f",
    surfaceContainerLow: "#1c1b1b",
    surfaceContainerHigh: "#2a2a2a",
    surfaceContainerHighest: "#353534",

    // Primary (Neon Green)
    primary: "#ffffff",
    primaryFixed: "#c3f400",
    primaryFixedDim: "#abd600",
    onPrimary: "#283500",
    onPrimaryFixed: "#161e00",
    onPrimaryContainer: "#556d00",

    // Secondary (Electric Blue)
    secondary: "#adc6ff",
    secondaryContainer: "#4b8eff",
    secondaryFixed: "#d8e2ff",
    secondaryFixedDim: "#adc6ff",
    onSecondary: "#002e69",
    onSecondaryContainer: "#00285c",
    onSecondaryFixed: "#001a41",
    onSecondaryFixedVariant: "#004493",

    // Tertiary (White)
    tertiary: "#ffffff",
    tertiaryContainer: "#e2e2e2",
    tertiaryFixed: "#e2e2e2",
    tertiaryFixedDim: "#c6c6c7",
    onTertiary: "#2f3131",
    onTertiaryContainer: "#636565",
    onTertiaryFixed: "#1a1c1c",
    onTertiaryFixedVariant: "#454747",

    // On-Surface
    text: "#e5e2e1",
    onSurface: "#e5e2e1",
    onSurfaceVariant: "#c4c9ac",
    textSecondary: "#c4c9ac",
    backgroundElement: "#201f1f",
    backgroundSelected: "#2a2a2a",

    // Error
    error: "#ffb4ab",
    onError: "#690005",
    errorContainer: "#93000a",
    onErrorContainer: "#ffdad6",

    // Outline & Variant
    outline: "#8e9379",
    outlineVariant: "#444933",

    // Inverse
    inverseSurface: "#e5e2e1",
    inverseOnSurface: "#313030",
    inversePrimary: "#506600",

    // Utility
    border: "#353534",
    card: "#201f1f",
    glow: "#abd600",
    glowBlue: "#4b8eff",
  },
  dark: {
    // Surface & Background
    background: "#131313",
    surface: "#131313",
    surfaceDim: "#131313",
    surfaceContainer: "#201f1f",
    surfaceContainerLow: "#1c1b1b",
    surfaceContainerHigh: "#2a2a2a",
    surfaceContainerHighest: "#353534",

    // Primary (Neon Green)
    primary: "#ffffff",
    primaryFixed: "#c3f400",
    primaryFixedDim: "#abd600",
    onPrimary: "#283500",
    onPrimaryFixed: "#161e00",
    onPrimaryContainer: "#556d00",

    // Secondary (Electric Blue)
    secondary: "#adc6ff",
    secondaryContainer: "#4b8eff",
    secondaryFixed: "#d8e2ff",
    secondaryFixedDim: "#adc6ff",
    onSecondary: "#002e69",
    onSecondaryContainer: "#00285c",
    onSecondaryFixed: "#001a41",
    onSecondaryFixedVariant: "#004493",

    // Tertiary (White)
    tertiary: "#ffffff",
    tertiaryContainer: "#e2e2e2",
    tertiaryFixed: "#e2e2e2",
    tertiaryFixedDim: "#c6c6c7",
    onTertiary: "#2f3131",
    onTertiaryContainer: "#636565",
    onTertiaryFixed: "#1a1c1c",
    onTertiaryFixedVariant: "#454747",

    // On-Surface
    text: "#e5e2e1",
    onSurface: "#e1e1e1",
    onSurfaceVariant: "#ffffff",
    textSecondary: "#c4c9ac",
    backgroundElement: "#201f1f",
    backgroundSelected: "#2a2a2a",

    // Error
    error: "#ffb4ab",
    onError: "#690005",
    errorContainer: "#93000a",
    onErrorContainer: "#ffdad6",

    // Outline & Variant
    outline: "#8e9379",
    outlineVariant: "#444933",

    // Inverse
    inverseSurface: "#e5e2e1",
    inverseOnSurface: "#313030",
    inversePrimary: "#506600",

    // Utility
    border: "#353534",
    card: "#201f1f",
    glow: "#abd600",
    glowBlue: "#4b8eff",
  },
} as const;

export type ThemeColor = keyof typeof Colors.dark;

export const Fonts = {
  display: {
    fontFamily: Platform.select({
      ios: "Montserrat",
      android: "Montserrat",
      default: "Montserrat",
    }),
    fontSize: 48,
    fontWeight: "800",
    lineHeight: 56,
  },
  headlineLg: {
    fontFamily: Platform.select({
      ios: "Montserrat",
      android: "Montserrat",
      default: "Montserrat",
    }),
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 40,
  },
  headlineMd: {
    fontFamily: Platform.select({
      ios: "Montserrat",
      android: "Montserrat",
      default: "Montserrat",
    }),
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 32,
  },
  bodyLg: {
    fontFamily: Platform.select({
      ios: "Inter",
      android: "Inter",
      default: "Inter",
    }),
    fontSize: 18,
    fontWeight: "400",
    lineHeight: 28,
  },
  bodyMd: {
    fontFamily: Platform.select({
      ios: "Inter",
      android: "Inter",
      default: "Inter",
    }),
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
  },
  labelCaps: {
    fontFamily: Platform.select({
      ios: "JetBrains Mono",
      android: "JetBrains Mono",
      default: "JetBrains Mono",
    }),
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 16,
    letterSpacing: 0.1,
  },
  statValue: {
    fontFamily: Platform.select({
      ios: "Montserrat",
      android: "Montserrat",
      default: "Montserrat",
    }),
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 24,
  },
};

// G.I.F Spacing System - 8px base unit
export const Spacing = {
  base: 8,
  stackSm: 12,
  stackMd: 24,
  stackLg: 48,
  containerPaddingMobile: 20,
  containerPaddingDesktop: 40,
  gutter: 16,
} as const;

// Border Radius - Organic Geometric
export const Radius = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const BottomTabInset = Platform.select({ ios: 20, android: 24 }) ?? 20;
export const MaxContentWidth = 800;
