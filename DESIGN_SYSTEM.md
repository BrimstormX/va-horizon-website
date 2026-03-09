# VA Horizon — Page Design System

Use this file when building or redesigning any VA Horizon landing page. Every rule here is in production on the site.

---

## Branding (Never Change)

| Token | Value |
|-------|-------|
| Navy (primary bg) | `#082541` / `#071e35` (deeper) |
| Gold (accent) | `#D4A02F` / `#C39A26` (darker) / `#f0c84a` (lighter) |
| Warm off-white | `#F6F1E8` |
| Cool off-white | `#EEF4FF` |
| Divider/border | `#e8e4dc` |
| Body font | **Montserrat** — loaded from `/fonts.css`. Class: `font-montserrat`. DO NOT add Google Fonts or change this. |
| Heading size scale | `text-4xl lg:text-5xl` (section H2), `text-5xl sm:text-6xl lg:text-7xl` (H1 hero) |
| Heading weight | `font-black` (H1/H2), `font-bold` (H3) |
| Letter spacing on headings | `style="letter-spacing: -0.02em;"` |

---

## CSS Architecture

All pages include these stylesheets in this order — do not change the order:

```html
<link rel="stylesheet" href="/fonts.css">
<link rel="stylesheet" href="/VAHorizonWebsiteStyle/_components/v1/93bdfffda6e0bf9a7fd91429ea912af65458e738.css?v=3">
<link rel="stylesheet" href="/cards.css?v=3">
<link rel="stylesheet" href="/css/va-custom.css">
<link rel="stylesheet" href="/css/tailwind.min.css">
```

Add a `<style>` block after these for page-specific styles.

---

## Component Library (Copy-Paste Ready)

### Section Label (Gold Pill Badge)
Place above every section heading. On dark backgrounds, use the dark-variant.

```html
<!-- Light background -->
<span class="section-label">Label Text</span>

<!-- Dark background -->
<span class="section-label" style="background: rgba(212,160,47,0.15); border-color: rgba(212,160,47,0.4); color: #f0c84a;">Label Text</span>
```

```css
.section-label {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.35rem 0.9rem;
    background: rgba(212,160,47,0.1);
    border: 1px solid rgba(212,160,47,0.3);
    border-radius: 999px;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #C39A26;
    margin-bottom: 1rem;
}
.section-label-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #D4A02F;
}
```

### Gold Rule (Decorative Horizontal Line)
Use above CTA section headings.

```html
<span class="gold-rule mx-auto mb-8"></span>
```

```css
.gold-rule {
    display: block;
    width: 56px;
    height: 3px;
    background: linear-gradient(90deg, #D4A02F, #f0c84a);
    border-radius: 2px;
}
```

---

## Section Patterns

### Hero Section
Dark navy with dot-grid texture, dual radial gradient for depth. Use for every page hero.

```css
.hero-X {
    background: #071e35;
    position: relative;
    overflow: hidden;
}
/* Right-side gold glow + left darkening */
.hero-X::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
        radial-gradient(ellipse 900px 600px at 110% 50%, rgba(212,160,47,0.13) 0%, transparent 65%),
        radial-gradient(ellipse 600px 800px at -10% 60%, rgba(8,37,65,0.6) 0%, transparent 70%);
    pointer-events: none;
}
/* Dot-grid texture */
.hero-X::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px);
    background-size: 28px 28px;
    pointer-events: none;
}
.hero-X-inner { position: relative; z-index: 2; }
```

Hero HTML structure:
```html
<section class="hero-X py-24 lg:py-36">
    <div class="hero-X-inner container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-5xl mx-auto text-center">
            <span class="section-label fade-up"><span class="section-label-dot"></span> Label</span>
            <h1 class="font-montserrat text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight fade-up delay-1"
                style="letter-spacing: -0.02em; text-wrap: balance;">
                Headline with <span style="color: #D4A02F;">Gold Accent</span>
            </h1>
            <p class="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed fade-up delay-2">Subtext</p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center fade-up delay-3">
                <a href="/apply/" class="btn btn-xl btn-primary">Apply Now</a>
                <a href="/apply/" class="btn btn-xl btn-secondary">Book a Call Today</a>
            </div>
        </div>
    </div>
</section>
```

### Stats Bar
White bar with bordered stat items. Place directly after the hero. Use page-relevant numbers.

```html
<div class="stats-bar">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-wrap" style="border-left: 1px solid #e8e4dc;">
            <div class="stat-item">
                <div class="stat-num">48<span>h</span></div>
                <div class="stat-label">Label Text</div>
            </div>
            <!-- repeat stat-items -->
        </div>
    </div>
</div>
```

```css
.stats-bar { background: #fff; border-bottom: 1px solid #e8e4dc; }
.stat-item {
    display: flex; flex-direction: column; align-items: center;
    padding: 1.5rem 2rem;
    border-right: 1px solid #e8e4dc;
    flex: 1;
}
.stat-item:last-child { border-right: none; }
.stat-num {
    font-family: 'Montserrat', ui-sans-serif, system-ui, sans-serif;
    font-size: clamp(2rem, 3.5vw, 2.75rem);
    font-weight: 900;
    color: #082541;
    line-height: 1;
}
.stat-num span { color: #D4A02F; }
.stat-label {
    font-size: 0.75rem; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.08em;
    color: #6b7280; margin-top: 0.4rem; text-align: center;
}
```

### Feature Cards (Why / What's Inside)
Cards with animated gold top-border on hover, dark icon background, faded number watermark.

```html
<div class="why-card">
    <span class="why-number">01</span>
    <div class="why-icon">
        <!-- SVG icon with stroke="#D4A02F" -->
    </div>
    <h3 class="text-xl font-bold text-va-navy mb-3">Card Title</h3>
    <p class="text-va-dark/65 text-sm leading-relaxed">Description text.</p>
</div>
```

```css
.why-card {
    background: #fff;
    border: 1px solid #e8e4dc;
    border-radius: 20px;
    padding: 2.5rem;
    position: relative;
    overflow: hidden;
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}
.why-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, #D4A02F, #f0c84a);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
}
.why-card:hover { transform: translateY(-5px); box-shadow: 0 20px 50px rgba(8,37,65,0.1); border-color: rgba(212,160,47,0.4); }
.why-card:hover::before { transform: scaleX(1); }
.why-icon {
    width: 56px; height: 56px;
    border-radius: 14px;
    background: linear-gradient(135deg, #082541, #1b4c7b);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 1.5rem;
    box-shadow: 0 8px 20px rgba(8,37,65,0.2);
}
.why-number {
    font-family: 'Montserrat', sans-serif;
    font-size: 4rem; font-weight: 900; line-height: 1;
    color: rgba(212,160,47,0.15);
    position: absolute; top: 1.5rem; right: 2rem;
    letter-spacing: -0.02em;
}
```

### Workflow / Step Grid
Tile grid (3-col) with large numbers. Use bordered grid container with `overflow-hidden`.

```css
.workflow-section { background: #F6F1E8; }
.workflow-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
}
@media (max-width: 768px) { .workflow-grid { grid-template-columns: 1fr; } }
.workflow-step {
    background: #fff;
    padding: 2rem;
    position: relative;
    transition: background 0.2s ease;
}
.workflow-step:hover { background: #fffcf7; }
.workflow-step-num {
    font-family: 'Montserrat', sans-serif;
    font-size: 3.5rem; font-weight: 900;
    color: #082541; line-height: 1;
    margin-bottom: 0.75rem;
}
.workflow-step-num sup { font-size: 1.25rem; vertical-align: super; color: #D4A02F; }
```

### Before/After Comparison Table
Color-coded: red tints for "Before", gold tints for "After". Use `border border-[#e8e4dc]` on wrapper.

- Before header: `background: #fff5f5;`, text: `color: #ef4444`
- After header: `background: rgba(212,160,47,0.06);`, text: `color: #C39A26`
- Before cells: `background: #fff5f5;`
- After cells: `background: rgba(212,160,47,0.04);`

### Tool Badges (Integrations)
Premium badges with gold dot and hover lift. Replace plain pill spans.

```html
<span class="tool-badge"><span class="tool-dot"></span>ToolName</span>
```

```css
.tool-badge {
    display: inline-flex; align-items: center; gap: 0.5rem;
    padding: 0.6rem 1.25rem;
    background: #fff; border: 1px solid #e8e4dc; border-radius: 10px;
    font-weight: 600; font-size: 0.875rem; color: #082541;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}
.tool-badge:hover { border-color: rgba(212,160,47,0.6); box-shadow: 0 4px 12px rgba(212,160,47,0.15); transform: translateY(-2px); }
.tool-dot { width: 7px; height: 7px; border-radius: 50%; background: #D4A02F; flex-shrink: 0; }
```

### FAQ Accordion
Interactive expand/collapse. First item open by default.

```html
<div class="faq-item open">
    <button class="faq-trigger" aria-expanded="true">
        <span class="faq-trigger-text">Question text?</span>
        <span class="faq-icon">
            <svg ...plus icon...></svg>
        </span>
    </button>
    <div class="faq-body open">
        <div class="faq-body-inner">Answer text.</div>
    </div>
</div>
```

```css
.faq-item { background: #fff; border: 1px solid #e8e4dc; border-radius: 14px; overflow: hidden; transition: border-color 0.2s ease, box-shadow 0.2s ease; }
.faq-item.open { border-color: rgba(212,160,47,0.5); box-shadow: 0 4px 20px rgba(212,160,47,0.08); }
.faq-trigger { width: 100%; text-align: left; padding: 1.4rem 1.75rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; cursor: pointer; background: none; border: none; font-family: inherit; }
.faq-trigger-text { font-weight: 700; font-size: 1rem; color: #082541; }
.faq-icon { width: 28px; height: 28px; border-radius: 50%; background: #F6F1E8; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background 0.2s ease, transform 0.3s ease; }
.faq-item.open .faq-icon { background: #D4A02F; transform: rotate(45deg); }
.faq-icon svg { color: #082541; transition: color 0.2s ease; }
.faq-item.open .faq-icon svg { color: #fff; }
.faq-body { max-height: 0; overflow: hidden; transition: max-height 0.35s ease; }
.faq-body.open { max-height: 400px; }
.faq-body-inner { padding: 0 1.75rem 1.5rem; color: rgba(8,37,65,0.75); font-size: 0.95rem; line-height: 1.7; }
```

```js
// FAQ accordion JS (add before </body>)
document.querySelectorAll('.faq-trigger').forEach(function(btn) {
    btn.addEventListener('click', function() {
        var item = this.closest('.faq-item');
        var body = item.querySelector('.faq-body');
        var isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(function(el) {
            el.classList.remove('open');
            el.querySelector('.faq-body').classList.remove('open');
            el.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
            item.classList.add('open');
            body.classList.add('open');
            this.setAttribute('aria-expanded', 'true');
        }
    });
});
```

### CTA Section (Footer)
Dark navy with top gold gradient line and radial glow from below.

```css
.cta-section { background: #071e35; position: relative; overflow: hidden; }
.cta-section::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 800px 500px at 50% 100%, rgba(212,160,47,0.12) 0%, transparent 65%);
    pointer-events: none;
}
.cta-section::after {
    content: '';
    position: absolute;
    top: -1px; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent 0%, #D4A02F 50%, transparent 100%);
}
.cta-inner { position: relative; z-index: 2; }
```

### Fade-Up Entrance Animation
Apply to hero elements for staggered entrance.

```css
@keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
}
.fade-up { animation: fadeUp 0.6s ease both; }
.delay-1 { animation-delay: 0.1s; }
.delay-2 { animation-delay: 0.2s; }
.delay-3 { animation-delay: 0.3s; }
.delay-4 { animation-delay: 0.4s; }
```

---

## Section Background Rotation
Alternate these to create visual rhythm:

1. Dark hero (`#071e35`)
2. White stats bar
3. White (`bg-white`)
4. Warm (`#F6F1E8` / `workflow-section`)
5. White
6. Warm or `#F6F1E8`
7. Dark navy (`bg-va-navy`) — for "What You Get" type sections
8. Warm (`#F6F1E8`) — for FAQ
9. Dark (`cta-section`) — always last before footer

---

## Buttons

Use the existing button classes from the component library:

| Class | Use |
|-------|-----|
| `btn btn-xl btn-primary` | Primary gold CTA |
| `btn btn-xl btn-secondary` | Secondary navy outline CTA |
| `btn btn-lg btn-primary` | Navbar CTA |

---

## Screenshots / Image Sections
When a page has real screenshots (e.g. CRM page), present them in alternating left/right rows:

```html
<!-- Image left, text right -->
<div class="flex flex-col md:flex-row items-center gap-12">
    <div class="w-full md:w-1/2">
        <div class="rounded-2xl overflow-hidden border border-[#e8e4dc] shadow-lg">
            <img src="/img/screenshot.jpg" alt="..." class="w-full block">
        </div>
    </div>
    <div class="w-full md:w-1/2 space-y-4">
        <span class="section-label">Feature Name</span>
        <h3 class="font-montserrat text-2xl lg:text-3xl font-black text-va-navy" style="letter-spacing: -0.02em;">Heading</h3>
        <p class="text-va-dark/80 text-lg leading-relaxed">Description.</p>
    </div>
</div>

<!-- Image right, text left — add md:flex-row-reverse -->
```

---

## Rules Summary

- **Never add external fonts.** Montserrat only, served from `/fonts.css`.
- **Never change the color palette.** Navy + Gold + Warm only.
- **Always use section labels** (gold pill) above H2 headings.
- **Always use the FAQ accordion**, not static cards.
- **Always use the stats bar** after the hero — pick 4 relevant numbers.
- **Always use the CTA section pattern** (dark, gold rule above heading, gold glow).
- **Tool badges** replace plain pill spans in integrations sections.
- **Feature cards** use the `why-card` pattern with top-border reveal.
- **Workflow steps** use the tile grid pattern.
