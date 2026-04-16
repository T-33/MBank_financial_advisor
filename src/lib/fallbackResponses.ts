// Offline fallback responses — pre-computed from mockData.
// Used when DeepSeek API is unreachable (no internet / key expired).
// Covers the 6 suggested chips + default.

import {
  autopilotSavings,
  cards,
  user,
  upcomingBills,
  transactions,
  subscriptions,
  mmarketCatalog,
  type PersonaId,
} from "./mockData";
import { serverFrozenSubIds } from "./subscriptionState";

const COLORS: Record<string, string> = {
  Еда: "#3B82F6",
  Покупки: "#009C4D",
  Кафе: "#FABF00",
  Такси: "#F97316",
  Связь: "#06B6D4",
  Подписки: "#EC4899",
  Развлечения: "#EF4444",
};

// ── Which tool to call based on last user message ─────────────────────────────

export function detectFallbackTool(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("копилк") || m.includes("машин") || m.includes("сберег"))
    return "show_autopilot_summary";
  if (
    m.includes("зарплат") ||
    m.includes("хватит") ||
    m.includes("баланс") ||
    m.includes("кассов") ||
    m.includes("до зарплат")
  )
    return "predict_cashflow";
  if (
    m.includes("ушли") ||
    m.includes("расход") ||
    m.includes("трат") ||
    m.includes("прожар") ||
    m.includes("деньги")
  )
    return "analyze_spending";
  if (m.includes("подписк")) return "manage_subscriptions";
  if (
    m.includes("купил") ||
    m.includes("заказал") ||
    m.includes("потратил на") ||
    m.includes("орто-сай") ||
    m.includes("базар") ||
    m.includes("магазин")
  )
    return "find_in_mbank_catalog";
  // default — cash flow is the most "wow" card
  return "predict_cashflow";
}

// ── Pre-computed tool outputs ─────────────────────────────────────────────────

export function getFallbackOutput(toolName: string): Record<string, unknown> {
  switch (toolName) {
    case "show_autopilot_summary": {
      const { total, apr, goal, history } = autopilotSavings;
      const target = goal.target;
      const sources = history.reduce(
        (acc, e) => {
          acc[e.reason] = (acc[e.reason] ?? 0) + e.amount;
          return acc;
        },
        { rounding: 0, blocked: 0, found: 0 } as Record<string, number>
      );
      return {
        total,
        apr,
        goal,
        progress: total / target,
        progressPct: Math.round((total / target) * 100),
        sources,
        recentHistory: history.slice(0, 5),
      };
    }

    case "predict_cashflow": {
      const balance = cards[0].balance;
      const upcomingDebits = upcomingBills.reduce((s, b) => s + b.amount, 0);
      return {
        daysUntilSalary: 6,
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
        projectedShortfall: balance - upcomingDebits,
        riskLevel: "gap",
      };
    }

    case "analyze_spending": {
      const expenses = transactions.filter((t) => t.type === "expense");
      const by: Record<string, number> = {};
      let total = 0;
      for (const tx of expenses) {
        by[tx.category] = (by[tx.category] ?? 0) + tx.amount;
        total += tx.amount;
      }
      const categories = Object.entries(by)
        .sort((a, b) => b[1] - a[1])
        .map(([label, value]) => ({
          label,
          value,
          percent: Math.round((value / total) * 100),
          color: COLORS[label] ?? "#999",
        }));
      return {
        period: "week",
        periodLabel: "За неделю",
        total,
        topCategory: categories[0]?.label ?? "Еда",
        categories,
      };
    }

    case "manage_subscriptions":
      return {
        action: "list",
        subscriptions: subscriptions.map((s) => ({
          id: s.id,
          name: s.name,
          amount: s.amount,
          nextCharge: s.nextChargeISO,
          category: s.category,
          frozen: serverFrozenSubIds.has(s.id),
        })),
        totalMonthly: subscriptions.reduce((s, sub) => s + sub.amount, 0),
        count: subscriptions.length,
      };

    case "find_in_mbank_catalog": {
      const product = mmarketCatalog[0]; // LED lamp — default fallback match
      const paidPrice = 500;
      return {
        found: true,
        query: "лампа",
        paidPrice,
        product: {
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          category: product.category,
          rating: product.rating,
          reviewCount: product.reviewCount,
          freeDelivery: product.freeDelivery,
        },
        savings: paidPrice - product.price,
        savingsPercent: Math.round(((paidPrice - product.price) / paidPrice) * 100),
        deepLink: "mbank://mmarket/product/" + product.id,
      };
    }

    default:
      return {};
  }
}

// ── Canned reply text ─────────────────────────────────────────────────────────

export function getFallbackText(
  toolName: string,
  personaId: PersonaId
): string {
  const toxic = personaId === "toxic";

  const LINES: Record<string, [string, string]> = {
    //                                      [caring,             toxic]
    show_autopilot_summary: [
      "Вот состояние твоей AI-копилки на машину:",
      "Пока ты транжиришь, я за тебя коплю. Вот результаты моей работы:",
    ],
    predict_cashflow: [
      "Вот прогноз до зарплаты — есть риск кассового разрыва:",
      "До зарплаты 6 дней и ты уже в минусе. Как обычно. Держи расклад:",
    ],
    analyze_spending: [
      "Вот анализ расходов за неделю:",
      "Куда ушли деньги? Туда же куда всегда — на всякую ерунду. Детальный разбор ниже:",
    ],
    manage_subscriptions: [
      "Вот твои активные подписки — есть что заморозить:",
      "Подписки плодятся как кролики. Хотя бы одну заморозь — буду горд:",
    ],
    find_in_mbank_catalog: [
      "Нашла похожий товар в MMarket — и дешевле! В следующий раз загляни туда сначала:",
      "500 С за лампу? Та же самая в MMarket стоит 350 С и доставка бесплатная. В следующий раз спроси меня ДО того, как достать кошелек:",
    ],
  };

  const pair = LINES[toolName];
  if (pair) return pair[toxic ? 1 : 0];
  return toxic
    ? "Сеть упала, но я не растерялся. Вот данные из кэша:"
    : "Нет соединения — использую кэшированные данные:";
}
