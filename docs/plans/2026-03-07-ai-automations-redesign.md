# AI Automations Page Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Completely replace the `ai-automations/index.html` visual design with a Dark Luxury/Refined aesthetic — deep charcoal background, VA gold accents, Montserrat typography, sharp card borders, no glassmorphism/particles/neons.

**Architecture:** Single HTML file rewrite — replace all inline `<style>` and `<main>` content while preserving the existing `<head>` meta/SEO tags, nav, footer, and `buttons.js` script reference. All new styles go in the inline `<style>` block. JavaScript is reduced to: IntersectionObserver for number counters + staggered reveals + smooth-scroll for section tabs.

**Tech Stack:** Static HTML, Tailwind CSS (pre-built `/css/tailwind.min.css`), Montserrat (already loaded via `fonts.css`), vanilla JS, inline SVG icons.

---

### Task 1: Replace the inline `<style>` block

**Files:**
- Modify: `ai-automations/index.html` (lines 31–229, the entire `<style>` block)

**Step 1: Delete existing style block and write new one**

Replace everything between `<style>` and `</style>` (the first one, in `<head>`) with:

```css
/* ============================================================
   DARK LUXURY — AI Automations Page
   ============================================================ */
:root {
    --bg:        #111111;
    --bg-card:   #1A1A1A;
    --bg-hover:  #1E1E1E;
    --gold:      #C5A059;
    --gold-dim:  rgba(197,160,89,0.15);
    --gold-rule: rgba(197,160,89,0.4);
    --white:     #FFFFFF;
    --muted:     rgba(255,255,255,0.5);
    --border:    rgba(255,255,255,0.08);
    --border-gold: rgba(197,160,89,0.35);
}

/* Base */
html { scroll-behavior: smooth; }
body {
    background-color: var(--bg);
    color: var(--white);
    overflow-x: hidden;
    font-family: 'Montserrat', sans-serif;
}

/* Noise grain overlay */
body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    background-repeat: repeat;
    background-size: 200px 200px;
    pointer-events: none;
    z-index: 0;
    opacity: 0.35;
}

/* ---- Typography ---- */
.display-xl {
    font-size: clamp(2.5rem, 6vw, 5rem);
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.02em;
}
.display-lg {
    font-size: clamp(2rem, 4vw, 3.5rem);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.02em;
}
.stat-number {
    font-size: clamp(3rem, 7vw, 5.5rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--white);
    line-height: 1;
}
.overline {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
}
.section-num {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--gold);
    display: block;
    margin-bottom: 1rem;
}

/* ---- Cards ---- */
.lux-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    transition: border-color 0.25s ease, transform 0.25s ease;
}
.lux-card:hover {
    border-color: var(--border-gold);
    transform: translateY(-2px);
}
.lux-card--gold-accent {
    border-left: 3px solid var(--gold);
    background: var(--bg-hover);
}
.lux-card--red-accent {
    border-left: 3px solid rgba(220,38,38,0.5);
}

/* ---- Gold Rules ---- */
.gold-rule {
    height: 1px;
    background: var(--gold-rule);
    border: none;
    margin: 0;
}
.section-divider {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 3rem 0;
}
.section-divider::before,
.section-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--gold-rule);
}
.section-divider__diamond {
    color: var(--gold);
    font-size: 0.75rem;
    line-height: 1;
}

/* ---- Hero vertical rule ---- */
.hero-rule {
    position: absolute;
    left: 0;
    top: 10%;
    bottom: 10%;
    width: 2px;
    background: linear-gradient(to bottom, transparent, var(--gold), transparent);
}

/* ---- Step connector ---- */
.step-connector {
    position: absolute;
    top: 20px;
    left: calc(50% + 20px);
    right: calc(-50% + 20px);
    height: 1px;
    background: var(--gold-rule);
}

/* ---- Section nav strip ---- */
.section-nav {
    position: sticky;
    top: 65px; /* below site header */
    z-index: 40;
    background: rgba(17,17,17,0.95);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--border);
}
.section-nav__tab {
    padding: 1rem 2rem;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--muted);
    border-bottom: 2px solid transparent;
    transition: color 0.2s, border-color 0.2s;
    cursor: pointer;
    text-decoration: none;
}
.section-nav__tab:hover,
.section-nav__tab.active {
    color: var(--gold);
    border-bottom-color: var(--gold);
}

/* ---- Buttons ---- */
.btn-gold {
    display: inline-block;
    background: var(--gold);
    color: #111;
    font-weight: 700;
    font-size: 0.875rem;
    letter-spacing: 0.05em;
    padding: 0.875rem 2rem;
    transition: background 0.2s, color 0.2s;
    text-decoration: none;
}
.btn-gold:hover { background: #fff; color: #111; }

.btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    border: 1px solid var(--border-gold);
    color: var(--gold);
    font-weight: 600;
    font-size: 0.875rem;
    letter-spacing: 0.05em;
    padding: 0.875rem 2rem;
    transition: background 0.2s, color 0.2s;
    text-decoration: none;
}
.btn-ghost:hover { background: var(--gold-dim); }

/* ---- Chat transcript ---- */
.transcript-line {
    display: grid;
    grid-template-columns: 7rem 1fr;
    gap: 1rem;
    padding: 0.625rem 0;
    border-bottom: 1px solid var(--border);
    font-size: 0.875rem;
}
.transcript-line:last-child { border-bottom: none; }
.transcript-speaker {
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    padding-top: 0.125rem;
    white-space: nowrap;
}
.transcript-text { color: rgba(255,255,255,0.8); line-height: 1.5; }

/* ---- Waveform ---- */
.waveform {
    display: flex;
    align-items: center;
    gap: 3px;
    height: 40px;
}
.waveform__bar {
    width: 2px;
    background: var(--gold);
    opacity: 0.6;
    border-radius: 1px;
}

/* ---- Reveal animations ---- */
.reveal {
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.6s ease, transform 0.6s ease;
}
.reveal.visible {
    opacity: 1;
    transform: translateY(0);
}
.reveal-delay-1 { transition-delay: 0.1s; }
.reveal-delay-2 { transition-delay: 0.2s; }
.reveal-delay-3 { transition-delay: 0.3s; }

/* ---- Pricing table ---- */
.pricing-col {
    border: 1px solid var(--border);
    padding: 2.5rem;
    background: var(--bg-card);
}
.pricing-col--featured {
    border-left: 3px solid var(--gold);
    background: var(--bg-hover);
}
.pricing-price {
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--white);
    line-height: 1;
}
.pricing-unit {
    font-size: 0.875rem;
    color: var(--muted);
    font-weight: 400;
}
.pricing-check {
    color: var(--gold);
    margin-right: 0.625rem;
}

/* ---- Live badge ---- */
.live-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #4ade80;
}
.live-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #4ade80;
    animation: pulse-green 2s infinite;
}
@keyframes pulse-green {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.3); }
}

/* ---- Responsive ---- */
@media (max-width: 768px) {
    .step-connector { display: none; }
    .transcript-line { grid-template-columns: 1fr; gap: 0.25rem; }
    .section-nav__tab { padding: 0.75rem 1rem; font-size: 0.65rem; }
}
```

**Step 2: Verify** — Open `ai-automations/index.html` in browser. Page should be dark charcoal, no particles, no neon. Nav still works.

---

### Task 2: Write the Hero section

**Files:**
- Modify: `ai-automations/index.html` — replace the entire `<section class="relative min-h-[90vh]...">` hero block (approximately lines 304–371)

**Step 1: Replace hero HTML**

```html
<!-- Hero -->
<section class="relative min-h-screen flex items-center py-28 overflow-hidden">
    <div class="container mx-auto px-6 lg:px-8 relative z-10 max-w-5xl">
        <div class="relative pl-8">
            <div class="hero-rule"></div>
            <span class="overline reveal">Outreach Systems</span>
            <h1 class="display-xl text-white mt-4 mb-6 max-w-3xl reveal reveal-delay-1">
                SMS. Voice.<br>Two tools.<br>One pipeline.
            </h1>
            <p class="text-lg text-white/50 max-w-xl mb-10 font-light leading-relaxed reveal reveal-delay-2">
                High-volume SMS campaigns and an AI voice agent that qualifies leads around the clock — both integrated with your HighLevel CRM and live within 48 hours.
            </p>
            <div class="flex flex-wrap gap-4 reveal reveal-delay-3">
                <a href="../apply/" class="btn-gold">Apply Now</a>
                <a href="#sms" class="btn-ghost">
                    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
                    See Services
                </a>
            </div>
        </div>
    </div>
</section>
```

**Step 2: Verify** — Hero renders with left gold rule, stacked headline, two CTAs. No toggle. No particles.

---

### Task 3: Write the Section Navigation Strip

**Files:**
- Modify: `ai-automations/index.html` — insert after the closing `</section>` of the hero, before the SMS section

**Step 1: Insert section nav HTML**

```html
<!-- Section Nav -->
<nav class="section-nav" aria-label="Page sections">
    <div class="container mx-auto px-6 lg:px-8 max-w-5xl flex">
        <a href="#sms" class="section-nav__tab active" data-tab="sms">01 &nbsp; SMS Campaigns</a>
        <a href="#voice" class="section-nav__tab" data-tab="voice">02 &nbsp; AI Voice Agent</a>
    </div>
</nav>
```

**Step 2: Verify** — Sticky nav strip appears below main header. Gold underline on "01 SMS Campaigns".

---

### Task 4: Write Section 01 — SMS Campaigns

**Files:**
- Modify: `ai-automations/index.html` — replace the entire `<div id="sms-view" ...>` block and all its children

**Step 1: Write SMS section HTML**

```html
<!-- Section 01: SMS Campaigns -->
<section id="sms" class="py-24 relative z-10">
    <div class="container mx-auto px-6 lg:px-8 max-w-5xl">

        <!-- Sub-hero -->
        <div class="mb-20">
            <span class="section-num reveal">01 — SMS Campaigns</span>
            <h2 class="display-lg text-white max-w-2xl reveal reveal-delay-1">High-Volume SMS.<br>Zero Guesswork.</h2>
            <p class="text-white/50 mt-4 max-w-xl font-light leading-relaxed reveal reveal-delay-2">
                A2P-compliant blast campaigns deployed in 48 hours. We handle setup, list scrubbing, and carrier compliance — you handle the deals.
            </p>
        </div>

        <!-- Stats row -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-0 mb-24 border border-white/8 reveal">
            <div class="p-10 border-b md:border-b-0 md:border-r border-white/8">
                <div class="stat-number" data-count-to="18.4" data-count-suffix="%" data-count-decimals="1">0%</div>
                <div class="text-white/40 text-sm mt-2 font-light">Average response rate<br><span class="text-white/20 text-xs">Industry avg: 4.2%</span></div>
            </div>
            <div class="p-10 border-b md:border-b-0 md:border-r border-white/8">
                <div class="stat-number" data-count-to="10000" data-count-suffix="+" data-count-decimals="0">0+</div>
                <div class="text-white/40 text-sm mt-2 font-light">SMS per hour throughput</div>
            </div>
            <div class="p-10">
                <div class="stat-number">48<span class="text-4xl text-gold" style="color:var(--gold)">hrs</span></div>
                <div class="text-white/40 text-sm mt-2 font-light">From onboarding to first campaign live</div>
            </div>
        </div>

        <!-- How it works -->
        <div class="mb-24">
            <h3 class="text-sm font-bold tracking-widest uppercase text-white/30 mb-12 reveal">How It Works</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div class="relative reveal">
                    <div class="hidden md:block step-connector"></div>
                    <div class="w-10 h-10 border border-gold flex items-center justify-center text-gold font-bold text-sm mb-5" style="border-color:var(--gold);color:var(--gold);">1</div>
                    <h4 class="font-bold text-white mb-2">Upload Your List</h4>
                    <p class="text-white/40 text-sm leading-relaxed font-light">Import your skip-traced CSV. We auto-scrub DNC and validate numbers before a single message sends.</p>
                </div>
                <div class="relative reveal reveal-delay-1">
                    <div class="hidden md:block step-connector"></div>
                    <div class="w-10 h-10 border border-gold flex items-center justify-center text-gold font-bold text-sm mb-5" style="border-color:var(--gold);color:var(--gold);">2</div>
                    <h4 class="font-bold text-white mb-2">Configure Scale</h4>
                    <p class="text-white/40 text-sm leading-relaxed font-light">Set sending limits and A2P compliance rules. We optimize for maximum inbox delivery across carriers.</p>
                </div>
                <div class="relative reveal reveal-delay-2">
                    <div class="w-10 h-10 border border-gold flex items-center justify-center text-gold font-bold text-sm mb-5" style="border-color:var(--gold);color:var(--gold);">3</div>
                    <h4 class="font-bold text-white mb-2">Receive Hot Leads</h4>
                    <p class="text-white/40 text-sm leading-relaxed font-light">Interested replies flow into your HighLevel CRM automatically. Your only job is to close the deal.</p>
                </div>
            </div>
        </div>

        <!-- Objection Handling Comparison -->
        <div class="mb-24">
            <h3 class="text-sm font-bold tracking-widest uppercase text-white/30 mb-12 reveal">Intelligent Response vs. Keyword Bot</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Bad -->
                <div class="lux-card lux-card--red-accent p-8 reveal">
                    <div class="overline mb-6" style="color:rgba(220,38,38,0.7)">Keyword Bot</div>
                    <div>
                        <div class="transcript-line">
                            <span class="transcript-speaker" style="color:var(--muted)">Lead</span>
                            <span class="transcript-text">"I'm at work, call me later tonight."</span>
                        </div>
                        <div class="transcript-line">
                            <span class="transcript-speaker" style="color:rgba(220,38,38,0.6)">Bot</span>
                            <span class="transcript-text" style="color:rgba(255,255,255,0.4)">"Great! What's your asking price?"</span>
                        </div>
                    </div>
                    <p class="text-xs text-red-400/70 mt-5 font-light italic">Failed to detect intent. Lead is now annoyed.</p>
                </div>
                <!-- Good -->
                <div class="lux-card lux-card--gold-accent p-8 reveal reveal-delay-1">
                    <div class="overline mb-6">VA Horizon AI</div>
                    <div>
                        <div class="transcript-line">
                            <span class="transcript-speaker" style="color:var(--muted)">Lead</span>
                            <span class="transcript-text">"I'm at work, call me later tonight."</span>
                        </div>
                        <div class="transcript-line">
                            <span class="transcript-speaker" style="color:var(--gold)">AI</span>
                            <span class="transcript-text">"No problem. I'll send you a reminder at 7 PM — does that work for you?"</span>
                        </div>
                    </div>
                    <p class="text-xs mt-5 font-light italic" style="color:rgba(197,160,89,0.6)">Context detected. Objection handled. Relationship built.</p>
                </div>
            </div>
        </div>

        <!-- Features 2-col -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
            <div class="lux-card p-8 reveal">
                <h4 class="font-bold text-white mb-2">High-Volume Throughput</h4>
                <p class="text-white/40 text-sm leading-relaxed font-light">Enterprise infrastructure capable of 10,000+ SMS per hour with intelligent carrier load balancing.</p>
            </div>
            <div class="lux-card p-8 reveal reveal-delay-1">
                <h4 class="font-bold text-white mb-2">A2P 10DLC Compliance</h4>
                <p class="text-white/40 text-sm leading-relaxed font-light">Fully registered campaigns under VA Horizon LLC. We handle vetting so your messages reach inboxes.</p>
            </div>
            <div class="lux-card p-8 reveal reveal-delay-2">
                <h4 class="font-bold text-white mb-2">Smart Drip Sequences</h4>
                <p class="text-white/40 text-sm leading-relaxed font-light">Automated multi-touch follow-up over 14–21 days. Nurture leads who aren't ready today into deals tomorrow.</p>
            </div>
            <div class="lux-card p-8 reveal reveal-delay-3">
                <h4 class="font-bold text-white mb-2">HighLevel CRM Integration</h4>
                <p class="text-white/40 text-sm leading-relaxed font-light">Replies and stage updates flow directly into GHL. No copy-paste, no data loss, no missed leads.</p>
            </div>
        </div>

        <!-- SMS Pricing -->
        <div class="mb-4">
            <h3 class="text-sm font-bold tracking-widest uppercase text-white/30 mb-12 reveal">Pricing</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 reveal">
                <div class="pricing-col">
                    <div class="overline mb-4">Implementation</div>
                    <div class="pricing-price mb-1">$450</div>
                    <div class="text-white/30 text-xs mb-6 font-light">One-time setup fee</div>
                    <ul class="space-y-3 text-sm text-white/50 font-light">
                        <li><span class="pricing-check">✓</span>System Access &amp; Setup</li>
                        <li><span class="pricing-check">✓</span>Campaign Configuration</li>
                        <li><span class="pricing-check">✓</span>Registered under VA Horizon LLC</li>
                    </ul>
                </div>
                <div class="pricing-col pricing-col--featured">
                    <div class="overline mb-4">Platform</div>
                    <div class="pricing-price mb-1">$100<span class="pricing-unit">/mo</span></div>
                    <div class="text-white/30 text-xs mb-6 font-light">Monthly subscription</div>
                    <ul class="space-y-3 text-sm text-white/50 font-light">
                        <li><span class="pricing-check">✓</span>Full List Management</li>
                        <li><span class="pricing-check">✓</span>Number Maintenance</li>
                        <li><span class="pricing-check">✓</span>Priority Support</li>
                    </ul>
                </div>
                <div class="pricing-col">
                    <div class="overline mb-4">Usage</div>
                    <div class="pricing-price mb-1" style="font-size:2rem;">$0.00125<span class="pricing-unit">/segment</span></div>
                    <div class="text-white/30 text-xs mb-6 font-light">Per SMS segment</div>
                    <ul class="space-y-3 text-sm text-white/50 font-light">
                        <li><span class="pricing-check">✓</span>Pay as you go</li>
                        <li><span class="pricing-check">✓</span><strong class="text-white/70">First 10k included</strong></li>
                        <li><span class="pricing-check">✓</span>Volume discounts available</li>
                        <li><span class="pricing-check">✓</span>$30 per number registration</li>
                    </ul>
                </div>
            </div>
            <div class="text-center mt-10 reveal">
                <a href="../apply/" class="btn-gold">Get Started with SMS</a>
            </div>
        </div>

    </div>
</section>
```

**Step 2: Verify** — Scroll down from hero. SMS section renders with stats row, 3 steps, comparison, 2-col features, 3-col pricing. No toggle UI. Numbers animate on scroll.

---

### Task 5: Write the Section Divider

**Files:**
- Modify: `ai-automations/index.html` — insert after closing `</section>` of SMS section, before Voice section

**Step 1: Insert divider HTML**

```html
<!-- Section Divider -->
<div class="container mx-auto px-6 lg:px-8 max-w-5xl">
    <div class="section-divider">
        <span class="section-divider__diamond">◆</span>
    </div>
</div>
```

**Step 2: Verify** — Thin gold rules with centered diamond appear between SMS and Voice sections.

---

### Task 6: Write Section 02 — AI Voice Agent

**Files:**
- Modify: `ai-automations/index.html` — replace the entire `<div id="ai-view" ...>` block and all its children

**Step 1: Write Voice section HTML**

```html
<!-- Section 02: AI Voice Agent -->
<section id="voice" class="py-24 relative z-10">
    <div class="container mx-auto px-6 lg:px-8 max-w-5xl">

        <!-- Sub-hero -->
        <div class="mb-20">
            <span class="section-num reveal">02 — AI Voice Agent</span>
            <h2 class="display-lg text-white max-w-2xl reveal reveal-delay-1">Meet Lena.<br>She Closes While<br>You Sleep.</h2>
            <p class="text-white/50 mt-4 max-w-xl font-light leading-relaxed reveal reveal-delay-2">
                An autonomous voice agent that handles inbound and outbound calls with human-like fluency — qualifying leads, booking appointments, and doing live transfers.
            </p>
            <div class="flex flex-wrap items-center gap-6 mt-8 reveal reveal-delay-3">
                <a href="tel:+18883085286" class="btn-ghost">
                    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                    Call Demo: +1 (888) 308-5286
                </a>
                <div class="live-badge">
                    <span class="live-dot"></span>
                    Live now
                </div>
            </div>
        </div>

        <!-- Waveform decorative -->
        <div class="waveform mb-20 reveal" aria-hidden="true">
            <!-- 48 bars at varying heights -->
            <div class="waveform__bar" style="height:30%"></div><div class="waveform__bar" style="height:55%"></div><div class="waveform__bar" style="height:40%"></div><div class="waveform__bar" style="height:80%"></div><div class="waveform__bar" style="height:60%"></div><div class="waveform__bar" style="height:45%"></div><div class="waveform__bar" style="height:90%"></div><div class="waveform__bar" style="height:70%"></div><div class="waveform__bar" style="height:50%"></div><div class="waveform__bar" style="height:100%"></div><div class="waveform__bar" style="height:75%"></div><div class="waveform__bar" style="height:55%"></div><div class="waveform__bar" style="height:85%"></div><div class="waveform__bar" style="height:65%"></div><div class="waveform__bar" style="height:40%"></div><div class="waveform__bar" style="height:95%"></div><div class="waveform__bar" style="height:70%"></div><div class="waveform__bar" style="height:50%"></div><div class="waveform__bar" style="height:80%"></div><div class="waveform__bar" style="height:60%"></div><div class="waveform__bar" style="height:45%"></div><div class="waveform__bar" style="height:75%"></div><div class="waveform__bar" style="height:35%"></div><div class="waveform__bar" style="height:90%"></div><div class="waveform__bar" style="height:55%"></div><div class="waveform__bar" style="height:70%"></div><div class="waveform__bar" style="height:40%"></div><div class="waveform__bar" style="height:85%"></div><div class="waveform__bar" style="height:60%"></div><div class="waveform__bar" style="height:95%"></div><div class="waveform__bar" style="height:75%"></div><div class="waveform__bar" style="height:50%"></div><div class="waveform__bar" style="height:65%"></div><div class="waveform__bar" style="height:45%"></div><div class="waveform__bar" style="height:80%"></div><div class="waveform__bar" style="height:30%"></div><div class="waveform__bar" style="height:55%"></div><div class="waveform__bar" style="height:70%"></div><div class="waveform__bar" style="height:90%"></div><div class="waveform__bar" style="height:60%"></div><div class="waveform__bar" style="height:40%"></div><div class="waveform__bar" style="height:75%"></div><div class="waveform__bar" style="height:50%"></div><div class="waveform__bar" style="height:85%"></div><div class="waveform__bar" style="height:65%"></div><div class="waveform__bar" style="height:35%"></div><div class="waveform__bar" style="height:55%"></div><div class="waveform__bar" style="height:45%"></div>
        </div>

        <!-- Conversation scenarios -->
        <div class="mb-24">
            <h3 class="text-sm font-bold tracking-widest uppercase text-white/30 mb-12 reveal">How Lena Handles Calls</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Interested -->
                <div class="lux-card lux-card--gold-accent p-8 reveal">
                    <div class="overline mb-6">Interested</div>
                    <div>
                        <div class="transcript-line">
                            <span class="transcript-speaker" style="color:var(--muted)">Lead</span>
                            <span class="transcript-text">"Yes, I'm looking to sell."</span>
                        </div>
                        <div class="transcript-line">
                            <span class="transcript-speaker" style="color:var(--gold)">Lena</span>
                            <span class="transcript-text">"I can have our acquisitions manager call you. Does 2 PM work?"</span>
                        </div>
                    </div>
                    <p class="text-xs mt-5 font-light italic" style="color:rgba(197,160,89,0.6)">Appointment booked. CRM updated automatically.</p>
                </div>
                <!-- Not Interested -->
                <div class="lux-card p-8 reveal reveal-delay-1">
                    <div class="overline mb-6" style="color:rgba(220,38,38,0.6)">Not Interested</div>
                    <div>
                        <div class="transcript-line">
                            <span class="transcript-speaker" style="color:var(--muted)">Lead</span>
                            <span class="transcript-text">"Stop calling me."</span>
                        </div>
                        <div class="transcript-line">
                            <span class="transcript-speaker" style="color:var(--muted)">Lena</span>
                            <span class="transcript-text">"Understood. I'll remove you from our list right now. Have a great day."</span>
                        </div>
                    </div>
                    <p class="text-xs mt-5 font-light italic text-white/25">Gracefully removed. DNC list updated.</p>
                </div>
                <!-- Voicemail -->
                <div class="lux-card p-8 reveal reveal-delay-2">
                    <div class="overline mb-6" style="color:rgba(197,160,89,0.5)">Voicemail</div>
                    <div>
                        <div class="transcript-line">
                            <span class="transcript-speaker" style="color:var(--muted)">System</span>
                            <span class="transcript-text">"Please leave a message..."</span>
                        </div>
                        <div class="transcript-line">
                            <span class="transcript-speaker" style="color:var(--muted)">Lena</span>
                            <span class="transcript-text">"Hey, this is Lena about your property. Call us back when you get a chance."</span>
                        </div>
                    </div>
                    <p class="text-xs mt-5 font-light italic text-white/25">Personalized voicemail drop. No wasted time.</p>
                </div>
            </div>
        </div>

        <!-- Capabilities -->
        <div class="mb-24">
            <h3 class="text-sm font-bold tracking-widest uppercase text-white/30 mb-12 reveal">Capabilities</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="lux-card p-8 reveal">
                    <svg class="mb-4 text-gold" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" style="color:var(--gold)" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                    <h4 class="font-bold text-white mb-2">Inbound Handling</h4>
                    <p class="text-white/40 text-sm leading-relaxed font-light">Never miss a return call. Lena answers 24/7, qualifies leads, and books appointments directly into your CRM.</p>
                </div>
                <div class="lux-card p-8 reveal reveal-delay-1">
                    <svg class="mb-4" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" style="color:var(--gold)" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                    <h4 class="font-bold text-white mb-2">Outbound Power Dialing</h4>
                    <p class="text-white/40 text-sm leading-relaxed font-light">Thousands of calls per day. Lena navigates gatekeepers, leaves voicemails, and detects answering machines.</p>
                </div>
                <div class="lux-card p-8 reveal reveal-delay-2">
                    <svg class="mb-4" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" style="color:var(--gold)" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    <h4 class="font-bold text-white mb-2">Instant Live Transfer</h4>
                    <p class="text-white/40 text-sm leading-relaxed font-light">When a lead is hot, Lena transfers the call to your acquisitions team in real-time with full context.</p>
                </div>
            </div>
        </div>

        <!-- Voice Pricing -->
        <div>
            <h3 class="text-sm font-bold tracking-widest uppercase text-white/30 mb-12 reveal">Pricing</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 max-w-2xl reveal">
                <div class="pricing-col">
                    <div class="overline mb-4">One-Time Setup</div>
                    <div class="pricing-price mb-1">Free</div>
                    <div class="text-white/30 text-xs mb-6 font-light">Fully configured and ready to dial</div>
                    <ul class="space-y-3 text-sm text-white/50 font-light">
                        <li><span class="pricing-check">✓</span>Custom Script Configuration</li>
                        <li><span class="pricing-check">✓</span>Voice Cloning Available</li>
                        <li><span class="pricing-check">✓</span>CRM Integration</li>
                    </ul>
                </div>
                <div class="pricing-col pricing-col--featured">
                    <div class="overline mb-4">Usage Rate</div>
                    <div class="pricing-price mb-1">$0.05<span class="pricing-unit">/min</span></div>
                    <div class="text-white/30 text-xs mb-6 font-light">Billed per minute. Inbound &amp; outbound.</div>
                    <a href="../apply/" class="btn-gold block text-center">Get Started</a>
                </div>
            </div>
        </div>

    </div>
</section>
```

**Step 2: Verify** — Voice section renders below divider. Waveform graphic visible. Transcript cards show 3 scenarios. Capabilities 3-col. Pricing 2-col.

---

### Task 7: Write the CTA Band and update Footer

**Files:**
- Modify: `ai-automations/index.html` — add CTA band before `</main>`, fix footer links (relative paths are broken at depth 1)

**Step 1: Insert CTA band before `</main>`**

```html
<!-- CTA Band -->
<section class="py-24 relative z-10" style="background:#1A1A1A;">
    <div class="container mx-auto px-6 lg:px-8 max-w-5xl text-center">
        <hr class="gold-rule mb-20">
        <h2 class="display-lg text-white mb-6 reveal">Ready to automate<br>your pipeline?</h2>
        <p class="text-white/40 max-w-lg mx-auto mb-10 font-light leading-relaxed reveal reveal-delay-1">Apply today and we'll have your SMS campaign and AI voice agent live within 48 hours.</p>
        <a href="../apply/" class="btn-gold reveal reveal-delay-2">Apply Now</a>
    </div>
</section>
```

**Step 2: Fix broken footer links** — Footer currently uses relative-to-root paths that break at `/ai-automations/`. Update these 4 links:

- `industries/real-estate/` → `../industries/real-estate/`
- `apply/` → `../apply/`
- `crm/` → `../crm/`
- `case-studies/` → `../case-studies/`

(The legal links `/terms/`, `/privacy/`, `/refund-policy/` use absolute paths — leave them as-is.)

**Step 3: Verify** — CTA band renders above footer. Footer links navigate correctly.

---

### Task 8: Replace JavaScript — remove old, add new

**Files:**
- Modify: `ai-automations/index.html` — replace the entire `<script>` block (lines 1321–1430 approx)

**Step 1: Replace with new JS**

```html
<script>
// ---- Reveal on scroll ----
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ---- Number counters ----
function animateCount(el) {
    const target = parseFloat(el.dataset.countTo);
    const suffix = el.dataset.countSuffix || '';
    const decimals = parseInt(el.dataset.countDecimals || '0');
    const duration = 1800;
    const start = performance.now();
    function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = target * eased;
        el.textContent = (decimals > 0 ? current.toFixed(decimals) : Math.floor(current).toLocaleString()) + suffix;
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.dataset.countTo) {
            animateCount(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count-to]').forEach(el => counterObserver.observe(el));

// ---- Section nav active state on scroll ----
const sections = document.querySelectorAll('#sms, #voice');
const tabs = document.querySelectorAll('.section-nav__tab');
const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            tabs.forEach(t => t.classList.remove('active'));
            const activeTab = document.querySelector(`.section-nav__tab[data-tab="${entry.target.id}"]`);
            if (activeTab) activeTab.classList.add('active');
        }
    });
}, { threshold: 0.3 });
sections.forEach(s => navObserver.observe(s));
</script>
```

**Step 2: Verify** — Numbers count up when scrolled into view. Section nav tab highlights update as user scrolls between #sms and #voice. No console errors.

---

### Task 9: Final cleanup and validation

**Files:**
- Modify: `ai-automations/index.html` — remove orphaned HTML from old toggle system

**Step 1: Remove any remaining old markup** — Search for and delete:
- Any remaining `id="toggle-pill"`, `id="btn-sms"`, `id="btn-ai"` elements
- Any remaining `<div class="tech-bg">` or `<div class="particles">` elements
- The old `<div class="toggle-container ...">` block in the hero

**Step 2: Full visual review**
- Hero: charcoal bg, left gold rule, headline, 2 CTAs ✓
- Section nav strip sticky below header ✓
- SMS: stats animate, steps connected, comparison 2-col, features 2-col, pricing 3-col ✓
- Divider: gold rules + diamond ✓
- Voice: waveform graphic, 3 transcript cards, capabilities 3-col, pricing 2-col ✓
- CTA band: dark bg, gold rule, headline, button ✓
- Footer links all navigate correctly ✓
- Mobile: no horizontal scroll, stats stack, grids go single column ✓

**Step 3: Commit**

```bash
git add ai-automations/index.html
git commit -m "Redesign ai-automations page: dark luxury aesthetic with Montserrat typography"
```
