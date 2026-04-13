# MBank AI Financial Advisor — Updated Plan

> Last updated: 2026-04-13
> Based on mentor critique from hackathon judge (Amir)

---

## What We Got Wrong (The Debunk Summary)

The original plan built **PFM (Personal Finance Management) from 2015** — bill reminders, pie charts, savings progress bars. These are CRUD features, not AI. Judges will say: "Kaspi and Tinkoff already have this. Where's the AI?"

**The root mistake:** Features 1–3 (reminders, goals, charts) presented as the product. They should be invisible infrastructure that powers the AI.

**The one real differentiator:** The AI assistant — but it needs to be proactive, contextual, and have a personality system.

---

## Revised Strategy: AI-First, Everything Else Is Infrastructure

> "Don't show me a weather radar. Just tell me if I need an umbrella."

The app is not a dashboard with an AI chatbot bolted on.
It is an **AI agent** that happens to have access to bills, goals, and transactions under the hood.

### Design Principle
This is **not a standalone app**. It is the MBank AI Advisor feature — incorporated into the MBank app. Design must match MBank's exact brand: `#009C4D` green, white cards, `#EDEDED` background, Inter font, bottom tab navigation. No dark themes, no custom palettes.

---

## The 20% That Delivers 80% of the Pitch (Pareto)

### #1 — Tone of Voice Selector (Biggest Bang)
**What it is:** On first open, the AI asks: *"How should I talk to you?"*
- 👔 **Strict Banker** — only numbers, no small talk
- 🤗 **Caring Friend** — warm, encouraging, celebrates wins
- 💀 **Toxic Bro** — ruthlessly roasts your spending (user opted in, liability cleared)

**Why it wins:** Viral. Users screenshot toxic roasts and post to Instagram/TikTok → free marketing for MBank. Judges remember it. It's a 2-hour implementation with outsized demo impact.

### #2 — Cash Flow Forecasting (The Real AI)
**What it is:** Proactive warning, not reactive graph.

Instead of: *"You spent 35% on food this month"*
AI says: *"Aizat, you have 5 days until salary. Your balance is 10,400 KGS. Severelectro (1,240) and internet (650) bill in 3 days. Based on your Friday pattern, you usually spend ~2,000 on dining. You'll run short by ~500 KGS. Want me to lock 2,000 KGS now so you don't accidentally spend it?"*

**Why it wins:** This is actual AI behavior. Judges can see it's not a cron job.

### #3 — Proactive Goal Funding (Not a Progress Bar)
**What it is:** The AI finds money for goals instead of waiting for the user.

*"You spent 1,800 less on transport this month vs last month. Transfer it to your Emergency Fund? That puts you 2 months ahead of schedule."* → One tap: Yes.

**Why it wins:** Transforms a passive feature into an active agent. The bar moves without the user doing anything.

### #4 — NLP Transaction Search (Wow Moment in Demo)
**What it is:** Plain language search instead of filter dropdowns.

User types: *"How much did I spend at restaurants last month?"*
AI queries the mock data and responds: *"2,730 KGS across 3 transactions: Zia (1,800), Fatboy's (650), Coffee Boom (280)."*

**Why it wins:** Live demo moment. Audience sees AI that feels like talking to a human, not clicking a filter.

### #5 — AI Cross-Sell (Why MBank Cares = Why You Win)
**What it is:** AI notices behavioral patterns and suggests relevant MBank products contextually — not as ads, as advice.

*"You've bought plane tickets twice this month. MBank's premium card gives you free lounge access at Manas + air miles. That last trip would've been free. Want me to show you?"*

**Why it wins:** This is the business model. Judges always ask "how does MBank make money from this?" Now you have the answer.

---

## What Becomes Infrastructure (Invisible, But Required)

These still need to exist — they feed data to the AI:
- Bill tracker (due dates, amounts, statuses)
- Spending categories (auto-classified transactions)
- Savings goals (target, saved, deadline)
- Mock transaction history

They should not be pitched as features. They are **the AI's memory**.

---

## Design Direction

| Before | After |
|---|---|
| Dark navy `#050C1B` | Light `#EDEDED` background |
| Gold/amber accents | `#009C4D` MBank green |
| Sidebar navigation | Bottom tab bar (5 tabs) |
| Outfit + Playfair fonts | Inter only |
| Desktop-first layout | Mobile-first 390px |
| Standalone app feel | Part of MBank app feel |

**Reference:** The app should look like it was shipped by MBank's design team, not a hackathon team. Judges will notice.

---

## Next Steps (Prioritized by Impact)

### Step 1 — Redesign to MBank Brand (Foundation) 🎨
*Without this, everything else looks unprofessional at the pitch.*
- [ ] Swap dark theme → light MBank theme (globals.css)
- [ ] Replace sidebar → 5-tab bottom navigation
- [ ] Fix fonts: Inter only, remove Outfit/Playfair
- [ ] Update all page colors: green primary, white cards, `#EDEDED` bg
- [ ] Mobile shell at 390px centered on desktop

### Step 2 — Tone of Voice Selector (Highest ROI) 🎭
*2 hours of work, maximum pitch memorability.*
- [ ] Onboarding screen: 3 personality options with preview
- [ ] Store selected tone in `localStorage`
- [ ] Pass tone to Claude system prompt (3 different system prompt variants)
- [ ] Show active persona indicator in assistant header

### Step 3 — Upgrade the AI Chat to Be Proactive 🤖
*The core pitch. Make the assistant feel like it knows the user.*
- [ ] Rewrite system prompt to include full financial context (bills, patterns, balance)
- [ ] Add cash flow forecast logic to system prompt context
- [ ] Make opening message proactive: AI greets with a specific insight, not generic "how can I help?"
- [ ] Add suggested prompts that trigger the best demo moments (cash flow, goal funding)

### Step 4 — NLP Transaction Search (Demo Wow Moment) 🔍
*One impressive live demo moment beats 10 slides.*
- [ ] Add a search input to the transactions section
- [ ] Route natural language queries through Claude API
- [ ] Claude returns structured answer from mock transaction data
- [ ] Works live in the demo: type "restaurants last month" → instant answer

### Step 5 — Polish the Demo Scenario 🎬
*Judges see a 3-minute demo. Make every second count.*
- [ ] Define the exact demo flow: Aizat's story (overdue bill → cash flow warning → goal suggestion → product cross-sell)
- [ ] Ensure every screen in the flow looks perfect
- [ ] The AI should proactively surface insights in the demo, not wait to be asked

---

## What to Cut (Don't Build These)

- ❌ Heatmap / complex charts — replace with one AI insight sentence
- ❌ Manual goal creation form (keep it, but don't demo it)
- ❌ The discover page as a separate "feature" — fold it into AI suggestions
- ❌ Generic pie chart on dashboard — AI says what it means instead

---

## The Pitch Line (Memorize This)

> "We built an AI agent that predicts when Aizat will run out of money before she does, finds savings she didn't know she had, and talks to her however she prefers — from strict banker to her most toxic friend. It increases MBank's DAU/MAU through daily engagement, and drives cross-sell through behavioral context."

That's the difference between last place and first place.
