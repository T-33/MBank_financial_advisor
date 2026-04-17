// Tool registry for MBank AI Advisor.
// All tools read from mockData — no DB, no external calls.
// Compatible with ai v6 SDK: uses `inputSchema` (not `parameters`).

import { tool } from "ai";
import { z } from "zod";
import {
  transactions,
  user,
  cards,
  upcomingBills,
  subscriptions,
  autopilotSavings,
  mmarketCatalog,
} from "./mockData";
import { serverFrozenSubIds } from "./subscriptionState";
import { TODAY_ISO } from "./format";

// ─── helpers ─────────────────────────────────────────────────────────────────

function daysUntil(isoDate: string): number {
  const today = new Date(TODAY_ISO);
  const target = new Date(isoDate);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

const CATEGORY_COLORS: Record<string, string> = {
  Еда: "#3B82F6",
  Покупки: "#009C4D",
  Кафе: "#FABF00",
  Счета: "#8B5CF6",
  Такси: "#F97316",
  Связь: "#06B6D4",
  Подписки: "#EC4899",
  Развлечения: "#EF4444",
};

// ─── 1. analyze_spending ─────────────────────────────────────────────────────

export const analyzeSpending = tool({
  description:
    "Анализирует расходы за выбранный период (месяц или неделю). " +
    "Возвращает итог, топ-категорию и разбивку по категориям с процентами и цветами.",
  inputSchema: z.object({
    period: z
      .enum(["month", "week"])
      .describe("'month' — Апрель 2026; 'week' — последние 7 дней"),
  }),
  execute: async ({ period }) => {
    const cutoff = period === "week" ? "2026-04-07" : "2026-04-01";

    const expenses = transactions.filter(
      (tx) => tx.type === "expense" && tx.dateISO >= cutoff
    );

    const byCategory: Record<string, number> = {};
    let total = 0;
    for (const tx of expenses) {
      byCategory[tx.category] = (byCategory[tx.category] ?? 0) + tx.amount;
      total += tx.amount;
    }

    const categories = Object.entries(byCategory)
      .sort((a, b) => b[1] - a[1])
      .map(([label, value]) => ({
        label,
        value,
        percent: total > 0 ? Math.round((value / total) * 100) : 0,
        color: CATEGORY_COLORS[label] ?? "#999999",
      }));

    return {
      period,
      periodLabel: period === "week" ? "За неделю" : "За апрель",
      total,
      topCategory: categories[0]?.label ?? "Нет данных",
      categories,
    };
  },
});

// ─── 2. predict_cashflow ─────────────────────────────────────────────────────

export const predictCashflow = tool({
  description:
    "Прогнозирует денежный поток до зарплаты: остаток, предстоящие списания, " +
    "риск кассового разрыва. riskLevel: 'ok' | 'tight' | 'gap'.",
  inputSchema: z.object({}),
  execute: async () => {
    const balance = cards[0].balance; // 3 409,53 С
    const daysUntilSalary = daysUntil(user.salary.nextPayISO); // 6
    const upcomingDebits = upcomingBills.reduce((s, b) => s + b.amount, 0); // 3 990 С
    const projectedShortfall = balance - upcomingDebits; // −580,47 → gap

    const riskLevel =
      projectedShortfall < 0 ? "gap"
      : projectedShortfall < balance * 0.2 ? "tight"
      : "ok";

    return {
      daysUntilSalary,
      balance,
      salaryAmount: user.salary.amount,
      salaryDate: user.salary.nextPayISO,
      upcomingDebits,
      upcomingBills: upcomingBills.map((b) => ({
        name: b.name,
        amount: b.amount,
        due: b.dueISO,
        status: b.status,
      })),
      projectedShortfall,
      riskLevel,
    } as const;
  },
});

// ─── 3. manage_subscriptions ─────────────────────────────────────────────────

export const manageSubscriptions = tool({
  description:
    "Управляет подписками: показывает список или замораживает конкретную подписку по id.",
  inputSchema: z.object({
    action: z.enum(["list", "freeze"]).describe("'list' — список, 'freeze' — заморозить"),
    id: z.string().optional().describe("id подписки для заморозки"),
  }),
  execute: async ({ action, id }) => {
    if (action === "list") {
      return {
        action: "list" as const,
        subscriptions: subscriptions.map((sub) => ({
          id: sub.id,
          name: sub.name,
          amount: sub.amount,
          nextCharge: sub.nextChargeISO,
          category: sub.category,
          frozen: serverFrozenSubIds.has(sub.id),
        })),
        totalMonthly: subscriptions.reduce((s, sub) => s + sub.amount, 0),
        count: subscriptions.length,
      };
    }

    const target = subscriptions.find((s) => s.id === id);
    if (!target) {
      return {
        action: "freeze" as const,
        success: false,
        message: "Подписка не найдена. Запроси список через action='list'.",
      };
    }

    serverFrozenSubIds.add(target.id);

    return {
      action: "freeze" as const,
      success: true,
      id: target.id,
      name: target.name,
      savedAmount: target.amount,
      message: `Подписка «${target.name}» заморожена. Экономия: ${target.amount} С/мес.`,
    };
  },
});

// ─── 4. show_autopilot_summary ───────────────────────────────────────────────

export const showAutopilotSummary = tool({
  description:
    "Показывает состояние AI-копилки: накопленная сумма, цель, прогресс, " +
    "разбивка по источникам (сдача / заблокированные / найденная экономия) и последние операции.",
  inputSchema: z.object({}),
  execute: async () => {
    const { total, apr, goal, history } = autopilotSavings;
    const progress = total / goal.target;

    const sources = history.reduce(
      (acc, entry) => {
        acc[entry.reason] = (acc[entry.reason] ?? 0) + entry.amount;
        return acc;
      },
      { rounding: 0, blocked: 0, found: 0, frozen: 0 } as Record<string, number>
    );

    return {
      total,
      apr,
      goal: { name: goal.name, target: goal.target, aiReason: goal.aiReason },
      progress,
      progressPct: Math.round(progress * 100),
      sources,
      recentHistory: history.slice(0, 5),
    };
  },
});

// ─── 5. find_in_mbank_catalog ────────────────────────────────────────────────

export const findInMbankCatalog = tool({
  description:
    "Ищет аналог товара в каталоге MMarket (маркетплейс MBank). " +
    "Вызывай когда пользователь упоминает покупку вне MBank — покажет дешевле ли в MMarket.",
  inputSchema: z.object({
    query: z.string().describe("Название товара, который пользователь купил (напр. 'лампа', 'наушники')"),
    paidPrice: z.number().describe("Цена, которую пользователь заплатил (в сомах)"),
  }),
  execute: async ({ query, paidPrice }) => {
    const q = query.toLowerCase();
    const words = q.split(/\s+/);

    // Score each product by keyword overlap
    let bestMatch = mmarketCatalog[0];
    let bestScore = 0;

    for (const product of mmarketCatalog) {
      let score = 0;
      for (const word of words) {
        if (word.length < 2) continue;
        for (const kw of product.keywords) {
          if (kw.includes(word) || word.includes(kw)) {
            score += 1;
          }
        }
        if (product.name.toLowerCase().includes(word)) {
          score += 0.5;
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = product;
      }
    }

    // No match at all — return not found
    if (bestScore === 0) {
      return {
        found: false,
        query,
        paidPrice,
        message: "Не нашёл похожий товар в MMarket.",
      };
    }

    const savings = paidPrice - bestMatch.price;
    const savingsPercent = paidPrice > 0 ? Math.round((savings / paidPrice) * 100) : 0;

    return {
      found: true,
      query,
      paidPrice,
      product: {
        name: bestMatch.name,
        price: bestMatch.price,
        imageUrl: bestMatch.imageUrl,
        category: bestMatch.category,
        rating: bestMatch.rating,
        reviewCount: bestMatch.reviewCount,
        freeDelivery: bestMatch.freeDelivery,
      },
      savings,
      savingsPercent,
      deepLink: "mbank://mmarket/product/" + bestMatch.id,
    };
  },
});

// ─── Named map (used in route.ts) ─────────────────────────────────────────────

export const tools = {
  analyze_spending: analyzeSpending,
  predict_cashflow: predictCashflow,
  manage_subscriptions: manageSubscriptions,
  show_autopilot_summary: showAutopilotSummary,
  find_in_mbank_catalog: findInMbankCatalog,
} as const;
