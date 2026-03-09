# Blog Posts + Index Fixes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Write 4 new blog posts matching the cold calling VA post style, and fix 3 bugs in the blog index.

**Architecture:** Each blog is a standalone `index.html` in its own directory under `/blog/`. All match the 4-col (TOC + prose) layout, Key Takeaways, callout boxes, FAQ details/summary, CTA. Bug fixes are in `blog/index.html`.

**Tech Stack:** Static HTML, Tailwind (local), va-custom.css, Montserrat from fonts.css.

---

### Task 1: Fix blog/index.html bugs

**Files:**
- Modify: `blog/index.html`

**Bug 1:** Add `<style>` block defining `.hero-blog` with full dot-grid hero pattern.
**Bug 2:** Add `<div id="mobile-menu" role="dialog" aria-label="Mobile menu"></div>` after `</header>`.
**Bug 3:** Change `href="#contact"` in navbar to `href="/apply/"`.

---

### Task 2: Write SMS Blast blog post

**Files:**
- Create: `blog/sms-blast-real-estate-wholesaling/index.html`

**Content outline (12 sections):**
1. Why SMS Outperforms Most Outbound Channels for Wholesaling
2. A2P 10DLC Compliance: What It Is and Why You Can't Skip It
3. List Strategy: Who to SMS and When
4. Message Templates That Actually Get Responses
5. Blast vs. Drip: When to Use Each
6. Combining SMS with Cold Calling for Full Coverage
7. Opt-Out Handling and Legal Requirements
8. Timing: Best Days and Hours to Send
9. What to Do When a Lead Responds
10. CRM Integration and Lead Routing
11. VA Horizon SMS Blast Service vs. DIY
12. Measuring Results: Metrics That Matter

---

### Task 3: Write VA vs In-House Cost Comparison blog post

**Files:**
- Create: `blog/real-estate-va-vs-in-house-assistant-cost/index.html`

**Content outline (10 sections):**
1. Why This Comparison Matters for Wholesalers
2. The True Cost of an In-House Employee
3. The True Cost of a VA
4. Salary and Benefits Breakdown
5. Ramp Time and Training Cost
6. Management Overhead
7. Replacement Cost
8. Performance Accountability
9. Side-by-Side Cost Table
10. When Each Option Makes Sense

---

### Task 4: Write How Many Cold Calls to Close a Deal blog post

**Files:**
- Create: `blog/how-many-cold-calls-to-close-wholesale-deal/index.html`

**Content outline (10 sections):**
1. The Real Numbers (Industry Benchmarks)
2. How List Quality Changes Everything
3. How Market Saturation Affects Contact Rates
4. Script and Caller Quality Variables
5. Follow-Up Cadence: Where Most Deals Are Lost
6. The Math: From Dials to Dollars
7. What 1 VA Produces Per Month (Real Numbers)
8. How to Improve Your Ratios
9. When the Numbers Aren't Working
10. Tracking the Right Metrics in Your CRM

---

### Task 5: Write PropStream vs BatchLeads blog post

**Files:**
- Create: `blog/propstream-vs-batchleads-real-estate-wholesalers/index.html`

**Content outline (10 sections):**
1. Why the Tool Choice Matters
2. Data Coverage and Quality
3. Skip Tracing Accuracy
4. Dialer Integration
5. List Building Features
6. Pricing Comparison
7. PropStream Strengths and Weaknesses
8. BatchLeads Strengths and Weaknesses
9. Side-by-Side Comparison Table
10. Which One Wins for What Use Case

---

### Task 6: Update blog/index.html cards

**Files:**
- Modify: `blog/index.html`

Update the 4 "Coming Soon" `<div>` cards to published `<a>` cards pointing to their new slugs. Update dates to March 2026.
