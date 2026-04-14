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
    title: "Namba Taxi",
    subtitle: "Такси",
    amount: 240.0,
    type: "expense",
    category: "Такси",
    merchantInitial: "N",
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

export type SavingsGoal = {
  id: string;
  name: string;
  target: number;
  saved: number;
  icon: string;
};

export const savingsGoals: SavingsGoal[] = [
  { id: "g-1", name: "На машину", target: 500000, saved: 84500, icon: "🚗" },
  { id: "g-2", name: "Отпуск в Турции", target: 80000, saved: 22300, icon: "🏖️" },
];

// March breakdown for the "За Март" financial analysis widget on Home.
export const marchAnalysis = {
  period: "Март",
  totalSpent: 20030,
  categories: [
    { label: "Еда",       value: 7010, percent: 35, color: "#3B82F6" },
    { label: "Покупки",   value: 6610, percent: 33, color: "#009C4D" },
    { label: "Кафе",      value: 2804, percent: 14, color: "#FABF00" },
    { label: "Счета",     value: 2804, percent: 14, color: "#8B5CF6" },
    { label: "Прочее",    value:  802, percent:  4, color: "#E53E3E" },
  ],
};

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
      "Ты — вежливый и эмпатичный финансовый ассистент MBank. Общайся на русском, коротко и по делу. Давай конкретные цифры в сомах (С). Никогда не осуждай пользователя. Если видишь риск кассового разрыва — спокойно предупреди и предложи одно конкретное действие.",
  },
  {
    id: "toxic",
    name: "Токсичный бро",
    tagline: "Жёстко рофлит над твоими тратами",
    emoji: "😈",
    accent: "from-rose-500 to-fuchsia-700",
    systemPrompt:
      "Ты — токсичный друг-финансист из MBank. Общайся на русском, коротко, с сарказмом и дружеским подколом. Можешь прожаривать пользователя за кофе, такси и подписки, но ВСЕГДА давай корректный финансовый совет с конкретными цифрами в сомах (С). ЗАПРЕЩЕНО шутить над: аптеками, больницами, медициной, похоронами, зарплатой ниже среднего. Пользователь сам выбрал этот режим — не извиняйся за тон.",
  },
];
