# CLAUDE.md — Frontend Website Rules

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.

## Reference Images
- If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).
- Screenshot your output, compare against reference, fix mismatches, re-screenshot. Do at least 2 comparison rounds. Stop only when no visible differences remain or user says so.

## Local Server
- **Always serve on localhost** — never screenshot a `file:///` URL.
- Start the dev server: `node serve.mjs` (serves the project root at `http://localhost:3000`)
- `serve.mjs` lives in the project root. Start it in the background before taking any screenshots.
- If the server is already running, do not start a second instance.

## Screenshot Workflow
- Puppeteer is installed at `C:/Users/nateh/AppData/Local/Temp/puppeteer-test/`. Chrome cache is at `C:/Users/nateh/.cache/puppeteer/`.
- **Always screenshot from localhost:** `node screenshot.mjs http://localhost:3000`
- Screenshots are saved automatically to `./temporary screenshots/screenshot-N.png` (auto-incremented, never overwritten).
- Optional label suffix: `node screenshot.mjs http://localhost:3000 label` → saves as `screenshot-N-label.png`
- `screenshot.mjs` lives in the project root. Use it as-is.
- After screenshotting, read the PNG from `temporary screenshots/` with the Read tool — Claude can see and analyze the image directly.
- When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px"
- Check: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing

## Output Defaults
- Single `index.html` file, all styles inline, unless user says otherwise
- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
- Mobile-first responsive

## Brand Assets
- **This project is MBank.** Always read `DESIGN.md` before writing any frontend code for this project. It contains exact colors, typography, spacing, and component specs extracted from the real MBank app and official brand guidelines.
- Also check the `brand_assets/` folder if it exists for logos or additional assets.
- If assets exist there, use them. Do not use placeholders where real assets are available.
- If a logo is present, use it. If a color palette is defined, use those exact values — do not invent brand colors.

## MBank-Specific Rules (overrides Anti-Generic Guardrails below)
- **Font**: Inter only. No display/serif fonts. Brand guideline is explicit.
- **Primary color**: `#009C4D` green. No dark navy, no purple, no custom palettes.
- **Theme**: Light (white cards on `#EDEDED` background). Never dark theme.
- **Navigation**: Bottom tab bar (5 tabs). No sidebar. Mobile-first at 390px width.
- **Typography pairing rule is OVERRIDDEN**: Use Inter for both headings and body (brand requirement).
- **Grain/texture guardrail is OVERRIDDEN**: MBank uses clean flat surfaces, no textures.

## Anti-Generic Guardrails
- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Pick a custom brand color and derive from it.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity.
- **Typography:** Never use the same font for headings and body. Pair a display/serif with a clean sans. Apply tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply`.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane.

## Hard Rules
- Do not add sections, features, or content not in the reference
- Do not "improve" a reference design — match it
- Do not stop after one screenshot pass
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color

---

# Hackathon Role & Project Spec

## Role
You are a Senior Frontend Engineer and AI Specialist participating in a Fintech Hackathon. We have 24 hours to build a working AI Assistant integrated into an existing mobile banking app called "MBank" (Kyrgyzstan).
Your task is rapid prototyping (vibecoding). We need a pixel-perfect UI matching the existing app and a functional AI chat using Tool Calling.

## Tech Stack
- Next.js (App Router, React)
- Tailwind CSS (Crucial for styling)
- Lucide React (for icons)
- Vercel AI SDK (for LLM integration and Generative UI)
- Framer Motion (for smooth slide-up animations for the chat)
- NO DATABASE. Strict use of hardcoded mock data.

## Design System & UI Vibe (CRITICAL - MATCH THE SCREENSHOTS)
- App Container: Mobile-first. Wrap the main app in a container: `max-w-[400px] mx-auto h-screen bg-[#F5F7FA] overflow-hidden relative border shadow-xl`.
- Backgrounds: App background is very light gray (`bg-slate-50` or `#F5F7FA`). Cards are pure white (`bg-white`) with soft rounded corners (`rounded-2xl`) and very subtle shadows (`shadow-sm`).
- Colors:
  - Primary Brand (MBank Green): Use `bg-emerald-600` or `text-emerald-600` (Hex: #008D79 approx).
  - Text: Primary text is dark slate (`text-slate-900`), secondary text is gray (`text-slate-500`).
- Typography: Sans-serif, clean. Bold for balances, medium for titles.
- Currency Symbol: Use "С" (Kyrgyz Som) for all amounts. Example: `3 409,53 С`.

## Key Layout Requirement: Bottom Navigation
Create a fixed bottom navigation bar (`fixed bottom-0 w-full max-w-[400px] bg-white pt-2 pb-6 px-4 flex justify-between items-center z-40 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)]`).
It must have 5 items:
1. Главная (Home icon)
2. Платежи (Arrows icon)
3. **CENTER AI TRIGGER**: A floating circular button overlapping the nav bar. Background `bg-emerald-600`, with a white "M" or spark/bot icon. THIS BUTTON OPENS THE AI CHAT OVERLAY.
4. Сервисы (Grid icon)
5. Еще (Dots icon)

## Mock Data Structure (`lib/mockData.ts`)
Immediately create realistic data reflecting the screenshots:
- `user`: Name "Тимур", balances in KZT, USD, EUR, RUB.
- `cards`: VISA Infinite (balance: 3409.53 С), VISA Purple (balance: 0.19 С).
- `transactions`: Grouped by date ("Сегодня", "Вчера"). Must include fields: `title` (e.g., "Оплата по QR Тулпар", "MEGA"), `subtitle` (e.g., "Оплата по QR", "Сотовая связь"), `amount` (e.g., 17.00, 100.00), and `type` (expense/income).

## Core Feature: The AI Chat Overlay
When the central floating button is clicked, an AI chat interface must slide up (using Framer Motion) covering the screen (leaving the header maybe).
- The AI must have **Tool Calling** capabilities (e.g., `analyze_spending`, `setup_savings_goal`, `manage_subscriptions`).
- Generate UI components in the chat. If user asks "Where did my money go?", do not just send text. Call a tool that renders a React component showing a visual breakdown directly inside the chat message bubble.

## AI Persona (Hackathon Killer Feature)
Implement a state where the user can choose the AI's Tone of Voice before chatting:
- Persona A: "Заботливый" (Helpful, polite, standard banking bot).
- Persona B: "Токсичный бро" (Sarcastic, roasts the user for spending too much on coffee and taxis). Pass this persona into the LLM system prompt.

## First Steps (Priority Order)
1. Initialize the mobile shell with the exact Bottom Navigation described above.
2. Build a dummy "Home" screen with the user's cards and a "Financial Analysis" (За Март) widget.
3. Wire up the central floating button to open an empty slide-up Chat Overlay.

---

# Product Vision & Concept (Hackathon Strategy)

## The Pitch In One Sentence
We are NOT building another PFM with pie charts. We are building a **proactive AI agent** that predicts cash-flow gaps, finds free money for user goals automatically, and has a configurable tone of voice (from polite banker to "toxic bro"). This drives DAU/MAU and gives MBank viral social-media reach.

## Why Generic PFM Is A Losing Pitch
Spending alerts, subscription detection, category charts — these are cron jobs and string parsing, not AI. Tinkoff/Kaspi already ship them. Judges will ask "where is the AI?". Charts are dead: 95% of users do not read pie charts. The rule is: **"don't show me the weather radar, just tell me if I need an umbrella."**

## The Three Killer Features (in priority order) — REVISION 2

### 1. Persona Selector (Tone of Voice) — VIRAL LAYER
Before chatting, user picks the assistant's personality.
- **Заботливый** — polite, standard banking advisor. Safe default.
- **Токсичный бро** — sarcastic, roasts the user for coffee/taxi spending while still giving correct advice. Users will screenshot the roasts and post them to Instagram/TikTok — free marketing for MBank.
- **Safety valve:** the user OPTED IN to the toxic mode. Never auto-enable. Never roast medical/pharmacy transactions.
- **Implementation:** persona is passed into the LLM system prompt on every call. Also used by the Spending Intercept banner to pick hardcoded reply copy. Store selection in React state (no DB).

### 2. Spending Intercept — THE "REAL AGENT" LAYER ⭐
Not a chatbot feature. A **notification-banner that slides down over Home before a bad transaction happens**. Triggered by a dev button in the prototype (real product would hook payment pre-auth). Example (toxic mode):
> "3-й Тулпар за неделю. Это не такси, это абонемент. Отмени, я положу эти 17 С на депозит — хоть копейку заработаешь."

Two buttons: `[Всё равно купить]` / `[Отмена — в копилку]`. Cancel → the amount flies straight into the AI Autopilot Savings jar and the widget counter ticks up with a pulse animation.

- **Why this is the killer.** Every other "AI bank" answers when asked. This one acts first. It's the only moment in the demo where the AI speaks without being spoken to. That's the difference between a chatbot and an agent.
- **Offline-safe.** Intercept copy is hardcoded in `mockData.pendingTransactions[].intercept.toxic|caring`. No LLM call, no network latency, no risk of failure on the pitch stage. Also eliminates hallucination risk on sensitive categories.
- **Medical safety.** `pendingTransactions` hardcodes ONLY Тулпар, Coffee Room, Spotify. There are physically no pharmacy/medical mocks to intercept.

### 3. AI Autopilot Savings — THE BUSINESS MODEL LAYER ⭐
Not another savings goal the user sets and abandons. A **copilka the AI runs on its own**, funded from three sources:
1. **Rounding** — change from every transaction, rounded up to the next 10 С.
2. **Blocked spend** — every transaction killed by the Intercept (Feature 2) flies here in full.
3. **Found savings** — AI compares current month vs prior and automatically moves the delta (no confirmation).

**The goal the user never set.** The jar shows one visible goal — *"На машину, 500 000 С"* — with 84 500 С already saved. The user never created it. The AI picked it after seeing them browse `Mashina.kg` (from the real MBank service grid in photo_1). Pitch line: *"The user never asked to save for a car. The agent did it for them."* There's a ghost link "Поменять цель ›" so the user isn't cornered, but it's one click.

**This is the MBank revenue answer.** The jar IS a deposit account (`MSmart Deposit`, 8% APR). The AI cross-sells the deposit product by opting in 100% of autopilot users without an onboarding flow. MBank earns the spread between the APR it gives the user and how it deploys the deposited capital. When judges ask "how does MBank make money from this?" — point at the widget.

**Visible on Home.** A gradient widget above "За Апрель" — judges see the AI feature before they ever tap the chat FAB. That's the fix for "AI is invisible until you open the chat."

---

### Features that became infrastructure, not headline
These are the invisible tools the agent calls via tool calling — mentioned in passing, never as the pitch:
- `analyze_spending` — reads transactions, returns insights
- `predict_cashflow` — forecasts balance until next salary
- `manage_subscriptions` — freeze/cancel recurring charges
- `show_autopilot_summary` — dumps the copilka contents into a chat card

Removed from scope (superseded):
- ~~`find_free_money`~~ — absorbed by autopilot.history[]. Finding free money and moving it is now automatic, not a confirmation prompt.
- ~~`setup_savings_goal`~~ — the autopilot owns one goal, AI-chosen. No user creation flow.

## Bonus Ideas (Stretch — DO NOT build unless Blocks 1–8 are done)
- **Fraud guard:** nighttime atypical transfer → agent asks a verification question in-chat.
- NLP transaction search and the cross-sell card are **cut** in Revision 2:
  - NLP search is just tool calling — any chat question is already NLP.
  - Cross-sell is absorbed by Feature 3 (the copilka IS the MBank deposit cross-sell).

## Hard Rules For Execution
- **NO BACKEND, NO DATABASE.** Everything reads from `lib/mockData.ts`. Hardcode realistic Kyrgyz Som (С) amounts, Bishkek merchants (Тулпар, MEGA, Severelectro, Bishkekteploset, Dordoi), and Cyrillic category names.
- **Tool Calling is mandatory.** The AI must render React components inside chat bubbles via Vercel AI SDK tool calls — plain text answers are a failure.
- **Persona is the demo.** Every prototype pass must end with a working toxic-bro roast we can screenshot for the pitch deck.
- **No pie charts in the pitch.** If a chart appears, it must be a single-insight component the AI generated, not a dashboard.

## What To Avoid (Anti-Patterns That Lose Hackathons)
- Building a settings screen, a profile editor, an onboarding flow, or anything not demoable in 3 minutes.
- Real auth, real API keys for third parties, real DB schemas.
- Features that require the judge to imagine them working — if it's not clickable in the demo, cut it.
- Toxic-mode jokes about pharmacies, hospitals, funerals, or any transaction category that could be tied to grief or illness.