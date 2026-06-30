# VA Horizon — SEO / GEO / AEO Intelligence & Action Plan

**Generated:** 2026-06-30 (autonomous SE Ranking agent session)
**Data source:** SE Ranking MCP — project `vahorizon.site` (site_id `12523808`), Google US database
**Account budget at start:** 100,000 units (fresh, expires 2026-07-14)

---

## 0. TL;DR — the one thing that matters

The site is **content-rich and technically clean** (316 pages, audit health 97/100, 0 orphans, AI-crawler-friendly robots.txt, llms.txt present, FAQ schema everywhere). The single bottleneck holding back all 316 pages is **domain authority**:

- **Domain Trust = 1 / 100.** InLink Rank 1, Domain InLink Rank 1.
- **Backlinks: 26 total, 22 referring domains, but only 3 dofollow links from 1 dofollow referring domain.**
- That entire profile is **auto-generated spam** (emoji "Domain Report 👲 / URL Shared ❤️ / Website Stats 📊" link networks) plus **one negative-SEO link** (`seo-high-ranking.shop`). Not a single editorial link.

Target commercial keywords are **low difficulty (KD 6–19)** and the SERPs are wide open — competitors are not strong on the wholesaling-VA niche terms. **The only reason the site ranks pos 14–56 instead of pos 1–10 is the authority gap.** Everything in the roadmap below ladders up to: *earn real editorial links + keep shipping citable content.*

---

## 1. What was configured in SE Ranking this session

| Item | Before | After |
|------|--------|-------|
| Tracked keywords | 16 (mostly brand) | **58**, organized into 7 groups (Services & Commercial, Comparisons & Alternatives, Seller Lead Types, Cold Calling/Dialer/Scripts, CRM/Tools/Pricing, AEO Questions, Brand) |
| AI engines (AEO) | 1 (ChatGPT) | **5** — ChatGPT, Google AI Overview, Google AI Mode, Perplexity, Gemini |
| AEO prompts | 9 generic | **20** (cap), incl. buyer-intent ("best cold calling VA company for real estate wholesalers", "how much does a real estate cold calling VA cost", "Egyptian vs Filipino VAs", etc.) + brand ("VA Horizon reviews", "is VA Horizon legit") |
| Tracked competitors | 5 weak peers (DT 0–1) | noaccentcallers (DT35), **getcallers (DT49), myoutdesk (DT72), virtudesk (DT67)**, leadnationva |
| Disavowed backlinks | 0 | **21** toxic/spam URLs submitted |
| Position check | stale | **re-run for all 58 keywords** (populating) |
| AI Result Tracker | idle | **checks running** across 5 engines × 20 prompts (populating over hours/days) |

> Note: SE Ranking limits this plan to **20 AEO prompts/site** and **5 tracked competitors/site**. Both are now maxed with the highest-value entries.

---

## 2. Key findings (data I could not see before this tool)

### 2a. Authority / backlink gap — the P0 problem
| Domain | Domain Trust | Ref domains | Dofollow ref domains |
|--------|-------------|-------------|----------------------|
| **vahorizon.site** | **1** | 22 (all junk) | **1** |
| noaccentcallers.com | 35 | 120 | 96 |
| virtudesk.com | 67 | 56 | 27 |
| getcallers.com | 49 | 304 | 172 |
| myoutdesk.com | 72 | 1,851 | 1,211 |

The closest direct competitor (No Accent Callers) earns links with clean branded/anchor text ("No Accent Callers", "real estate cold calling") from real US sites. VA Horizon has **none**.

### 2b. AEO / GEO — already winning the core query in ChatGPT, invisible everywhere else
- SE Ranking's historical AI crawl DB shows `link_presence 0` (it lags for new sites), **but the live AI Result Tracker check (2026-06-30) tells the real story:**
  - **ChatGPT cites VA Horizon at position 1** for "best cold calling virtual assistant company for real estate wholesalers" (url + mention rank 1).
  - **Ranks #1 for "is VA Horizon legit" and "VA Horizon reviews"** (brand reputation is intact in AI answers).
  - ChatGPT overall: link-presence 27%, mention-presence 15%, 55% of answers carry sources.
  - **Gap:** position 0 (not cited) for the non-branded money prompts — "best CRM for real estate wholesalers", "how much does a real estate cold calling VA cost", "best appointment setting service", "Egyptian vs Filipino VAs". These are the AEO targets to win next.
- Also corrected this session: the project's 9 original AI prompts were **irrelevant auto-generated generic prompts** (cloud storage, outdoor gear, investment strategies) — replaced with 9 niche buyer/research prompts.
- SERP feature data shows **AI Overviews (SGE) and People-Also-Ask on the large majority of niche keywords.** AEO is not optional in this market.
- **Competitor GEO playbook (MyOutDesk):** they hold **position 1 *inside* AI Overviews** (`block_type: "sge"`) for "virtual assistant companies", "best virtual assistant companies", "what is a virtual assistant", "zillow vs realtor" — all **comparison / definitional blog content**. VA Horizon already has the right page *types* (`/compare/`, `/alternatives/`, `/guides/`, `/glossary/`) — it needs authority + tighter on-page citability to win the same boxes.

### 2c. Current rankings (project tracker, 2026-06-30) — striking distance
| Keyword | Vol | Pos | Landing page | Note |
|---------|-----|-----|--------------|------|
| va horizon | 10 | **2** | / | brand, fine |
| wholesaling va cold calling | — | **4** | /compare/best-cold-calling-va-companies/ | almost page-1 |
| virtual horizon | 170 | **14** | / | brand-adjacent, winnable |
| horizon v | 40 | 16 | / | |
| va cold calling | 40 ($15 CPC) | **20** | /blog/how-to-hire-cold-calling-va.../ | high value |
| virtual assistant real estate wholesaling | 10 | 24 | /industries/real-estate/ | |
| crm for real estate wholesalers | 70 | **34** | /compare/best-crm-for-real-estate-wholesalers/ | high value |
| **Not ranking (top targets):** real estate VA (320) · wholesaling leads (110) · va cold callers (40, $15 CPC) · horizons website (480) | | 0 | — | authority-blocked |

### 2d. Technical audit (SE Ranking crawl, 307 pages, score 97)
- **3 errors:** 2 duplicate titles (`/services/` vs `/solutions/real-estate-wholesalers/`) — **FIXED this session**; 1 × `4xx` on `/cdn-cgi/l/email-protection` — benign Cloudflare email-obfuscation artifact, not a real page.
- **18 warnings:** 16 "external links → 4XX" are **FALSE POSITIVES** — they are authoritative citations (Trustpilot, WSGR law firm, plannedgiving.com, legiscan.com, ilga.gov) that return 403/timeout to *bots* but work for users. **Do NOT remove them** — they strengthen E-E-A-T. Remaining: 1 internal link → 3xx, 1 redirect.
- **Notices worth a pass:** 153 titles > 65 chars (selective trim recommended on commercial pages — worst is `/guides/ai-cold-calling-real-estate/` at 97 chars), 3 pages with < 3 inbound links.

---

## 3. Actions completed this session
1. ✅ **Disavowed 21 toxic/spam backlinks** (link-network + negative-SEO `seo-high-ranking.shop`). *User step: export the disavow file from SE Ranking → upload to Google Search Console.*
2. ✅ **Fixed title/H1 cannibalization** — `/solutions/real-estate-wholesalers/` retitled to **"Virtual Assistants for Real Estate Wholesalers"** (distinct from the `/services/` hub, and captures a tracked commercial phrase). Regenerated + built + verified (316 pages, 0 orphans).
3. ✅ **Regenerated `llms.txt`** (310 URLs / 15 sections) to reflect current content.
4. ✅ **Built the full SE Ranking measurement layer** (58 keywords, 5 AI engines, 20 AEO prompts, 4 authority competitors) so progress is now trackable.
5. ✅ **Verified robots.txt is already best-practice for GEO** (explicitly allows GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, anthropic-ai, PerplexityBot; blocks CCBot training).

---

## 4. Prioritized roadmap

### P0 — Authority (off-site; the real unlock — needs the owner)
1. **Earn editorial backlinks.** Highest-leverage moves, in order:
   - **Get listed in "best real estate VA companies" round-ups** (e.g., theclose.com, and similar listicles that already rank for "real estate virtual assistant"). These are the pages AI Overviews cite.
   - **HARO / Qwoted PR** (a `qwoted-seo-backlinks` skill is installed): build a sourced statistics page, then pitch journalists for high-DR links. This doubles as AEO citation bait.
   - **Niche directories + partnerships** (REI communities, wholesaling tool vendors, podcast guesting).
2. **Connect Google Search Console to SE Ranking** (OAuth) — currently not linked, so real query/click data is missing from the platform.
3. **Deploy this session's changes** to production (persona dedup, llms.txt, sitemap) so the next crawl reflects them.

### P1 — On-site (mostly done / low-risk)
- ✅ Cannibalization fix, ✅ disavow, ✅ llms.txt.
- Selective **title trim** on the worst > 80-char commercial titles (start: `/guides/ai-cold-calling-real-estate/`). Do *not* mass-trim — preserve keyword-rich titles.
- Minor: lift `/pricing/cold-calling-va-pricing-explained/`, `/guides/wholesaling-real-estate-no-money/`, `/services/appointment-setting-va/` above 3 inbound links via contextual links from sibling pages.

### P2 — AEO content (build authority + citations over time)
- **Add a sourced "Real Estate Wholesaling & Cold Calling Statistics 2026" linkable-asset page** — every stat attributed to a real source. This is the #1 AEO/backlink content move (citation magnet + PR pitch asset). *Must be fact-checked before publishing.*
- **Strengthen the "real estate virtual assistant" (vol 320) target** toward the listicle/AI-Overview format that wins that SERP.
- **Match MyOutDesk's winning format** on existing `/compare/` and `/guides/` pages: crisp definitional answer in the first 1–2 sentences under each H2, comparison tables, and PAA-aligned FAQ entries (maximizes AI-Overview citation odds).

---

## 5. Autonomous continuation
A recurring check-in is scheduled to keep this running across the 24h window. Each pass: reads the latest SE Ranking position-check + AI Result Tracker results, compares to this baseline, ships the next-highest-value safe optimization, and appends progress here.

**Baseline to measure against (2026-06-30):** DT 1 · visibility 0.72% · avg pos 56 · top10 = 2 keywords · AI presence 0.
