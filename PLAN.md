# MBank AI Advisor — Execution Plan (48h) — REVISION 2

> Last updated: 2026-04-14 (после жёсткой критики + двух новых фич)
> Horizon: 48 часов до питча. Целевая модель: **Claude Sonnet 4.6**.
> Апгрейд описан в `~/.claude/plans/quiet-beaming-umbrella.md`.

---

## Что изменилось с первой версии

Первая версия была B+ хакатонский чат-бот. После критики добавили **две фичи-агента**, которые переводят прототип в A+:

1. **Spending Intercept (A)** — AI перехватывает плохую трату до её совершения (не после). Модалка поверх Home, offline-safe, хардкод реплик. Toxic-бро ругает, caring-мама уговаривает. Отмена → деньги сразу в копилку.
2. **AI Autopilot Savings (B)** — копилка, которую ведёт AI без участия пользователя. Три источника: округление сдачи, заблокированные траты, найденная экономия. Видимая цель «На машину 500 000 С» — AI подобрал сам из паттерна Mashina.kg, юзер её не создавал. Копилка = депозит MBank 8% годовых = **встроенная бизнес-модель**.

Эти фичи становятся главной сюжетной петлёй: перехват → блокировка → автоматом в копилку → виджет на Home тикает. Три wow за один цикл.

**Что срезано** (ради A+B за 48ч):
- `/ui-lab` storybook → тестим карточки напрямую в чате
- Drag-to-dismiss swipe в ChatOverlay → жюри не свайпает
- NLP search как отдельный tool → поглощён tool calling'ом
- 2 цикла screenshot-compare → оставили 1
- Cross-sell как стрейч-блок → поглощён автопилотом (копилка ЕСТЬ кросс-сейл депозита)

Экономия: ~10 часов. Ровно столько, сколько нужно на A+B.

---

## Что уже готово

- [x] `CLAUDE.md` — project brief + vision + vision critique + anti-patterns
- [x] `package.json` — `ai`, `framer-motion`, `lucide-react`, `@anthropic-ai/sdk` установлены
- [x] `src/lib/mockData.ts` — user (Тимур, РАХМАТУЛЛАЕВ), cards (`*4796` gold, `*7752` purple — совпадают со скриншотом photo_7), transactions, subscriptions, upcomingBills, marchAnalysis, personas (caring + toxic). **ТРЕБУЕТ ДОБАВЛЕНИЯ** `autopilotSavings` и `pendingTransactions` — Блок 1.5.
- [x] `src/components/chat/ChatOverlay.tsx` — slide-up + persona picker (скелет)
- [x] `src/app/page.tsx` — client-компонент, зелёный AI FAB открывает ChatOverlay

---

## Принципы исполнения

1. **Пиши ровно одну фичу за блок.**
2. **Mock-first.** Никакой крипты, никаких API, никаких БД.
3. **Tool calling — не опциональный.** Если AI отвечает текстом там, где должна быть карточка — это баг.
4. **Intercept — offline-safe.** Никогда не звать LLM из интервента. Хардкод в моках.
5. **Демо flow священен.** В конце каждого блока — скриншот или видео для питч-дека.
6. **Pareto brutal.** Всё, что не видно жюри за 3 минуты — отменяется.

---

## Session budgeting (ревизованная таблица)

| Часы | Блок | Что готово к концу |
|---|---|---|
| 0–4   | **Блок 1** — Home rebuild на mockData + QR chip + `formatSom/formatDate`                                | Home читает все числа из mockData |
| 4–6   | **Блок 1.5** ⭐ НОВЫЙ — `autopilotSavings` в mockData + `AutopilotWidget` на Home                      | Виджет копилки виден сверху Home |
| 6–12  | **Блок 2** — `/api/chat` route + 4 tools (без `find_free_money`, без `setup_savings_goal`)              | curl возвращает tool call |
| 12–18 | **Блок 3** — 4 генеративные карточки (без `/ui-lab`)                                                    | Карточки готовы для Блока 4 |
| 18–22 | **Блок 4** — Streaming chat + persona + proactive opener                                                 | Чат работает end-to-end |
| 22–28 | **Блок 5** ⭐ НОВЫЙ ЦЕНТРАЛЬНЫЙ — **Spending Intercept** (фича A)                                       | Banner + анимация «монет в копилку» |
| 28–32 | **Блок 6** — Suggested prompts + `DEMO_SCRIPT.md`                                                        | Chips + репетиция |
| 32–38 | **Блок 7** — Screenshot pass (1 цикл) + polish                                                           | Home ≈ фото_1 |
| 38–44 | **Блок 8** — E2E прогон ×5 + 5 скриншотов для питч-дека + offline fallback                               | Demo-ready |
| 44–48 | **Буфер**                                                                                                 | Резерв |

---

## Блок 1 — Rebuild Home on mockData + QR chip

**Goal.** `src/app/page.tsx` сейчас хардкодит числа. Переписать так, чтобы ВСЁ читалось из `mockData.ts`.

**Files touched.**
- `src/app/page.tsx` (rewrite JSX blocks, keep visual)
- `src/lib/format.ts` (new)

**Done when.** Открыл Home → все числа из моков. Добавлен QR-chip в header (32px, #FABF00, иконка QR).

**Mini-prompt для Sonnet 4.6:**
```
Прочитай CLAUDE.md и PLAN.md Блок 1.

Задача: переписать src/app/page.tsx так, чтобы все числа
и строки приходили из src/lib/mockData.ts. Структуру JSX
и стили не менять — только заменить хардкод на импорты.

1. Создай src/lib/format.ts с:
   - formatSom(n: number): "3 409,53 С" (nbsp, запятая, суффикс " С")
   - formatDate(iso: string): "14 апр" (русские сокращения)

2. В page.tsx импортируй user, cards, transactions, upcomingBills,
   marchAnalysis из mockData. Замени:
   - Balance card → cards[0] (*4796, 3 409,53 С)
   - "За Апрель 20 030" → marchAnalysis
   - Счета → upcomingBills
   - Транзакции → первые 4 элемента transactions
   - AI Advisor card: текст из user.salary.nextPayISO + sum upcomingBills

3. Добавь QR chip в header (справа от аватара Тимура, перед
   колокольчиком): круглая кнопка 32px, bg #FABF00, белая QR
   иконка 14px. Onclick: ничего.

4. НИЧЕГО не трогай в ChatOverlay и в центральном зелёном FAB.

Проверь: npx tsc --noEmit должен пройти чисто.
```

---

## Блок 1.5 ⭐ — Autopilot Savings mock + Home widget

**Goal.** Добавить копилку в моки и вывести её виджетом в самый верх Home. Это первый след AI на Home-экране — жюри видит фичу без тапа FAB.

**Files touched.**
- `src/lib/mockData.ts` (add `autopilotSavings`, remove `savingsGoals`)
- `src/components/home/AutopilotWidget.tsx` (new)
- `src/app/page.tsx` (insert widget above «За Апрель»)

**Design.**
- Gradient-карточка `bg-gradient-to-br from-emerald-500 to-emerald-700`, rounded-2xl, p-4, белый текст
- Заголовок (14px semibold): «AI копит тебе на машину»
- Sub (11px opacity-80): «Ты не просил — я сам заметил»
- Большой счётчик (28px bold): `84 500 С` справа
- Прогресс-бар 6px: `bg-white/20` → `bg-white` заполнение 17%
- Footer (11px opacity-70): «AI управляет сам • 8% годовых MBank»
- Ghost-link (11px underline opacity-70): «Поменять цель ›»

**Mini-prompt для Sonnet 4.6:**
```
Прочитай CLAUDE.md, PLAN.md Блок 1.5 и approved plan в
~/.claude/plans/quiet-beaming-umbrella.md (Feature B).

Задача: AutopilotWidget на Home.

1. В src/lib/mockData.ts:
   - Удали существующий savingsGoals массив
   - Добавь:
     export const autopilotSavings = {
       total: 84500,
       apr: 8,
       goal: {
         name: "На машину",
         target: 500000,
         icon: "🚗",
         aiReason: "Ты смотришь Mashina.kg. Я сам заметил.",
       },
       history: [
         { reason: "rounding", amount: 3,   dateISO: "2026-04-14", note: "Сдача с Тулпар" },
         { reason: "blocked",  amount: 280, dateISO: "2026-04-13", note: "Coffee Room — отменил" },
         { reason: "found",    amount: 1800,dateISO: "2026-04-01", note: "Такси в марте меньше обычного" },
         // ещё 6-8 записей на разные дни и причины
       ],
     }

2. src/components/home/AutopilotWidget.tsx:
   - 'use client'
   - Импортирует autopilotSavings, formatSom
   - Gradient bg-emerald-500→700, rounded-2xl p-4 text-white
   - Layout см. Блок 1.5 PLAN.md (заголовок, sub, счётчик, прогресс-бар, footer, ghost-link)
   - Прогресс = total / goal.target (84500/500000 = 17%)
   - Никаких LLM-вызовов, никакого useState — pure statelesss

3. В src/app/page.tsx:
   - Импортируй AutopilotWidget
   - Смонтируй СРАЗУ после Balance card, ДО Quick actions:
     <div className="px-4 mb-3"><AutopilotWidget /></div>

4. Проверь: npx tsc --noEmit чисто. Открой Home — виджет виден
   сверху, цвета emerald, числа из моков.
```

---

## Блок 2 — Chat API route + tool registry (4 tools)

**Goal.** `/api/chat` с Vercel AI SDK + Anthropic. **4 tools**: `analyze_spending`, `predict_cashflow`, `manage_subscriptions`, `show_autopilot_summary`.

**Не включаем:**
- ~~`find_free_money`~~ → поглощён autopilot.history (находки автоматом идут в копилку)
- ~~`setup_savings_goal`~~ → копилка автономна, одна цель, пользователь не управляет

**Files touched.**
- `src/app/api/chat/route.ts` (new)
- `src/lib/tools.ts` (new)
- `.env.local` (add `ANTHROPIC_API_KEY`)

**Mini-prompt для Sonnet 4.6:**
```
Прочитай CLAUDE.md и PLAN.md Блок 2.

Задача: /api/chat с tool calling через Vercel AI SDK + Anthropic.

1. npm i @ai-sdk/anthropic zod (если не стоит).

2. src/lib/tools.ts — export tools с 4 tools:

   - analyze_spending({ period: "month"|"week" }):
     читает transactions, возвращает { total, topCategory,
     categories: [{label, value, percent, color}] }

   - predict_cashflow():
     читает user.salary, user.balances, upcomingBills.
     возвращает { daysUntilSalary, balance, upcomingDebits,
     projectedShortfall, riskLevel: "ok"|"tight"|"gap" }

   - manage_subscriptions({ action: "list"|"freeze", id? }):
     читает subscriptions. возвращает список или подтверждение.

   - show_autopilot_summary():
     читает autopilotSavings. возвращает:
     { total, apr, goal, progress (0-1),
       sources: { rounding, blocked, found },
       recentHistory: first 5 entries }

   КАЖДЫЙ tool: inputSchema zod, execute async handler,
   возвращает чистый object.

3. src/app/api/chat/route.ts:
   - export async function POST(req)
   - body: { messages, personaId }
   - персону ищем в mockData.personas
   - streamText({
       model: anthropic('claude-sonnet-4-5'),
       system: persona.systemPrompt,
       messages, tools, maxSteps: 5
     })
   - return result.toDataStreamResponse()

4. .env.local.example → ANTHROPIC_API_KEY=sk-ant-...

5. Тест:
   curl -N -X POST http://localhost:3000/api/chat \
     -H 'content-type: application/json' \
     -d '{"messages":[{"role":"user","content":"что в копилке?"}],"personaId":"caring"}'
   → должен прийти tool call на show_autopilot_summary.

НЕ трогай ChatOverlay — UI в Блоке 4.
```

---

## Блок 3 — 4 Generative UI cards (без ui-lab)

**Goal.** Четыре React-карточки для чат-бабла. Тестим напрямую в чате (Блок 4), отдельный storybook не делаем.

**Карточки:**
1. `CashflowWarningCard` — result от `predict_cashflow`
2. `SpendingBreakdownCard` — result от `analyze_spending` (с горизонтальным сегмент-баром как на photo_6)
3. `SubscriptionFreezeCard` — result от `manage_subscriptions`
4. **`AutopilotJarCard`** ⭐ — result от `show_autopilot_summary`, показывает прогресс + breakdown по 3 источникам + recent history

**Design rules.** Все карточки: `bg-white rounded-2xl border border-[#ECECEC] p-4 max-w-[280px]`. Иконка lucide 20px в квадрате 36px `bg-emerald-600/10 text-emerald-600`. Primary btn `h-10 rounded-xl bg-emerald-600 text-white`. Без default Tailwind blue/indigo. Без `transition-all`.

**Mini-prompt для Sonnet 4.6:**
```
Прочитай CLAUDE.md, DESIGN.md, PLAN.md Блок 3.
Посмотри temp_screenshots/photo_1..7 — стиль должен совпадать.

Задача: 4 генеративные карточки. Без ui-lab страницы.

Правила (строго):
- bg-white, rounded-2xl, border border-[#ECECEC], p-4, max-w-[280px]
- Иконка lucide-react 20px в квадрате 36px bg-emerald-600/10 text-emerald-600
- Заголовок 14px font-semibold text-slate-900
- Sub 12px text-slate-500
- Числа через formatSom() из Блока 1
- Primary btn h-10 rounded-xl bg-emerald-600 text-white text-[13px] font-semibold
- Только transition-transform или transition-colors
- Никакого default Tailwind blue/indigo

Компоненты (в src/components/chat/cards/):

1. CashflowWarningCard — props result от predict_cashflow
   Иконка: AlertTriangle. Показывает днейДоЗарплаты, баланс,
   upcomingDebits, projectedShortfall. CTA "Заморозить Х С".

2. SpendingBreakdownCard — props result от analyze_spending
   Иконка: BarChart3. Внутри горизонтальный segmented bar как
   на photo_6, под ним легенда из categories. Никаких pie charts.

3. SubscriptionFreezeCard — props result от manage_subscriptions
   Иконка: Repeat. Список подписок с per-row "Заморозить"
   (иконки Music/Film/Youtube/Cloud из lucide).

4. AutopilotJarCard — props result от show_autopilot_summary
   Иконка: PiggyBank. Показывает:
   - Заголовок "AI-Копилка на машину"
   - Большой счётчик total + подпись "из 500 000 С"
   - Прогресс-бар 6px bg-slate-100 → bg-emerald-600
   - 3 строки с breakdown: округление/блоки/экономия (иконки
     Coins, ShieldOff, TrendingDown)
   - Маленький footer "+ Х С за последние 7 дней"

КАРТОЧКИ НИГДЕ НЕ МОНТИРОВАТЬ — только создать файлы. Используем в Блоке 4.

Проверь tsc.
```

---

## Блок 4 — Streaming chat + persona + proactive opener

**Goal.** Подключить ChatOverlay к `/api/chat`. Tool calls рендерят карточки из Блока 3. Persona прокидывается в system prompt.

**Files touched.**
- `src/components/chat/ChatOverlay.tsx` (rewrite EmptyChat + composer)
- `src/components/chat/MessageList.tsx` (new)
- `src/components/chat/MessageBubble.tsx` (new — switch по tool)

**Done when.**
- Выбрал Заботливого → composer включён
- «что в копилке» → `AutopilotJarCard`
- «хватит до зарплаты» → `CashflowWarningCard`
- Свитч на Токсичного бро → тот же вопрос → тот же tool, другой тон

**Mini-prompt для Sonnet 4.6:**
```
Прочитай CLAUDE.md и PLAN.md Блок 4.
Блоки 2 и 3 должны быть завершены.

1. src/components/chat/MessageBubble.tsx:
   - props: { message }
   - user: bg-emerald-600 text-white rounded-2xl px-4 py-2 max-w-[80%] ml-auto
   - assistant text: bg-white border rounded-2xl px-4 py-2 max-w-[85%]
   - message.parts с tool-invocation → switch по toolName:
     analyze_spending → <SpendingBreakdownCard {...result} />
     predict_cashflow → <CashflowWarningCard {...result} />
     manage_subscriptions → <SubscriptionFreezeCard {...result} />
     show_autopilot_summary → <AutopilotJarCard {...result} />

2. src/components/chat/MessageList.tsx:
   - props: { messages }
   - Рендерит через MessageBubble
   - Auto scroll-to-bottom при новом сообщении (useRef + scrollIntoView)

3. Перепиши EmptyChat и composer в ChatOverlay.tsx:
   - import { useChat } from 'ai/react'
   - const { messages, input, handleInputChange, handleSubmit, status }
     = useChat({ api: '/api/chat', body: { personaId } })
   - После выбора persona — useEffect append proactive opener один раз
     (разный текст для caring/toxic, конкретика из mockData — например
      упомянуть сумму копилки и ближайший счёт)
   - composer включён, typing indicator (3 зелёные точки) когда streaming

4. Тест 3 chip'ов с обеих персон. Скриншоть "токсичный бро +
   CashflowWarningCard" для питч-дека.
```

---

## Блок 5 ⭐ — Spending Intercept (центральная новая фича)

**Goal.** Notification-banner поверх Home, который AI запускает САМ без запроса пользователя. Offline-safe (хардкод реплик). Отмена → деньги тикают в AutopilotWidget с анимацией.

**Files touched.**
- `src/lib/mockData.ts` (add `pendingTransactions` с хардкод-репликами)
- `src/components/intercept/InterceptBanner.tsx` (new)
- `src/components/intercept/DevTriggerButton.tsx` (new, dev-only)
- `src/app/page.tsx` (mount banner + trigger)
- `src/lib/store.ts` (new — тонкий zustand или React Context для autopilot total)

**Почему Context/zustand.** AutopilotWidget показывает сумму. Intercept должен её увеличить после "Отмена". Props-drilling через page.tsx работает, но коряво. Минимальный store на 10 строк — чище.

**Хардкод копирайта:**
```ts
pendingTransactions: [
  {
    id: "pending-tulpar",
    merchant: "Оплата по QR Тулпар",
    amount: 17,
    pattern: "3-й раз за неделю",
    intercept: {
      toxic: [
        "Тулпар 17 сом. Ещё раз Тулпар 17 сом. За неделю на такси потратил столько, что таксист зовёт тебя по имени. Может хватит?",
        "Bro. 3-й Тулпар за 7 дней. Это не такси, это абонемент.",
      ],
      caring: [
        "Тимур, третья поездка в Тулпар за неделю. Может сейчас пройтись? Погода хорошая.",
        "Заметила: ты часто берёшь такси на короткие расстояния. Давай 17 С отложим?",
      ],
    },
  },
  {
    id: "pending-coffee",
    merchant: "Coffee Room",
    amount: 280,
    pattern: "4-й кофе за день",
    intercept: { toxic: [...], caring: [...] },
  },
  {
    id: "pending-spotify",
    merchant: "Spotify Premium",
    amount: 199,
    pattern: "Не слушал 18 дней",
    intercept: { toxic: [...], caring: [...] },
  },
]
```

**Mini-prompt для Sonnet 4.6:**
```
Прочитай CLAUDE.md, PLAN.md Блок 5 и approved plan
(~/.claude/plans/quiet-beaming-umbrella.md Feature A).

Задача: Spending Intercept.

1. В mockData.ts добавь pendingTransactions[] со структурой
   из Блока 5 (3 сценария: Тулпар 17, Coffee Room 280, Spotify 199).
   Каждый со 2 toxic + 2 caring репликами. Medical-free guarantee.

2. src/lib/store.ts — минимальный store (zustand или React Context)
   с одним значением:
     autopilotTotal: number (initial = mockData.autopilotSavings.total)
     addToAutopilot: (amount, reason) => void

3. AutopilotWidget (Блок 1.5) — переведи на чтение autopilotTotal
   из store вместо прямого mockData. При изменении — короткий
   pulse на прогресс-баре (animate scale 1 → 1.02 → 1 за 400ms).

4. src/components/intercept/InterceptBanner.tsx:
   - 'use client'
   - props: { pending: PendingTransaction, personaId: "caring"|"toxic",
             onCancel: () => void, onConfirm: () => void }
   - Framer Motion slide-down сверху (y: -100% → 0, spring 28/260)
   - z-60 (выше persona picker z-50)
   - Содержимое:
     - AI avatar 36px в градиенте персоны
     - Заголовок (14px semibold): pending.pattern
     - Реплика (13px): случайная из intercept[personaId]
     - Сумма крупно (20px bold) + merchant
     - 2 кнопки: [Всё равно купить] ghost / [Отмена — в копилку] primary
     - Footer (11px text-slate-500): "Эти 17 С уедут на твой депозит 8% годовых"

5. src/components/intercept/DevTriggerButton.tsx:
   - Плавающая кнопка в правом верхнем углу phone shell
   - process.env.NODE_ENV === 'development' → viewable, else → null
   - Onclick: открыть случайный pending из mockData.pendingTransactions
   - Размер 28px, emoji 💥, bg-amber-400/80

6. В page.tsx:
   - useState<PendingTransaction|null>(activePending)
   - useState<PersonaId>(activePersona)  — default "caring"
   - onConfirm: addTransaction to list, close banner
   - onCancel: store.addToAutopilot(pending.amount, "blocked"), close banner
   - Rendering:
     <InterceptBanner
       pending={activePending}
       personaId={activePersona}
       onCancel={handleCancel}
       onConfirm={handleConfirm}
     /> — только когда activePending !== null
   - <DevTriggerButton onTrigger={setActivePending} />

7. НЕ триггерить интервент пока chatOpen === true.

8. Тест ручной:
   - Открой Home
   - Жми 💥 dev-кнопку
   - Появляется banner сверху (caring тон по умолчанию)
   - Жми "Отмена" → banner уезжает, счётчик в AutopilotWidget
     тикает +17, короткий pulse на бар
   - Повтори с toxic тоном (пока chat не интегрирован в блок — можно
     задать через useState default "toxic" временно).
```

---

## Блок 6 — Suggested prompts + DEMO_SCRIPT.md

**Goal.** Жюри не будет печатать. 6 chip'ов с wow-моментами + отрепетированный сценарий.

**Chips.**
1. «Что в копилке?» → `show_autopilot_summary`
2. «Хватит до зарплаты?» → `predict_cashflow`
3. «Куда ушли деньги?» → `analyze_spending`
4. «Помоги с подписками» → `manage_subscriptions`
5. «Прожарь мои траты» → только для toxic, форсит самое жёсткое
6. «Покажи машину» → также `show_autopilot_summary` но с акцентом на goal

**Files.**
- `src/components/chat/SuggestedPrompts.tsx` (new)
- `src/components/chat/ChatOverlay.tsx` (insert chips after opener)
- `DEMO_SCRIPT.md` (new — сценарий из approved plan)

**Mini-prompt для Sonnet 4.6:**
```
Прочитай CLAUDE.md, PLAN.md Блок 6.

1. src/components/chat/SuggestedPrompts.tsx:
   - props: { onPick: (text) => void, personaId }
   - 6 chip'ов (см. Блок 6 PLAN.md)
   - "Прожарь мои траты" показывается только если personaId === 'toxic'
   - flex overflow-x-auto gap-2 px-4 pb-3
   - Chip: h-9 px-3 rounded-full bg-white border border-[#ECECEC]
     text-[13px] text-slate-700 whitespace-nowrap active:scale-95

2. В ChatOverlay:
   - Рендерь SuggestedPrompts между proactive opener и первым user
     message (messages.filter(m => m.role==='user').length === 0)
   - onPick: append({ role: 'user', content: text })

3. DEMO_SCRIPT.md — 3-минутный сценарий по таблице из Блока 6
   approved plan (quiet-beaming-umbrella.md). Дословно, по секундам,
   с репликами спикера. 9 секций (0:00→3:00).
```

---

## Блок 7 — Screenshot pass + polish

**Goal.** 1 цикл сравнения с `temp_screenshots/photo_1..7` + общий полиш. Home должен выглядеть как MBank, чат — чистым, без багов в консоли.

**Checklist:**
- [ ] Home 390×844 неотличим от photo_1 (отступы, шрифты, цвета, радиусы)
- [ ] Все active:scale-95 / active:bg-* на интерактиве
- [ ] Typing indicator 3 зелёные точки
- [ ] В консоли ноль warnings
- [ ] На 1440px — centered phone shell, bg #DCDCDC

**Mini-prompt для Sonnet 4.6:**
```
Прочитай CLAUDE.md и PLAN.md Блок 7.

1. npm run dev в фоне (localhost:3000).
2. Сними скриншот Home при ширине 390×844 через Puppeteer inline:
   (поставь puppeteer если нет: npm i -D puppeteer)
   node -e "
   const p=require('puppeteer');
   (async()=>{
     const b=await p.launch();
     const pg=await b.newPage();
     await pg.setViewport({width:390,height:844,deviceScaleFactor:2});
     await pg.goto('http://localhost:3000');
     await pg.waitForTimeout(500);
     await pg.screenshot({path:'temp_screenshots/_home.png'});
     await b.close();
   })();"

3. Открой temp_screenshots/_home.png и temp_screenshots/photo_1 через
   Read tool. Сравни визуально. Запиши ≤10 различий.

4. Исправь в src/app/page.tsx / AutopilotWidget.
5. Повтори screenshot. 1 цикл достаточно.

6. Общий polish:
   - DevTools console на Home + в открытом чате: ноль warnings.
     Фикси ошибки гидрации, missing keys, etc.
   - Убедись что chat открывается плавно, intercept slide-down плавно.
   - На 1440px viewport: bg #DCDCDC, phone shell по центру.

Запрещено менять mockData "под картинку". Данные — истина.
```

---

## Блок 8 — E2E demo rehearsal + pitch frames + offline fallback

**Goal.** Прогнать DEMO_SCRIPT.md 5 раз подряд. Зафиксить любые баги. Снять 5 финальных скриншотов для питч-дека. Запилить offline fallback на случай, если на питче упадёт интернет.

**Files touched.**
- Baixo any bug fixes
- `pitch_deck/frame_01.png` .. `frame_05.png` (new dir)
- `src/app/api/chat/route.ts` — optional fallback логика

**Pitch frames (5 штук):**
1. Home с AutopilotWidget — «до AI ничего, после — копилка»
2. Persona picker — виральный момент
3. InterceptBanner (toxic mode, Тулпар) — meme
4. CashflowWarningCard в чате — «real AI»
5. AutopilotJarCard в чате — «бизнес-модель»

**Offline fallback:**
- В `route.ts` — если `anthropic` call падает с network error, возвращаем canned-ответ для каждого из 6 chip'ов (хардкод JSON с правильным tool-result shape). Судьи не отличат.
- Интервент offline-safe by design.

**Mini-prompt для Sonnet 4.6:**
```
Прочитай CLAUDE.md и PLAN.md Блок 8.

1. Пройди DEMO_SCRIPT.md 5 раз подряд по таймингу.
   Каждый баг, заикание, задержку — фикси перед следующим прогоном.

2. Offline fallback в /api/chat:
   - Оберни streamText в try/catch.
   - В catch: если error.code indicates network / API failure,
     верни мок-ответ с заранее заготовленными tool results для
     типовых вопросов (матч по тексту последнего user message).
   - Типы fallback ответов (по 6 chips):
     "копилка" → mock tool result show_autopilot_summary
     "зарплат" → mock tool result predict_cashflow
     "ушли"    → mock tool result analyze_spending
     "подписк" → mock tool result manage_subscriptions
     "прожар"  → plain text roast (hardcoded)
     "машин"   → mock tool result show_autopilot_summary
   - Все мок-результаты лежат в src/lib/fallbackResponses.ts

3. Снять 5 скриншотов 390×844 (Puppeteer inline или Chrome
   DevTools), положить в pitch_deck/frame_01..05.png с подписями
   (в README pitch_deck.md). Используй DeviceScaleFactor 2 для
   ретина-качества.

4. Финальный npm run build → ноль errors, ноль warnings.
```

---

## Exit criteria (pitch-ready)

- [ ] Блоки 1–7 закрыты
- [ ] `npm run build` — зелёный
- [ ] DEMO_SCRIPT.md отрепетирован вслух за 3 минуты (5×)
- [ ] Offline fallback работает при выключенном интернете
- [ ] 5 скриншотов в `pitch_deck/`
- [ ] В консоли браузера ноль warnings при прохождении сценария
- [ ] Intercept banner работает в обеих персонах, счётчик копилки тикает
- [ ] Жюри видит AI-копилку на Home до того, как коснётся чата

---

## Demo Flow (reference, полный — в DEMO_SCRIPT.md)

| Время | Экран | Момент |
|---|---|---|
| 0:00–0:10 | Home | «Обычный MBank — но сверху AI-Копилка 84 500 С» |
| 0:10–0:25 | Тап по виджету | Раскрываем сумму, 3 источника, 8% депозит |
| 0:25–0:40 | 💥 dev-trigger → InterceptBanner | «AI перехватывает Тулпар до транзакции» |
| 0:40–0:55 | «Отмена» | Анимация 17 С → счётчик тикает 84 500 → 84 517 |
| 0:55–1:20 | AI FAB → Persona picker → Toxic | Proactive opener роаст |
| 1:20–1:50 | Chip «Хватит до зарплаты?» | CashflowWarningCard |
| 1:50–2:20 | Switch на Caring → тот же chip | Цифры те же, тон мягкий |
| 2:20–2:45 | Chip «Покажи машину» | AutopilotJarCard в чате |
| 2:45–3:00 | Closing line | Агент, виральность, бизнес-модель |

---

## После Блока 8 — ничего не добавлять

Блок 8 = финал. Буфер 44–48 ч на баги и доп-скриншоты. **Не лезь в NLP search, не делай отдельный cross-sell tool, не добавляй `setup_savings_goal` обратно.** Если Блок 8 закрыт — идёшь репетировать.
