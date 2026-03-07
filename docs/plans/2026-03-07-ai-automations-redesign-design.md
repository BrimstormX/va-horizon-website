# AI Automations Page Redesign — Design Doc
Date: 2026-03-07

## Aesthetic Direction: Dark Luxury / Refined

### Core Principles
- Deep charcoal background (#111111) with subtle noise grain texture
- VA gold (#C5A059) used sparingly as a metallic accent — thin rules, labels, price figures, hover states
- Montserrat throughout (already site font) — light/regular weights for body, bold/extrabold for headlines
- Generous whitespace — sections breathe; no crowded grids
- Sharp geometry: no rounded corners on cards (or minimal 4px), no glassmorphism, no blur effects
- Thin 1px borders (gold or white/10) replace glowing glass panels
- Animations: scroll-triggered number counters, staggered fade-in reveals, subtle gold rule draws — no floating particles

---

## Page Structure

### Header / Nav
- Existing sticky nav (standard across all pages) — no change

### Hero Section
- Full viewport height
- Left-aligned layout (not centered)
- Small gold overline: "OUTREACH SYSTEMS" (uppercase, tracked, tiny)
- Thin vertical gold rule on the left edge of the text block
- Large Montserrat extrabold headline: "SMS. Voice. Two tools. One pipeline."
- Short subheading paragraph (DM-Sans feel, use Montserrat light)
- Two CTAs: primary gold button + secondary ghost button
- No hero image — typography carries it
- Subtle noise grain overlay on background

### Section Navigation Strip
- Sticky below hero: two tab-style anchors — "01 SMS Campaigns" and "02 AI Voice Agent"
- Thin gold underline on active tab
- Clicking scrolls to respective section (smooth scroll)
- Replaces the current toggle widget

---

## Section 01 — SMS Campaigns

### Sub-hero
- Section number "01" in gold, tiny caps
- Large serif-weight Montserrat headline: "High-Volume SMS. Zero Guesswork."
- One sentence description

### Stats Row
- 3 oversized Montserrat numbers (~80px, extrabold) in a horizontal row
- Labels in Montserrat light beneath each
- Stats: "18.4%" (response rate vs 4.2% industry avg), "10,000+" (SMS/hour throughput), "48hrs" (launch time)
- Numbers count up on scroll-trigger via IntersectionObserver

### How It Works — 3 Steps
- Horizontal row of 3 steps connected by a thin gold hairline rule
- Step numbers in thin gold circles (not filled — just outline)
- Step title in Montserrat semibold, description in Montserrat regular/small
- Steps: Upload List → Configure Scale → Receive Hot Leads

### Objection Handling Showcase
- 2-column layout: left col = "Standard Bot", right col = "VA Horizon"
- Chat transcript style — no colored bubbles; instead indented text with thin left-border rules
- "Standard Bot" conversation has a subtle red-left-border; VA Horizon has gold-left-border
- Labels: "KEYWORD BOT" / "VA HORIZON AI" in tiny monospace caps above each

### Feature Grid
- 2-column (not 3) on desktop — less cluttered
- Cards: 1px white/10 border, flat #1A1A1A bg, sharp corners
- Hover: gold border, slight upward translate (2px), NO glow/shadow
- Features: High-Volume Throughput, A2P 10DLC Compliance, Smart Drip Campaigns, GHL Integration

### SMS Pricing
- 3-column table layout with thin borders
- No "POPULAR" badge — instead, center column gets a gold left-border accent and slightly lighter bg (#1E1E1E)
- Prices: $450 one-time setup | $100/mo platform | $0.00125/segment (first 10k free)
- Single "Get Started" CTA below the table

---

## Section Divider
- Full-width thin gold horizontal rule
- Centered diamond glyph ◆ in gold, small

---

## Section 02 — AI Voice Agent (Lena)

### Sub-hero
- Section number "02" in gold, tiny caps
- Large Montserrat extrabold headline: "Meet Lena. She Closes While You Sleep."
- Demo call CTA: minimal pill button "Call Demo: +1 (888) 308-5286" — ghost style with thin gold border
- Pulsing green dot indicator "LIVE" next to the number

### Waveform Display
- Static-but-elegant SVG waveform: thin vertical bars of varying heights, gold-colored
- No animation on the waveform itself — it is a decorative graphic, not an animated loop
- Functions as a visual section break, not a functional element

### Conversation Transcript
- Screenplay-style layout: speaker name flush left in gold caps, dialogue to the right
- Three scenarios presented in 3 columns:
  - "INTERESTED" — books appointment
  - "NOT INTERESTED" — graceful removal
  - "VOICEMAIL" — drops personalized message
- No bubble UI — clean, editorial, like reading a script

### Capabilities
- 3-column feature list (minimal — just icon + title + 1-line description)
- Icons: thin stroke SVGs only, no filled icons
- Features: Inbound Handling, Outbound Power Dialing, Instant Live Transfer

### Voice Pricing
- Single centered card (not 2-column)
- Setup: Free | Usage: $0.05/min
- Gold "Get Started" button, full card width

---

## CTA Band
- Full-width #1A1A1A section
- Large Montserrat extrabold headline: "Ready to automate your pipeline?"
- One gold CTA button: "Apply Now"
- Thin gold rule above the section

---

## Technical Notes
- All existing SEO meta tags, Schema.org JSON-LD, canonical URL — keep unchanged
- `buttons.js` reference: keep as-is (already at correct path for this page)
- Nav: standard across all pages — no change
- Footer: keep existing footer HTML — no change
- New inline `<style>` block replaces existing one completely
- No external font imports needed (Montserrat already loaded via site's fonts.css)
- JavaScript: remove particle system, remove toggle switchView function; add IntersectionObserver for number counters and staggered reveals; add smooth-scroll for section nav tabs
- Responsive: hero goes full-width single column on mobile; stats row stacks vertically; feature grids go single column
