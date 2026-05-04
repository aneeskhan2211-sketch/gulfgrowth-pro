# Design Brief — GulfGrowth Pro

## Visual Direction
Premium Gulf-focused SaaS. White/light backgrounds with elevated card hierarchy. Gold and blue brand accents on clean, minimal surfaces. Professional, trustworthy, mobile-first.

## Tone & Differentiation
Refined, business-focused, not playful. Gold (#D4A853) for primary CTAs (audit, purchase). Blue (#1E6FD9) for secondary actions. Emphasis on clarity, value demonstration, and lead conversion.

## Color Palette (OKLCH)

| Role | Light | Dark | Purpose |
|------|-------|------|----------|
| Primary (Gold) | 0.68 0.14 71 | 0.68 0.14 71 | CTAs, audit buttons, highlights |
| Secondary (Blue) | 0.53 0.17 254 | 0.60 0.15 254 | Links, secondary actions, rings |
| Background | 1.0 0 0 | 0.12 0.008 261 | Page surfaces |
| Foreground | 0.16 0.01 261 | 0.95 0.006 261 | Text, dark on light |
| Card | 0.98 0 0 | 0.16 0.012 261 | Elevated surfaces |
| Border | 0.92 0.01 261 | 0.24 0.012 261 | Dividers, subtle boundaries |
| Destructive | 0.62 0.22 25 | 0.62 0.22 25 | Errors, warnings |

## Typography
**Display**: Space Grotesk 600 (headlines, h1–h4). **Body**: Plus Jakarta Sans 400/500 (copy, p). **Mono**: JetBrains Mono (code, values).
Hierarchy: h1 40px, h2 32px, h3 24px, h4 18px, p 14px/1.6, sm 12px.

## Elevation & Depth
Cards elevated 4–8px with subtle 0.1 opacity shadows. Borders on card edges (0.92 OKLCH light, 0.24 dark). No glassmorphism. Layered z-stack: background < sections < cards < modals/popovers.

## Structural Zones

| Zone | Surface | Border | Purpose |
|------|---------|--------|----------|
| Header | card | border-b | Navigation, logo, auth button (gold CTA) |
| Hero | background | none | Value prop headline + 2 CTAs (audit=gold, plans=blue) |
| Section (odd) | background | none | Problem/services/pricing |
| Section (even) | muted/40 | none | Alternating rhythm |
| Card grid | card | border | Service cards, pricing cards, dashboard widgets |
| Footer | card | border-t | Trust badges, contact, copyright |

## Spacing & Rhythm
Base unit 4px. Padding: xs 8px, sm 12px, md 16px, lg 24px, xl 32px, 2xl 48px.
Gap between elements: 16px (sm), 24px (md), 32px (lg).
Mobile-first: sm breakpoint stacks vertically, md+ grid layouts.

## Component Patterns
**Buttons**: Gold (primary/audit), Blue (secondary), Ghost (white text on dark). 12px rounded, 14px sans-serif 500. **Input**: 0.96 OKLCH bg light, focused ring 0.53 blue. **Card**: shadow-sm 1px 2px 4px rgba, border 0.92 light. **Badge**: muted bg with foreground text. **Icon**: 20px or 24px inline.

## Motion & Animations
Framer Motion entrance: fade-in + slight scale 0.95→1 over 200ms ease-out. Hover: bg-opacity +5%, scale 1.02. Button press: scale 0.98 50ms. Transitions applied globally via CSS variable `--transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)` (smooth, not bouncy).

## Constraints
- No gradients on backgrounds (depth through layers only).
- Never mix OKLCH in rgb/hsl wrappers; all colors pure OKLCH.
- Icons from lucide-react or shadcn; no custom SVGs unless signature.
- Max 3 accent colors: gold, blue, red (destructive).
- Dark mode enabled via `.dark` class; light is default.
- No animation over 300ms base duration.

## Signature Detail
Gold accent line (2px) above CTAs on hover. Smooth elevation lift (box-shadow increase) on card hover. Micro-interactions: WhatsApp field focus triggers subtle pulse. Blue ring on form focus. Arabic-English bilingual labels ready (hooks for i18n).
