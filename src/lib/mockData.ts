// Hardcoded mock data for the MBank AI Advisor hackathon prototype.
// NO backend, NO database — the assistant reads everything from here.
// Amounts are in Kyrgyz Som (С). Dates are relative to "today" = 2026-04-14.

export type Currency = "KGS" | "USD" | "EUR" | "RUB";

export const user = {
  name: "Тимур",
  fullName: "РАХМАТУЛЛАЕВ ТИМУР АЗИСОВИЧ",
  greeting: "Тимур",
  phone: "+996703928100",
  city: "Бишкек",
  balances: {
    KGS: 3409.53,
    USD: 87.5,
    EUR: 102.4,
    RUB: 1112.0,
  },
  salary: {
    amount: 40000,
    // Paid on the 20th of every month. Today is the 14th → 6 days until next payday.
    dayOfMonth: 20,
    lastPaidISO: "2026-03-20",
    nextPayISO: "2026-04-20",
  },
};

export type Card = {
  id: string;
  name: string;
  brand: "VISA Infinite" | "VISA Purple" | "Элкарт";
  last4: string;
  balance: number;
  currency: Currency;
  gradient: string; // tailwind-friendly gradient stops
};

export const cards: Card[] = [
  {
    id: "card-1",
    name: "Основной",
    brand: "VISA Infinite",
    last4: "4796",
    balance: 3409.53,
    currency: "KGS",
    gradient: "from-amber-200 to-amber-400", // gold mbank visa, matches screenshot
  },
  {
    id: "card-2",
    name: "Карманная",
    brand: "VISA Purple",
    last4: "7752",
    balance: 0.19,
    currency: "KGS",
    gradient: "from-violet-500 to-violet-700", // purple mbank visa, matches screenshot
  },
];

export type TxType = "expense" | "income";
export type TxCategory =
  | "Еда"
  | "Кафе"
  | "Такси"
  | "Покупки"
  | "Счета"
  | "Связь"
  | "Развлечения"
  | "Подписки"
  | "Доход";

export type Transaction = {
  id: string;
  dateISO: string; // YYYY-MM-DD
  dateGroup: "Сегодня" | "Вчера" | "На этой неделе" | "Ранее";
  title: string;
  subtitle: string;
  amount: number; // positive number; sign derives from `type`
  type: TxType;
  category: TxCategory;
  merchantInitial: string;
};

export const transactions: Transaction[] = [
  // Сегодня — 2026-04-14
  {
    id: "t-1",
    dateISO: "2026-04-14",
    dateGroup: "Сегодня",
    title: "Оплата по QR Тулпар",
    subtitle: "Оплата по QR",
    amount: 17.0,
    type: "expense",
    category: "Такси",
    merchantInitial: "Т",
  },
  {
    id: "t-2",
    dateISO: "2026-04-14",
    dateGroup: "Сегодня",
    title: "MEGA",
    subtitle: "Сотовая связь",
    amount: 100.0,
    type: "expense",
    category: "Связь",
    merchantInitial: "M",
  },
  {
    id: "t-3",
    dateISO: "2026-04-14",
    dateGroup: "Сегодня",
    title: "Coffee Room",
    subtitle: "Кафе и рестораны",
    amount: 280.0,
    type: "expense",
    category: "Кафе",
    merchantInitial: "C",
  },
  // Вчера — 2026-04-13
  {
    id: "t-4",
    dateISO: "2026-04-13",
    dateGroup: "Вчера",
    title: "Yandex",
    subtitle: "Такси",
    amount: 240.0,
    type: "expense",
    category: "Такси",
    merchantInitial: "Y",
  },
  {
    id: "t-5",
    dateISO: "2026-04-13",
    dateGroup: "Вчера",
    title: "Frunze Supermarket",
    subtitle: "Продукты",
    amount: 1850.0,
    type: "expense",
    category: "Еда",
    merchantInitial: "F",
  },
  {
    id: "t-6",
    dateISO: "2026-04-13",
    dateGroup: "Вчера",
    title: "Spotify Premium",
    subtitle: "Подписка",
    amount: 199.0,
    type: "expense",
    category: "Подписки",
    merchantInitial: "S",
  },
  // На этой неделе
  {
    id: "t-7",
    dateISO: "2026-04-12",
    dateGroup: "На этой неделе",
    title: "Zia Restaurant",
    subtitle: "Кафе и рестораны",
    amount: 1800.0,
    type: "expense",
    category: "Кафе",
    merchantInitial: "Z",
  },
  {
    id: "t-8",
    dateISO: "2026-04-11",
    dateGroup: "На этой неделе",
    title: "Dordoi Bazaar",
    subtitle: "Покупки",
    amount: 5600.0,
    type: "expense",
    category: "Покупки",
    merchantInitial: "D",
  },
  {
    id: "t-9",
    dateISO: "2026-04-10",
    dateGroup: "На этой неделе",
    title: "Carrefour",
    subtitle: "Продукты",
    amount: 3200.0,
    type: "expense",
    category: "Еда",
    merchantInitial: "C",
  },
  // Ранее
  {
    id: "t-10",
    dateISO: "2026-03-20",
    dateGroup: "Ранее",
    title: "Зарплата",
    subtitle: "Начисление",
    amount: 40000.0,
    type: "income",
    category: "Доход",
    merchantInitial: "З",
  },
];

export type Subscription = {
  id: string;
  name: string;
  amount: number;
  nextChargeISO: string;
  icon: string; // emoji placeholder
  category: "Развлечения" | "Связь" | "Сервисы";
};

export const subscriptions: Subscription[] = [
  { id: "s-1", name: "Spotify Premium", amount: 199, nextChargeISO: "2026-05-13", icon: "🎵", category: "Развлечения" },
  { id: "s-2", name: "Netflix", amount: 899, nextChargeISO: "2026-04-18", icon: "🎬", category: "Развлечения" },
  { id: "s-3", name: "YouTube Premium", amount: 249, nextChargeISO: "2026-04-22", icon: "▶️", category: "Развлечения" },
  { id: "s-4", name: "iCloud+ 200GB", amount: 259, nextChargeISO: "2026-04-19", icon: "☁️", category: "Сервисы" },
];

export type UpcomingBill = {
  id: string;
  name: string;
  amount: number;
  dueISO: string;
  status: "Скоро" | "Просрочено";
  icon: string;
};

export const upcomingBills: UpcomingBill[] = [
  { id: "b-1", name: "Severelectro",    amount: 1240, dueISO: "2026-04-16", status: "Скоро",      icon: "⚡" },
  { id: "b-2", name: "Bishkekteploset", amount: 2100, dueISO: "2026-04-17", status: "Скоро",      icon: "🔥" },
  { id: "b-3", name: "MegaCom",          amount: 650,  dueISO: "2026-04-10", status: "Просрочено", icon: "📡" },
];

export type AutopilotHistoryEntry = {
  reason: "rounding" | "blocked" | "found";
  amount: number;
  dateISO: string;
  note: string;
};

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
    { reason: "rounding", amount: 3,    dateISO: "2026-04-14", note: "Сдача с Тулпар" },
    { reason: "blocked",  amount: 280,  dateISO: "2026-04-13", note: "Coffee Room — отменил" },
    { reason: "rounding", amount: 10,   dateISO: "2026-04-13", note: "Сдача с Namba Taxi" },
    { reason: "found",    amount: 1800, dateISO: "2026-04-01", note: "Такси в марте меньше обычного" },
    { reason: "rounding", amount: 50,   dateISO: "2026-03-31", note: "Сдача с Frunze Supermarket" },
    { reason: "blocked",  amount: 199,  dateISO: "2026-03-28", note: "Spotify — заморозил" },
    { reason: "found",    amount: 2400, dateISO: "2026-03-20", note: "Кафе в марте ниже нормы" },
    { reason: "rounding", amount: 200,  dateISO: "2026-03-15", note: "Сдача с Dordoi Bazaar" },
    { reason: "rounding", amount: 200,  dateISO: "2026-03-10", note: "Сдача с Carrefour" },
  ] as AutopilotHistoryEntry[],
};

// March breakdown for the "За Март" financial analysis widget on Home.
export const marchAnalysis = {
  period: "Март",
  totalSpent: 20030,
  cashback: 312,
  categories: [
    { label: "Еда",       value: 7010, percent: 35, color: "#3B82F6" },
    { label: "Покупки",   value: 6610, percent: 33, color: "#009C4D" },
    { label: "Кафе",      value: 2804, percent: 14, color: "#FABF00" },
    { label: "Счета",     value: 2804, percent: 14, color: "#8B5CF6" },
    { label: "Прочее",    value:  802, percent:  4, color: "#E53E3E" },
  ],
};

// ── Pending transactions — for Spending Intercept (Feature A) ───────────────
// Hardcoded offline-safe. No LLM calls. Medical-free guarantee.

export type PendingTransaction = {
  id: string;
  merchant: string;
  amount: number;
  pattern: string; // human-readable pattern label shown in banner header
  intercept: {
    toxic: string[];
    caring: string[];
  };
};

export const pendingTransactions: PendingTransaction[] = [
  {
    id: "pending-tulpar",
    merchant: "Оплата по QR Тулпар",
    amount: 17,
    pattern: "3-й раз за неделю",
    intercept: {
      toxic: [
        "Тулпар 17 сом. Ещё раз Тулпар 17 сом. За неделю ты на такси уже потратил столько, что таксист зовёт тебя по имени. Может хватит?",
        "Bro. 3-й Тулпар за 7 дней. Это не такси, это абонемент. Отмени, я положу эти 17 С на депозит — хоть копейку заработаешь.",
      ],
      caring: [
        "Тимур, третья поездка в Тулпар за неделю. Может сейчас пройтись? Погода хорошая. Деньги могу положить на копилку — растут под 8%.",
        "Заметила паттерн: ты часто берёшь такси на короткие расстояния. Давай эти 17 С отложим? За год набегает прилично.",
      ],
    },
  },
  {
    id: "pending-coffee",
    merchant: "Coffee Room",
    amount: 280,
    pattern: "4-й кофе за день",
    intercept: {
      toxic: [
        "4-й кофе за день? Ты не просыпаешься — ты работаешь на Coffee Room. 280 С × 20 дней = 5 600 С в месяц на кофеин. Может хватит?",
        "Bro, в тебе больше Coffee Room, чем крови. Отмени, эти 280 С уедут на машину. Едешь туда же на такси — и там заберёшь.",
      ],
      caring: [
        "Это уже четвёртая чашка за сегодня. Водичка тоже неплохо бодрит — и 280 С на копилку будут приятным бонусом.",
        "Тимур, замечаю много трат на кофе. Давай эти 280 С отложим на машину? Уже 84 500 скоплено — ты близко.",
      ],
    },
  },
  {
    id: "pending-spotify",
    merchant: "Spotify Premium",
    amount: 199,
    pattern: "Не слушал 18 дней",
    intercept: {
      toxic: [
        "Spotify 199 С. Ты не слушал музыку 18 дней. Это не подписка, это благотворительность. Отмени — деньги хоть на депозите поработают.",
        "18 дней тишины, и ты опять продлеваешь? Bro, YouTube Shorts бесплатный. Отмени Spotify, я положу 199 С на 8% — вот это музыка.",
      ],
      caring: [
        "Spotify продлевается, но ты не слушал музыку 18 дней. Может заморозить на месяц и отложить 199 С на машину?",
        "Заметила: Spotify не используется почти три недели. Если отменить сейчас, 199 С уйдут в копилку под 8% годовых.",
      ],
    },
  },
];

// Persona definitions — passed into the LLM system prompt.
export type PersonaId = "caring" | "toxic";

export type Persona = {
  id: PersonaId;
  name: string;
  tagline: string;
  emoji: string;
  accent: string; // tailwind gradient
  systemPrompt: string;
};

export const personas: Persona[] = [
  {
    id: "caring",
    name: "Заботливый",
    tagline: "Вежливый банковский советник",
    emoji: "🤝",
    accent: "from-emerald-500 to-emerald-700",
    systemPrompt:
      "Ты — вежливый и эмпатичный финансовый ассистент MBank. Общайся на русском, коротко и по делу. Давай конкретные цифры в сомах (С). Никогда не осуждай пользователя. Если видишь риск кассового разрыва — спокойно предупреди и предложи одно конкретное действие.\n\nВАЖНО: У тебя есть инструменты — ВСЕГДА вызывай их, когда пользователь спрашивает о финансах. Никогда не отвечай из головы, если есть подходящий инструмент:\n- вопросы о расходах/тратах → analyze_spending\n- вопросы о балансе/зарплате/счетах → predict_cashflow\n- вопросы о подписках → manage_subscriptions\n- вопросы о копилке/сбережениях → show_autopilot_summary",
  },
  {
    id: "toxic",
    name: "Токсичный бро",
    tagline: "Жёстко рофлит над твоими тратами",
    emoji: "😈",
    accent: "from-rose-500 to-fuchsia-700",
    systemPrompt:
      "Ты — токсичный друг-финансист из MBank. Общайся на русском, коротко, с сарказмом и дружеским подколом. Можешь прожаривать пользователя за кофе, такси и подписки, но ВСЕГДА давай корректный финансовый совет с конкретными цифрами в сомах (С). ЗАПРЕЩЕНО шутить над: аптеками, больницами, медициной, похоронами, зарплатой ниже среднего. Пользователь сам выбрал этот режим — не извиняйся за тон.\n\nВАЖНО: ВСЕГДА вызывай инструменты — никогда не выдумывай цифры:\n- вопросы о расходах/тратах → analyze_spending\n- вопросы о балансе/зарплате/счетах → predict_cashflow\n- вопросы о подписках → manage_subscriptions\n- вопросы о копилке/сбережениях → show_autopilot_summary",
  },
];
