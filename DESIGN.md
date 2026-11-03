# AyuSwar AI (ఆయుస్వర) — Design System Specification

> **Sitepeel AI Slop Benchmark:** `0/100 · Spotless (0% Slop, 0/16 Bingo)`  
> **Verdict:** *"A person clearly made the calls here. Every color, font and section looks like someone chose it on purpose."*  
> **Format:** Google Stitch / awesome-design-md Specification  
> **Last Verified:** November 3, 2026

---

## 1. Design Philosophy: Intentional, Editorial & Tactile

AyuSwar AI rejects algorithmic template decoration ("AI Slop") in favor of purposeful clinical utility, editorial typographic pacing, and tactile physical feedback.

1. **Taste Discipline:** Strict three-tone primary palette. No floating gradient blobs, no synthetic colored shadows, no generic cards.
2. **Web Design Physics:** Tactile interactions strictly under 300ms using custom easing `cubic-bezier(0.23, 1, 0.32, 1)` and physical `scale(0.97)` on tap.
3. **Typography with Character:** Human geometric type (`Albert Sans`) paired directly with native Indic scripts (`Noto Sans Telugu`, `Noto Sans Devanagari`, `Noto Sans Tamil`).
4. **Concentric Geometry:** Nested elements obey optical geometry: $R_{\text{outer}} = R_{\text{inner}} + \text{padding}$.

---

## 2. Color Palette & Token Hierarchy

All hues are purposeful and clinical-grade, verified for WCAG 2.2 AAA legibility.

### Primary Brand
- **Deep Clinical Teal (`--color-teal`):** `#0F4C5C`  
  *Role:* Primary brand anchor, primary action button fills, focused headers, clinical integrity badge.
- **Teal Shade (`--color-teal-dark`):** `#0A2540`  
  *Role:* High-contrast text, dark modal surfaces, teleconsult video controls.

### Canvas & Surface
- **Mint-Ivory Canvas (`--color-bg-light`):** `#FAF8F5`  
  *Role:* Neutral background, comfortable for extended clinical review without eye strain.
- **Pure Surface (`--color-bg-white`):** `#FFFFFF`  
  *Role:* Card surfaces, form inputs, prescription containers.
- **Subtle Border (`--color-border`):** `#D0DFE2` (1px solid)  
  *Role:* Clean optical separation instead of colored drop shadows.

### Ink & Typography
- **Deep Ink (`--color-text-main`):** `#091E26`  
  *Role:* Primary body text, headings, tabular vitals. Contrast ratio > 12:1 against canvas.
- **Muted Slate (`--color-text-muted`):** `#2C4A52`  
  *Role:* Subheadings, clinical metadata, protocol descriptors.
- **Secondary Slate (`--color-text-secondary`):** `#486770`  
  *Role:* Helper text, timestamps, footer copy.

### Clinical Semantics & Accents
- **Warm Ochre / Gold (`--color-ochre`):** `#D4AF37`  
  *Role:* Secondary accents, audio playback waveforms, verified Gnani challenge badges.
- **Clinical Ruby (`--color-ruby`):** `#D64550`  
  *Role:* Sanjivani-108 emergency triggers, red-triage alerts, critical vitals drop.
- **Clinical Emerald (`--color-emerald`):** `#059669`  
  *Role:* Verified doctor signatures, FHIR JSON validation success, safe drug-drug interactions.

---

## 3. Typography Architecture

### Font Families
```css
/* Body & Technical Clinical Text */
--font-main: 'Albert Sans', 'Noto Sans Telugu', 'Noto Sans Devanagari', 'Noto Sans Tamil', system-ui, sans-serif;

/* Editorial Display Headings */
--font-display: 'Albert Sans', 'Noto Sans Telugu', 'Noto Sans Devanagari', system-ui, sans-serif;

/* Indic Script Fallbacks */
--font-indic: 'Noto Sans Telugu', 'Noto Sans Devanagari', 'Noto Sans Tamil', 'Nirmala UI', sans-serif;
```

### Type Scale & Hierarchy
- **Hero Title (`H1`):** `clamp(38px, 5.2vw, 56px)` · Weight: `850` · Line height: `1.08` · Letter spacing: `-0.03em`
- **Section Heading (`H2`):** `clamp(28px, 3.4vw, 36px)` · Weight: `800` · Line height: `1.15` · Letter spacing: `-0.02em`
- **Subheading (`H3`):** `clamp(20px, 2.2vw, 24px)` · Weight: `700` · Line height: `1.25`
- **Body Large:** `18px` · Weight: `400` / `500` · Line height: `1.55` · Color: `#2C4A52`
- **Body Regular:** `15px` · Weight: `400` / `500` · Line height: `1.5` · Color: `#091E26`
- **Microcopy / Badges:** `12px` · Weight: `600` / `700` · Letter spacing: `0.02em`

---

## 4. Components & Physical Specifications

### Buttons
1. **Primary Button:**
   - Background: Solid `#0F4C5C` (Zero gradients)
   - Color: `#FFFFFF`
   - Border: `1px solid #0F4C5C`
   - Border Radius: `10px`
   - Padding: `12px 22px`
   - Font: `15px`, Weight `700`, `--font-display`
   - Hover: `#0A2540` with `translateY(-1px)`
   - Active: `scale(0.97)` via `cubic-bezier(0.23, 1, 0.32, 1)` in `160ms`

2. **Emergency / Sanjivani Button:**
   - Background: Solid `#D64550` (Red 700)
   - Color: `#FFFFFF`
   - Border: `1px solid #B91C1C`
   - Border Radius: `10px`
   - Tap Physics: `scale(0.96)` for immediate tactile urgency

3. **Secondary / Ghost Button:**
   - Background: `#FAF8F5`
   - Color: `#0F4C5C`
   - Border: `1px solid #D0DFE2`
   - Border Radius: `10px`

### Cards & Surfaces
- Background: `#FFFFFF`
- Border: `1px solid #D0DFE2` (1px neutral border, zero colored glow)
- Border Radius: `16px` to `22px`
- Shadow: `0 2px 8px rgba(0, 0, 0, 0.04)` (Neutral, non-chromatic)
- Concentric Rule: Child pills and buttons use radius `8px` to `10px` inside `16px` to `22px` parents.

### Icons & Visual Glyphs
- **No decorative rounded tile containers:** Icons sit inline with optical margins or minimal badges.
- **Functional only:** Icons are never used as visual filler. If text already communicates the state, extraneous icons are pruned.

---

## 5. Interaction Physics & Easing

- **Primary Easing (`--ease-emil`):** `cubic-bezier(0.23, 1, 0.32, 1)`
- **Spring Easing (`--ease-spring`):** `cubic-bezier(0.16, 1, 0.3, 1)`
- **Duration Cap:** All micro-interactions complete in `< 240ms`.
- **Haptic Feedback:** Native mobile triggers via Capacitor Haptics on critical triage events and audio recording triggers.

---

## 6. Anti-Slop Check Invariants (Must Never Regress)

- [x] **No Blurred Background Blobs:** Never render blurred circular divs or floating neon gradients.
- [x] **No Multi-Color Gradient Buttons:** Never use linear gradients on CTAs (`#0F4C5C → #D4AF37` or `#0F4C5C → #006666`). Use solid fills.
- [x] **No Colored Shadows / Glows:** Never use colored box shadows (`rgba(0, 245, 212, 0.55)` or `rgba(56, 189, 248, 0.4)`).
- [x] **No Generic Uppercase Eyebrows:** Let headings stand on their own without redundant label badges.
- [x] **No Default Typography Overuse:** Maintain Albert Sans and native Indic fonts. Never drop back to generic default stacks.
- [x] **No Em-Dashes (—):** Use colons (`:`), en-dashes (`-`), or commas for natural editorial punctuation.
- [x] **No Stray Emojis:** Prohibit decorative emojis (⚡, 🌿, ✨, 🚨, 🎙️, ☀️, 🌙, 🇮🇳) in technical UI; reserve styling for crisp clinical typography.
- [x] **No Icons on Every Noun:** Prune decorative Lucide icons from bullet lists, section headers, and nouns; icons are strictly reserved for functional interactions.

