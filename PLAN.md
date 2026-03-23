# MBank Financial Assistant — 4-Day Hackathon Plan

## 1. Competition Analysis

**What similar apps do:**
- **Kaspi (KZ):** Bill reminders, auto-payments, spending analytics — but closed ecosystem, KZ-only
- **Revolut:** Smart spending categories, savings vaults, budget goals — but no CIS localization
- **Sberbank/Tinkoff:** AI spending insights, bill detection from receipts — Russia-only
- **Wallet by BudgetBakers:** Manual tracking, no bank integration

**Your edge (MBank-specific angle):**
- Deep integration with MBank features (mInvest, auto-payments)
- Kyrgyz/Russian language-first
- Local bills: Severelectro, Bishkekteploset, Gazprom KR, water utilities
- Familiar UX for KG users

---

## 2. Core Features (MVP — must demo these)

### Must Have
| Feature | Why |
|---|---|
| **Bill Reminder Dashboard** | Core problem — forgetting payments |
| **Smart Spending Categories** | Auto-categorize transactions |
| **Savings Goal Planner** | "Save for X by Y date" |
| **MBank Feature Discovery** | Surface mInvest, auto-pay, cashback to users who don't know |
| **AI Financial Assistant Chat** | Ask "Can I afford X?" or "Where did my money go?" |

### Nice to Have (if time allows)
- Monthly budget forecast
- Anomaly detection ("You spent 3x more on food this month")

---

## 3. Technology Choice

**Stack recommendation for 4 days (speed over perfection):**

```
Frontend:  Next.js 14 (React) + Tailwind CSS + shadcn/ui
AI:        Claude API (Anthropic)
Charts:    Recharts or Chart.js
Auth:      Mock auth (no time for real OAuth)
Data:      JSON mock data (simulate MBank transactions)
Deploy:    Vercel (free, instant deploy for demo)
```

**Why this stack:**
- Next.js = fast to build, looks professional, easy demo
- shadcn/ui = pre-built bank-style components, saves 1.5 days of UI work
- Mock data = no backend needed, focus on the demo scenario
- Claude API = powers the AI assistant chat

---

## 4. Design Scheme

**App structure — 5 screens to demo:**

```
/dashboard     — Overview: balance, upcoming bills, savings progress
/bills         — Bill tracker with reminder status + pay button
/savings       — Goal planner with timeline visualization
/assistant     — AI chat: "Ask your MBank financial advisor"
/discover      — MBank features the user hasn't activated yet
```

**Design language:**
- MBank brand colors: dark blue + white + orange accent
- Mobile-first layout (it's a payment app concept)
- Clean, minimal — not overwhelming

---

## 5. 4-Day Development Timeline

### Day 1 — Foundation + Design
- [ ] Set up Next.js project, Tailwind, shadcn/ui
- [ ] Create mock transaction/bill data (JSON)
- [ ] Build layout: sidebar nav + header
- [ ] Dashboard page with balance card + bill summary

### Day 2 — Core Features
- [ ] Bills page: list, due dates, status badges, "Pay" mock action
- [ ] Savings goals page: progress bars, deadline calculator
- [ ] Spending breakdown: donut chart by category

### Day 3 — AI Assistant
- [ ] Integrate Claude API for chat
- [ ] System prompt: give Claude context about user's mock financial data
- [ ] Smart responses: bill reminders, savings advice, mInvest explanation
- [ ] Feature discovery page (mInvest, auto-pay cards with "Activate" CTA)

### Day 4 — Polish + Demo Prep
- [ ] Mobile responsiveness
- [ ] Demo scenario script (walk through a user story)
- [ ] Deploy to Vercel
- [ ] Presentation slides

---

## 6. Demo Scenario (for judges)

> **"Meet Aizat. She earns 40,000 KGS/month. She forgot to pay electricity last month and got fined. She has no savings. She doesn't know MBank has mInvest."**

1. Opens app -> sees **electricity bill due in 3 days** (red alert)
2. Clicks bill -> one-tap pay (mock)
3. Checks **spending** -> 35% on food (AI flags this as above average)
4. Creates **savings goal**: "Emergency Fund — 50,000 KGS in 6 months"
5. Asks **AI chat**: "Can I save more?" -> Claude analyzes mock data, suggests reducing dining out
6. AI mentions **mInvest** -> she activates it from the app
