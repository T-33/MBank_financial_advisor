export const user = {
  name: "Aizat Nurlanovna",
  accountNumber: "****4821",
  balance: 38_450,
  currency: "KGS",
  monthlyIncome: 40_000,
};

export const bills = [
  {
    id: "1",
    name: "Severelectro",
    category: "Electricity",
    amount: 1_240,
    dueDate: "2026-03-27",
    status: "due_soon",
    icon: "⚡",
  },
  {
    id: "2",
    name: "Bishkekteploset",
    category: "Heating",
    amount: 2_100,
    dueDate: "2026-03-31",
    status: "due_soon",
    icon: "🔥",
  },
  {
    id: "3",
    name: "Gazprom KR",
    category: "Gas",
    amount: 890,
    dueDate: "2026-04-05",
    status: "upcoming",
    icon: "🔵",
  },
  {
    id: "4",
    name: "Water Utility",
    category: "Water",
    amount: 560,
    dueDate: "2026-04-10",
    status: "upcoming",
    icon: "💧",
  },
  {
    id: "5",
    name: "Internet (MegaCom)",
    category: "Internet",
    amount: 650,
    dueDate: "2026-03-15",
    status: "overdue",
    icon: "📡",
  },
];

export const transactions = [
  { id: "1", description: "Carrefour", category: "Food", amount: -3_200, date: "2026-03-22" },
  { id: "2", description: "Dordoi Bazaar", category: "Shopping", amount: -5_600, date: "2026-03-21" },
  { id: "3", description: "Salary", category: "Income", amount: 40_000, date: "2026-03-20" },
  { id: "4", description: "Zia restaurant", category: "Dining", amount: -1_800, date: "2026-03-19" },
  { id: "5", description: "Marshrutka", category: "Transport", amount: -120, date: "2026-03-19" },
  { id: "6", description: "Fix Price", category: "Shopping", amount: -980, date: "2026-03-18" },
  { id: "7", description: "Fatboy's Burger", category: "Dining", amount: -650, date: "2026-03-17" },
  { id: "8", description: "Pharmacy 36.6", category: "Health", amount: -430, date: "2026-03-16" },
  { id: "9", description: "Narodni store", category: "Food", amount: -2_100, date: "2026-03-15" },
  { id: "10", description: "Taxi", category: "Transport", amount: -350, date: "2026-03-14" },
  { id: "11", description: "Coffee Boom", category: "Dining", amount: -280, date: "2026-03-13" },
  { id: "12", description: "Osh Bazaar", category: "Food", amount: -1_750, date: "2026-03-12" },
];

export const spendingByCategory = [
  { category: "Food", amount: 7_050, color: "#3b82f6", percent: 35 },
  { category: "Shopping", amount: 6_580, color: "#f97316", percent: 33 },
  { category: "Dining", amount: 2_730, color: "#8b5cf6", percent: 14 },
  { category: "Transport", amount: 470, color: "#10b981", percent: 2 },
  { category: "Health", amount: 430, color: "#ec4899", percent: 2 },
  { category: "Bills", amount: 2_790, color: "#64748b", percent: 14 },
];

export const savingsGoals = [
  {
    id: "1",
    name: "Emergency Fund",
    targetAmount: 50_000,
    savedAmount: 8_200,
    deadline: "2026-09-01",
    icon: "🛡️",
    color: "#3b82f6",
  },
  {
    id: "2",
    name: "New Laptop",
    targetAmount: 35_000,
    savedAmount: 12_500,
    deadline: "2026-07-01",
    icon: "💻",
    color: "#f97316",
  },
  {
    id: "3",
    name: "Vacation (Turkey)",
    targetAmount: 80_000,
    savedAmount: 5_000,
    deadline: "2026-12-01",
    icon: "✈️",
    color: "#8b5cf6",
  },
];

export const mbankFeatures = [
  {
    id: "1",
    name: "mInvest",
    description: "Invest from 1,000 KGS in government bonds. Average 10% annual return.",
    activated: false,
    icon: "📈",
    benefit: "Earn ~4,000 KGS/year on idle savings",
    cta: "Start Investing",
  },
  {
    id: "2",
    name: "Auto-Pay",
    description: "Automatically pay your utility bills on time. Never get fined again.",
    activated: false,
    icon: "🔄",
    benefit: "Save time, avoid late fees",
    cta: "Enable Auto-Pay",
  },
  {
    id: "3",
    name: "Cashback Card",
    description: "Get 1.5% cashback on all purchases made with your MBank card.",
    activated: false,
    icon: "💳",
    benefit: "Earn ~300 KGS/month on your spending",
    cta: "Activate Cashback",
  },
  {
    id: "4",
    name: "Smart Savings",
    description: "Automatically round up each purchase and save the difference.",
    activated: true,
    icon: "🏦",
    benefit: "Currently active — saving ~200 KGS/month",
    cta: "Manage",
  },
];
