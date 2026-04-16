# MBank AI Financial Advisor — Judge Pitch Outline

## Context
24-hour hackathon prototype. Pitch frames the three killer features already built (Persona Selector, Spending Intercept, AI Autopilot Savings), backs them with real industry metrics, gives MBank a credible build plan (time/cost/hardware), and adds one new demoable scenario — AI cross-selling MBank's own internal services (MMarket, MProfi) when the user mentions an external purchase.

---

## Slide-by-Slide Outline (10–12 slides, ~3 min demo + 2 min Q&A)

### Slide 1 — Hook (15 sec)
- One line: **"We didn't build another PFM. We built an agent that acts before you do."**
- Screenshot: toxic-bro Spending Intercept banner over Home.

### Slide 2 — The Problem
- Kyrgyz banking apps (incl. MBank today) = transactional. User opens → pays → closes.
- DAU/MAU is low because there's no reason to open the app without a task.
- Generic PFM dashboards (pie charts, category breakdowns) have <5% engagement industry-wide.
- **"Don't show me the radar, tell me if I need an umbrella."**

### Slide 3 — Our Three Killer Features (the demo spine)
1. **Persona Selector** — Заботливый vs Токсичный бро. Viral layer.
2. **Spending Intercept** — agent speaks first, kills bad transactions pre-auth.
3. **AI Autopilot Savings** — copilka the AI runs itself; IS the MSmart Deposit (8% APR).
- Plus (new): **Internal Cross-Sell Scenario** (see Slide 7).

### Slide 4 — Live Demo Script (90 sec)
1. Open app → Autopilot widget already on Home (84 500 С / 500 000 С, goal "На машину" the user never set).
2. Tap dev trigger → Spending Intercept slides down: *"3-й Тулпар за неделю…"* → tap "Отмена — в копилку" → widget ticks up with pulse.
3. Open chat → switch persona to Токсичный бро → ask "куда ушли деньги?" → tool-called card renders inside the bubble.
4. Run new cross-sell scenario (Slide 7).
5. Screenshot-worthy roast line stays on screen for the closing.

### Slide 5 — Why This Wins: Market Proof (Numbers & Metrics)
Real deployments of conversational AI / agentic advisors in banking:
- **Bank of America — Erica**: >2 billion client interactions, 42M+ users, 56% YoY growth in usage (BofA Q4'23 disclosure).
- **Commonwealth Bank of Australia — Ceba / AI assistant**: reduced call-center volume ~40%, ~AUD $800M operational savings (CBA FY23 annual report).
- **Capital One — Eno**: ~20% of mobile-active customers use it monthly; material mobile DAU lift.
- **Cleo (UK neobank, toxic-bro persona proof point)**: passed 5M users almost entirely via TikTok/IG virality from "roast me" screenshots — persona IS the acquisition channel.
- **Personetics (whitelabel PFM-AI used by RBC, U.S. Bank, Intesa)**: reported **+35% app engagement**, **+27% retention**, **4x PFM feature usage** vs static dashboards.
- **McKinsey 2024 Gen-AI in banking**: conversational agents projected to add **$200–340B/year** to global banking productivity; early deployers see **9–15% uplift in digital product cross-sell**.

**Translation for MBank**: a conservative 10% DAU lift on ~1M active users = ~100K new daily sessions = dramatically higher cross-sell surface for MMarket, MProfi, MSmart Deposit.

### Slide 6 — The Revenue Story
- Autopilot jar = MSmart Deposit opened silently. 8% APR to user; MBank earns spread on deployed capital.
- Intercepted transactions = deposit inflow. Even at 17 С avg × 3 intercepts/week × 500K users ≈ **1.3B С/year in new low-cost funding**.
- Cross-sell (Slide 7) pushes GMV into MMarket without paid ads.
- DAU lift (~10%) improves every downstream KPI MBank already measures.

### Slide 7 — NEW: Internal Cross-Sell Scenario (MMarket / MProfi loop)
**Pitch in one line**: *"When the user tells the bot what they bought, the bot tells them where they should have bought it — inside MBank."*

**Demo script:**
- User (in chat): *"Купил лампу на Орто-Сай за 500 С."*
- Agent (toxic mode): *"500 С за лампу? Та же самая в MMarket стоит 350 С и доставка бесплатная. В следующий раз спроси меня ДО того, как достать кошелек."*
- Renders a tool-called card in the bubble: product image, **350 С** vs 500 С crossed-out, "Открыть в MMarket ›" deep-link CTA.
- Caring mode variant: polite reframe, same card.

**How it works (for judges who ask):**
- Tool: `find_in_mbank_catalog(query, paid_price)` — MMarket catalog (mocked for demo, real API in prod).
- Same pattern covers **MProfi**: "нанял мастера за X" → suggest MProfi pro at lower price.
- Works for MTravel, insurance, etc. One tool, N verticals.

**Why it's a killer add-on:**
- Turns the chat into a **zero-CAC acquisition funnel** for MBank's marketplace products.
- Every chat message becomes a potential GMV event.
- Second independent revenue line alongside the Autopilot deposit play.

### Slide 8 — Build Plan for MBank (Time, Cost, Hardware)
**Scope**: productionize what we prototyped into MBank's real mobile app.

**Team & timeline:**
| Phase | Duration | Headcount |
|---|---|---|
| Discovery + risk/compliance review | 3 weeks | 1 PM, 1 compliance, 1 solution architect |
| Core chat + tool calling integration | 4 weeks | 2 backend, 1 ML eng |
| Persona + Spending Intercept + Autopilot | 4 weeks | 2 mobile (iOS+Android), 1 designer |
| Internal cross-sell (MMarket/MProfi tool) | 2 weeks | 1 backend, 1 mobile |
| QA, security pen-test, staged rollout | 3 weeks | 1 QA, 1 security |
| **Total MVP to prod** | **~16 weeks (4 months)** | ~8 FTE peak |

**Cost estimate (Kyrgyzstan market rates, USD):**
- Engineering (8 FTE × 4 months × ~$3.5K blended) ≈ **$112K**
- LLM inference (Claude Haiku / GPT-4o-mini mix, ~500K DAU, ~3 msg/user/day, cached prompts) ≈ **$8–15K/month** steady state
- One-time setup (vector DB, prompt ops, evals, observability) ≈ **$20K**
- Security audit + NBKR compliance ≈ **$25K**
- **Year-1 all-in: ~$250–300K**
- Payback: 0.5% uplift in deposit inflow → paid back in <6 months.

**Hardware / infra:**
- **No on-prem GPUs for MVP.** Use hosted LLM APIs (Anthropic / OpenAI / Yandex GPT for RU fallback).
- Existing MBank Kubernetes cluster hosts the orchestration layer (tool-calling gateway, session store, PII redaction proxy).
- Add: Redis (chat session state), Postgres table (persona/autopilot config), pgvector (MMarket catalog RAG).
- **On-prem option (data residency / NBKR pressure later)**: 2× NVIDIA L40S or 1× H100 node runs quantized Llama-3.1-70B or Qwen2.5-72B at ~50 concurrent users. CapEx ~$40–60K. Not needed for launch.

### Slide 9 — Risks & Mitigations
- **Toxic mode PR risk** → opt-in only, hard category blocklist (medical/pharma/funerals), server-side safety filter.
- **Hallucination on financial advice** → every number comes from tool-called structured data, never free-text LLM output.
- **LLM outage** → Spending Intercept + Autopilot copy hardcoded as fallback; agent degrades to rule-based.
- **Compliance** → no PII leaves MBank perimeter; LLM calls go through redaction proxy.

### Slide 10 — Ask / Close
- Phone mockup with the toxic roast on screen.
- **"Every other bank answers when asked. MBank speaks first."**
- Ask: pilot with 10K users in Bishkek, 8 weeks, measure DAU + deposit inflow + MMarket GMV.
