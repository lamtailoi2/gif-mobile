/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{ts,tsx}",
    "./node_modules/@gluestack-ui/nativewind-utils/**/*.js",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // --- Surface tokens ---
        surface: {
          DEFAULT: "#131313",
          dim: "#131313",
          bright: "#3a3939",
          "container-lowest": "#0e0e0e",
          "container-low": "#1c1b1b",
          container: "#201f1f",
          "container-high": "#2a2a2a",
          "container-highest": "#353534",
          variant: "#353534",
          tint: "#abd600",
        },
        "on-surface": {
          DEFAULT: "#e5e2e1",
          variant: "#c4c9ac",
        },
        "inverse-surface": "#e5e2e1",
        "inverse-on-surface": "#313030",
        outline: {
          DEFAULT: "#8e9379",
          variant: "#444933",
        },

        // --- Primary: Neon Green — Action & Growth ---
        primary: {
          DEFAULT: "#ffffff",
          container: "#c3f400",
          fixed: "#c3f400",
          "fixed-dim": "#abd600",
        },
        "on-primary": {
          DEFAULT: "#283500",
          container: "#556d00",
          fixed: "#161e00",
          "fixed-variant": "#3c4d00",
        },
        "inverse-primary": "#506600",

        // --- Secondary: Electric Blue — Intelligence & Data ---
        secondary: {
          DEFAULT: "#adc6ff",
          container: "#4b8eff",
          fixed: "#d8e2ff",
          "fixed-dim": "#adc6ff",
        },
        "on-secondary": {
          DEFAULT: "#002e69",
          container: "#00285c",
          fixed: "#001a41",
          "fixed-variant": "#004493",
        },

        // --- Tertiary: White/Soft Gray ---
        tertiary: {
          DEFAULT: "#ffffff",
          container: "#e2e2e2",
          fixed: "#e2e2e2",
          "fixed-dim": "#c6c6c7",
        },
        "on-tertiary": {
          DEFAULT: "#2f3131",
          container: "#636565",
          fixed: "#1a1c1c",
          "fixed-variant": "#454747",
        },

        // --- Error ---
        error: {
          DEFAULT: "#ffb4ab",
          container: "#93000a",
        },
        "on-error": {
          DEFAULT: "#690005",
          container: "#ffdad6",
        },

        // --- Background ---
        background: "#131313",
        "on-background": "#e5e2e1",

        // --- Semantic shortcuts ---
        "neon-green": "#abd600",
        "electric-blue": "#4b8eff",
      },

      fontFamily: {
        display: ["Montserrat", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },

      fontSize: {
        "display-lg": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "800" }],
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "700" }],
        "headline-lg-mobile": ["28px", { lineHeight: "34px", fontWeight: "700" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "label-caps": ["12px", { lineHeight: "16px", letterSpacing: "0.1em", fontWeight: "600" }],
        "stat-value": ["24px", { lineHeight: "24px", fontWeight: "700" }],
      },

      spacing: {
        "container-mobile": "20px",
        "container-desktop": "40px",
        gutter: "16px",
        "stack-sm": "12px",
        "stack-md": "24px",
        "stack-lg": "48px",
      },

      borderRadius: {
        sm: "4px",
        DEFAULT: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        full: "9999px",
      },
    },
  },
  plugins: [require("@gluestack-ui/nativewind-utils/tailwind-plugin")],
};
