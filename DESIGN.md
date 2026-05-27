---
name: G.I.F
colors:
  surface: "#131313"
  surface-dim: "#131313"
  surface-bright: "#3a3939"
  surface-container-lowest: "#0e0e0e"
  surface-container-low: "#1c1b1b"
  surface-container: "#201f1f"
  surface-container-high: "#2a2a2a"
  surface-container-highest: "#353534"
  on-surface: "#e5e2e1"
  on-surface-variant: "#c4c9ac"
  inverse-surface: "#e5e2e1"
  inverse-on-surface: "#313030"
  outline: "#8e9379"
  outline-variant: "#444933"
  surface-tint: "#abd600"
  primary: "#ffffff"
  on-primary: "#283500"
  primary-container: "#c3f400"
  on-primary-container: "#556d00"
  inverse-primary: "#506600"
  secondary: "#adc6ff"
  on-secondary: "#002e69"
  secondary-container: "#4b8eff"
  on-secondary-container: "#00285c"
  tertiary: "#ffffff"
  on-tertiary: "#2f3131"
  tertiary-container: "#e2e2e2"
  on-tertiary-container: "#636565"
  error: "#ffb4ab"
  on-error: "#690005"
  error-container: "#93000a"
  on-error-container: "#ffdad6"
  primary-fixed: "#c3f400"
  primary-fixed-dim: "#abd600"
  on-primary-fixed: "#161e00"
  on-primary-fixed-variant: "#3c4d00"
  secondary-fixed: "#d8e2ff"
  secondary-fixed-dim: "#adc6ff"
  on-secondary-fixed: "#001a41"
  on-secondary-fixed-variant: "#004493"
  tertiary-fixed: "#e2e2e2"
  tertiary-fixed-dim: "#c6c6c7"
  on-tertiary-fixed: "#1a1c1c"
  on-tertiary-fixed-variant: "#454747"
  background: "#131313"
  on-background: "#e5e2e1"
  surface-variant: "#353534"
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: "800"
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: "700"
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 28px
    fontWeight: "700"
    lineHeight: 34px
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: "600"
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: "400"
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 24px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: "600"
    lineHeight: 16px
    letterSpacing: 0.1em
  stat-value:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: "700"
    lineHeight: 24px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-padding-mobile: 20px
  container-padding-desktop: 40px
  gutter: 16px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

The design system embodies a "Hyper-Performance AI" aesthetic—merging high-end athletic apparel sensibilities with futuristic digital interfaces. It is designed to feel "alive," as if the interface is an intelligent organism reacting to the user’s biometrics and progress.

The visual style is **Futuristic Glassmorphism**. It utilizes deep obsidian surfaces, vibrant light-emitting accents, and multi-layered translucency to create a sense of infinite depth. The emotional response should be one of empowerment, precision, and focus. Every element is polished to feel like a high-precision instrument, motivating the user through a "command center" experience for their own body.

## Colors

The palette is rooted in a "Black Hole" darkness to maximize the impact of the neon accents.

- **Primary (Neon Green):** Used for "Action & Growth." This is the color of progress, completion, and primary calls to action. It should vibrate against the dark background.
- **Secondary (Electric Blue):** Used for "Intelligence & Data." This represents the AI's presence, biometric tracking, and technical insights.
- **Neutral/Background:** A deep, near-black charcoal provides the foundation, ensuring that the glass effects have enough contrast to appear luminous.
- **Accents:** White is reserved for high-priority typography, while Soft Gray handles metadata and secondary information to maintain visual hierarchy.

## Typography

The typography system balances aggressive, athletic headings with ultra-clean, functional body text.

- **Headlines:** Montserrat is used in heavy weights for a bold, confident stance. Large displays should use tight letter spacing to feel "locked in."
- **Body:** Inter provides maximum legibility for workout instructions and health data.
- **Data/Labels:** JetBrains Mono is introduced for technical readouts and timestamps to reinforce the futuristic, AI-driven "G.I.F" identity.

All primary text is White (#FFFFFF). Secondary text uses the defined Soft Gray (#A1A1A1) to reduce cognitive load on data-heavy screens.

## Layout & Spacing

The layout follows a "Floating Module" philosophy. Elements are never cramped; they sit within generous margins to emphasize the premium nature of the app.

- **Grid:** Use a 4-column grid for mobile and a 12-column grid for tablet/desktop.
- **Safe Zones:** High-priority AI insights sit in the top third of the screen. Actionable workout controls are anchored to the bottom for ergonomic "thumb-zone" access.
- **Rhythm:** Use an 8px linear scale. Large cards should be separated by `stack-md` (24px) to allow the background blurs to breathe.

## Elevation & Depth

Depth is not created with traditional drop shadows, but through **Luminance and Refraction**.

- **Level 1 (Base):** The #050505 canvas.
- **Level 2 (Cards):** Semi-transparent glass (`surface_glass`) with a 20px backdrop blur and a subtle 1px inner border (White at 10% opacity) to catch the light.
- **Level 3 (Active Elements):** Elements "glow" rather than "rise." Active states use an outer bloom effect using the Primary Neon Green or Secondary Blue, simulating a light source beneath the glass.
- **Level 4 (Modals):** Full-screen blurs that push the background into a deep, unrecognizable bokeh.

## Shapes

The shape language is "Organic Geometric."

- **Cards:** Use a signature 24px radius (`rounded-xl` equivalents) to feel friendly yet modern.
- **Interactive Elements:** Buttons and tags use a fully pill-shaped (rounded-full) radius to distinguish them from informational cards.
- **Progress Rings:** Always use rounded caps on stroke ends to maintain the soft, sophisticated aesthetic.

## Components

### Buttons

- **Primary:** High-visibility Neon Green background with Black text. No shadow; instead, use a 12px Neon Green "bloom" (glow) on hover/active states.
- **Ghost:** Transparent background with a 1px Electric Blue border. Used for secondary actions or "Settings."

### Interactive Cards

- Glassmorphic base.
- Titles in Montserrat Bold.
- Real-time data points (e.g., Heart Rate) should feature a subtle "pulse" animation in the icon.

### Futuristic Progress Rings

- Background track: Dark Gray (#1A1A1A).
- Active track: Gradient from Electric Blue to Neon Green.
- Use a glow effect on the leading edge of the progress line to simulate energy movement.

### Input Fields

- Underlined or subtly framed glass containers.
- The cursor and active focus state should use the Electric Blue highlight.

### Bottom Navigation

- A floating "Glass Bar" detached from the screen edges.
- Icons use thin (1.5pt) strokes.
- The active icon should have a small Neon Green dot or glow beneath it.

### AI "Alive" Indicator

- A pulsing, amorphous gradient blob situated behind the glass of the most important daily stat, moving slowly to indicate the AI is "thinking" or "syncing."
