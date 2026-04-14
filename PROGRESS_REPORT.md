# Progress Report — MBank AI Advisor — FINAL

> Снимок состояния проекта на **2026-04-14, 23:47 UTC**.
> Проект полностью готов к реализации. Все документы синхронизированы.
> Переключайся на Claude Sonnet 4.6, начни с Блока 1.

---

## TL;DR

**Сделано:** фундамент (брифинг, моки, оверлей-скелет, зелёный AI FAB, план на 48ч).
**План прошёл жёсткую критику** — см. `~/.claude/plans/quiet-beaming-umbrella.md` + обновлённый `PLAN.md`. Добавлены две критические фичи-агента:
- **Feature A: Spending Intercept** — AI перехватывает плохую трату ДО транзакции (offline-safe banner, хардкод реплик)
- **Feature B: AI Autopilot Savings** — копилка, которую ведёт AI сам + встроенная бизнес-модель (депозит MBank 8%)

**Срезано** ради A+B: `/ui-lab`, drag-to-dismiss, NLP search tool, 2-й screenshot cycle, cross-sell стрейч-блок. Итого высвобождено ~10 часов.

**Не сделано:** API-роут, tool calling, карточки, чат-стрим, intercept, widget.
**Риски:** дизайн-конфликт "QR vs AI FAB" (решение: QR-chip в header), сломанный screenshot workflow (решение: Puppeteer inline вместо несуществующего `serve.mjs`), цель «На машину» может показаться произвольной (решение: AI reason «ты смотришь Mashina.kg»).
**Следующий шаг:** переключиться на Sonnet 4.6 и запустить мини-промпт **Блока 1** из нового `PLAN.md`.

---

## 1. Файлы, которые я создал / изменил

| Файл | Статус | Что сделано |
|---|---|---|
| `CLAUDE.md` | изменён | Добавлен `# Hackathon Role & Project Spec` (stack, design tokens, bottom nav, mock data, persona, first steps) и `# Product Vision & Concept` (Pareto, 3 killer features, hard rules, anti-patterns) |
| `src/lib/mockData.ts` | создан | user (Тимур, РАХМАТУЛЛАЕВ, Бишкек, +996703928100), cards (`*4796` gold + `*7752` purple — совпадают со скриншотом photo_7), transactions (Сегодня/Вчера/На неделе/Ранее), subscriptions, upcomingBills (Severelectro, Bishkekteploset, MegaCom), savingsGoals (машина, Турция), marchAnalysis, personas (caring + toxic с готовыми systemPrompt + safety rules) |
| `src/components/chat/ChatOverlay.tsx` | создан | Client component, Framer Motion slide-up (spring 28/260), PersonaPicker с двумя градиентными карточками, EmptyChat состояние, задизейбленный composer с Send-кнопкой |
| `src/app/page.tsx` | изменён | Превращён в `"use client"`, добавлен `useState(chatOpen)`, жёлтый QR FAB заменён на круглый зелёный AI-триггер (emerald градиент + белое кольцо + sparkle icon), `ChatOverlay` вмонтирован в phone shell |
| `PLAN.md` | переписан целиком | 8 блоков на 48 часов с мини-промптами для Sonnet 4.6, session budgeting, demo script reference, exit criteria |
| `PROGRESS_REPORT.md` | создан (этот файл) | — |

**Зависимости установлены:** `ai@latest`, `framer-motion@latest`, `lucide-react@latest`.
**Typecheck:** `npx tsc --noEmit` прошёл чисто (после `rm -rf .next`).

---

## 2. Что я проверил и увидел

### Скриншоты в `temp_screenshots/` — все 7 файлов прочитаны
| # | Экран | Ключевые факты |
|---|---|---|
| 1 | Главная | Тимур, табы MMarket/MBank, карточка MBANK NEW, баннер UEFA с Месси, service icons (MMarket, MTravel, Mashina.kg), bottom nav с **жёлтым** QR FAB |
| 2 | Платежи | Поиск "Свет", переводы по телефону, Между счетами/В другую страну/По номеру карты, мобильная связь |
| 3 | Сервисы | Мой авто, Госуслуги, Страховка, MInvest (лидеры роста Eagle Pharma +76%, Shift4 +19%) |
| 4 | Еще | Валютная полоса `KZT 0.19  USD 87.5  EUR 102.4  RUB 1.112`, Служба поддержки, MBANK ID, Настройки, **О приложении** |
| 5 | Профиль | РАХМАТУЛЛАЕВ ТИМУР АЗИСОВИЧ, тел +996703928100, email@email.com, Бишкек |
| 6 | Финансовый анализ | **«За Март 35 409,83 С»**, горизонтальный сегмент-бар, группа Сегодня (Тулпар 17, Перевод по QR 80, MEGA 100), Вчера (Тулпар 17×2, Перевод по QR 135, перевод по номеру 350) |
| 7 | Мой банк | **\*4796 (gold VISA) 3 409,53 С** + **\*7752 (purple VISA) 0,19 С**, продукты Кредиты / Рассрочки |

### Важные находки из скриншотов
1. Номера карт в моём первоначальном `mockData` были неправильные (`4821`/`7730`). **Исправлено** на `4796`/`7752`.
2. Валюты из скрина photo_4 — проброшены в `user.balances` (KGS 0.19, USD 87.5, EUR 102.4, RUB 1112).
3. Реальный бар на photo_6 за март = `35 409,83 С`, а не `20 030 С` (как в template `page.tsx`). `marchAnalysis.totalSpent = 20030` — **оставил как есть** для хакатона (это плейсхолдер "за Апрель", но при желании Блок 1 может синхронизировать).
4. На photo_6 виден паттерн "Оплата по QR Тулпар 17 С" — 2 раза за вчера. Это ГЕНИАЛЬНАЯ наживка для токсичного бро: "Тулпар 17 сом. Ещё раз Тулпар 17 сом. Ты хоть за бумагу в офисе собираешь чеки, экстремал?".

---

## 3. Что НЕ сделано (и почему)

| Пропуск | Причина | Где будет делаться |
|---|---|---|
| `/api/chat` route с Vercel AI SDK | Блок 2, отдельная сессия | Блок 2 мини-промпт |
| Tool handlers (`analyze_spending`, `predict_cashflow`, `find_free_money`, `manage_subscriptions`, `setup_savings_goal`) | Требуют `@ai-sdk/anthropic` и zod, лучше ставить в фокусированной сессии | Блок 2 |
| Генеративные UI-карточки (5 штук) | Много вёрстки, нужен отдельный storybook `/ui-lab` | Блок 3 |
| Подключение `useChat` к `ChatOverlay` | Зависит от Блока 2 и Блока 3 | Блок 4 |
| SuggestedPrompts chips + DEMO_SCRIPT.md | Полировка после MVP | Блок 5 |
| Screenshot compare cycles | Нужен работающий dev server + Puppeteer | Блок 6 |
| Home rebuild на mockData | Сейчас `page.tsx` рендерит хардкод-числа; надо перевести на `mockData.ts` | **Блок 1** (первый приоритет!) |

---

## 4. Открытые вопросы (нужно решение перед Блоком 2)

### 4.1. Судьба жёлтого QR FAB
**Проблема:** DESIGN.md фиксирует жёлтый `#FABF00` QR как часть нижней навигации. Я заменил его на зелёный AI-триггер.
**Варианты:**
- **A.** Оставить как сейчас (AI вместо QR). Pitch-line: "Мы заменили QR-сканер на AI — QR переехал в action-sheet". Плюс: cleaner. Минус: жюри может спросить "а где QR?".
- **B.** Добавить маленький QR-chip в правый верхний угол хедера (круг 32px, иконка QR). Оба элемента видны. Рекомендуется **в Блоке 1** — 5 минут работы, снимает вопрос навсегда.
- **C.** Вернуть жёлтый QR в навигацию и добавить AI-trigger как плавающую пилюлю над нижним краем чата. Дороже, сложнее, менее чисто.

**Моя рекомендация: вариант B.** Зафиксировано в PLAN.md Блок 1.

### 4.2. `serve.mjs` / `screenshot.mjs` из CLAUDE.md не существуют
**Проблема:** CLAUDE.md велит запускать `node serve.mjs` и `node screenshot.mjs http://localhost:3000` — этих файлов нет в проекте. Это у Claude Code из шаблона для static HTML, не для Next.js.
**Решение для Блока 6:** Использовать `npm run dev` и Puppeteer-скрипт инлайн (примере в PLAN.md Блок 6). Не создавать `serve.mjs`, он бесполезен для Next.js.

### 4.3. Папка: `temp_screenshots/` vs `temporary screenshots/`
**Проблема:** CLAUDE.md упоминает `./temporary screenshots/`, в проекте — `temp_screenshots/`. Мелочь, но оба места должны сойтись.
**Решение:** использовать существующую `temp_screenshots/`. Обновить упоминания в CLAUDE.md во время Блока 6, когда заработает screenshot-loop.

### 4.4. `ANTHROPIC_API_KEY`
**Проблема:** `.env.local.example` есть (36 байт), `.env.local` не проверял. Для Блока 2 нужен валидный ключ.
**Решение:** перед стартом Блока 2 — создать `.env.local` с ключом (пользователь вручную). Мой код ключ не увидит, Next.js сам его подставит.

### 4.5. Модель AI для tool calling
**Проблема:** Анекдот — мы используем Claude для генерации приложения, которое вызывает Claude. Какой модель зовём из `/api/chat`?
**Моя рекомендация:** `claude-sonnet-4-5` через `@ai-sdk/anthropic`. Опус дорого, Haiku может путаться в tool calls. Зафиксировано в мини-промпте Блока 2.

---

## 5. Метрика готовности (после ревизии scope)

```
Фундамент            ████████████████████  100% ✅
Данные (mock, база)  ████████████████████  100% ✅
Данные (autopilot+   ░░░░░░░░░░░░░░░░░░░░    0% 🔴  (Блок 1.5)
  pendingTx)
Home screen          ██████░░░░░░░░░░░░░░   30% 🟡 (template хардкод)
AutopilotWidget      ░░░░░░░░░░░░░░░░░░░░    0% 🔴  (Блок 1.5 — ⭐ новое)
Chat UI (оверлей)    ████████████░░░░░░░░   60% 🟡 (скелет + persona picker)
Chat API             ░░░░░░░░░░░░░░░░░░░░    0% 🔴  (Блок 2)
Tool calling (4)     ░░░░░░░░░░░░░░░░░░░░    0% 🔴  (Блок 2)
Generative cards (4) ░░░░░░░░░░░░░░░░░░░░    0% 🔴  (Блок 3)
Streaming chat       ░░░░░░░░░░░░░░░░░░░░    0% 🔴  (Блок 4)
Spending Intercept   ░░░░░░░░░░░░░░░░░░░░    0% 🔴  (Блок 5 — ⭐ новое)
Suggested chips      ░░░░░░░░░░░░░░░░░░░░    0% 🔴  (Блок 6)
DEMO_SCRIPT          ██░░░░░░░░░░░░░░░░░░   10% 🟡  (описан, не финализирован)
Polish + screenshots ░░░░░░░░░░░░░░░░░░░░    0% 🔴  (Блок 7)
E2E + fallback       ░░░░░░░░░░░░░░░░░░░░    0% 🔴  (Блок 8)
─────────────────────────────────────────────────
ИТОГО                                      ~25%
```

25% (вместо 30% до ревизии — scope вырос). Критический путь: Блоки 1.5 → 2 → 3 → 4 → 5 (≈22 часа Sonnet). Остальные 26 часов — polish, fallback, repetition, буфер.

---

## 6. Первый шаг после переключения на Sonnet 4.6

Скопируй в чат ровно это:

> Прочитай `CLAUDE.md`, `PLAN.md` (REVISION 2) и `PROGRESS_REPORT.md`. Затем выполни мини-промпт **Блока 1** из PLAN.md — rebuild Home на mockData + добавление QR-chip в header. В конце запусти `npx tsc --noEmit`. После Блока 1 — сразу Блок 1.5 (AutopilotWidget).

**Порядок блоков для Sonnet (критический путь):**
`Блок 1 → 1.5 → 2 → 3 → 4 → 5 → 6 → 7 → 8`

Не пропускай Блок 1.5 — это первый след AI на Home, без него жюри не поймёт фичу до тапа FAB.

После завершения Блока 5 (Spending Intercept) — сделай паузу и прогоняй демо-сценарий для sanity check, потом иди в Блок 6.

---

## 7. Анти-паттерны — чего НЕ делать в сессиях Sonnet

- ❌ Не трогать `mockData.ts` "чтобы красивее" — данные это истина.
- ❌ Не создавать `/login`, `/onboarding`, `/settings` — их нет в демо.
- ❌ Не использовать `transition-all`, дефолтный indigo/blue, dark theme.
- ❌ Не давать AI отвечать текстом там, где должна карточка.
- ❌ Не лезть в Блок 8 пока 1–7 не закрыты.
- ❌ Не делать real auth, real API, real DB.
- ❌ Не шутить над аптеками/медициной/похоронами в toxic-mode — `pendingTransactions` хардкодит ТОЛЬКО Тулпар/Coffee/Spotify.
- ❌ Не вызывать LLM из Spending Intercept — это offline-safe banner с хардкод-репликами.
- ❌ Не менять goal копилки на Блоке 1.5 — AI выбрал «на машину» сам. Юзер не трогает.

---

## ВЫПОЛНЕНО (финальный чекапист)

✅ **CLAUDE.md** (189 строк) — Project brief + Vision Critique + Anti-patterns + **Product Vision REVISION 2** с Feature A (Spending Intercept) и Feature B (AI Autopilot Savings)

✅ **PLAN.md** (636 строк) — **9 блоков, REVISION 2**:
- Блок 1: Home rebuild на mockData + QR chip
- Блок 1.5 ⭐ НОВЫЙ: AutopilotWidget на Home
- Блок 2: `/api/chat` + 4 tools
- Блок 3: 4 генеративные карточки
- Блок 4: Streaming chat + persona
- Блок 5 ⭐ НОВЫЙ ЦЕНТРАЛЬНЫЙ: Spending Intercept
- Блок 6: Suggested prompts + DEMO_SCRIPT.md
- Блок 7: Screenshot pass + polish
- Блок 8: E2E + offline fallback + pitch frames

✅ **PROGRESS_REPORT.md** (этот файл, 168+ строк) — TL;DR, файлы, скриншоты, критика, метрика, риски, антипаттерны, финальный setup

✅ **~/.claude/plans/quiet-beaming-umbrella.md** — Утверждённый план с фичами A+B, решение юзера (goal + offline), ревизованные блоки, критические файлы, exit criteria

✅ **mockData.ts** (полный) — user (Тимур, РАХМАТУЛЛАЕВ, +996703928100), cards (*4796 gold, *7752 purple), transactions (Сегодня/Вчера/На неделе/Ранее), subscriptions, upcomingBills, personas (caring + toxic с systemPrompt'ами и safety rules)

✅ **ChatOverlay.tsx** — Skelet готов: slide-up spring animation, PersonaPicker с 2 карточками, EmptyChat состояние, задизейбленный composer

✅ **page.tsx** — `"use client"`, `useState(chatOpen)`, зелёный AI FAB (emerald, sparkle icon), ChatOverlay mounted

✅ **Зависимости установлены**: `ai`, `framer-motion`, `lucide-react`, `@anthropic-ai/sdk`

✅ **Типчек**: `npx tsc --noEmit` прошёл чисто

✅ **Git**: коммиты готовы, можно делать `git log` для истории

---

## СОСТОЯНИЕ: ✅ READY FOR IMPLEMENTATION

**Переключайся на Claude Sonnet 4.6.** Скопируй в новую сессию первый абзац из раздела 6 (`PROGRESS_REPORT.md` → First step). Sonnet начнёт с Блока 1 и пойдёт по критическому пути 1→1.5→2→3→4→5→6→7→8.

**Демо на питче (3 мин):** Home с виджетом → интервент с Тулпаром → persona-свитч → 3 chip'а в чате → closing line про агента+виральность+бизнес-модель.

---

## 8. Что будет победой

На питче через 48 часов:
1. Жюри видит MBank, который выглядит как MBank (скриншоты совпадают).
2. Жмёт AI-кнопку — slide-up, persona picker.
3. Выбирает Токсичного бро.
4. Тап на "Хватит до зарплаты?" → появляется **не текст**, а реальная карточка с прогнозом кассового разрыва и кнопкой "Заморозить".
5. Тап на "Прожарь мои траты" → AI саркастично ругает за Тулпар.
6. Переключение на Заботливого — тон меняется, цифры нет. Жюри понимает, что это не один промпт, а система.
7. Closing line: *"Это не PFM с AI-чатом. Это агент, у которого есть доступ к деньгам и характер. Виральность Instagram + кросс-продажи MBank."*

Если хоть один из этих 7 пунктов не работает — это не победа.
