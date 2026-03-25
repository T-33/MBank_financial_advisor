import Anthropic from "@anthropic-ai/sdk";
import { user, bills, spendingByCategory, savingsGoals } from "@/lib/mock-data";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const systemPrompt = `You are a smart financial advisor for MBank, a Kyrgyz digital bank. You have full access to the user's financial data.

USER PROFILE:
- Name: ${user.name}
- Monthly income: ${user.monthlyIncome.toLocaleString()} KGS
- Current balance: ${user.balance.toLocaleString()} KGS

UPCOMING BILLS:
${bills.map((b) => `- ${b.name}: ${b.amount.toLocaleString()} KGS, due ${b.dueDate} (${b.status})`).join("\n")}

SPENDING THIS MONTH (by category):
${spendingByCategory.map((c) => `- ${c.category}: ${c.amount.toLocaleString()} KGS (${c.percent}% of spending)`).join("\n")}

SAVINGS GOALS:
${savingsGoals.map((g) => `- ${g.name}: saved ${g.savedAmount.toLocaleString()} / ${g.targetAmount.toLocaleString()} KGS, deadline ${g.deadline}`).join("\n")}

MBANK FEATURES NOT YET ACTIVATED:
- mInvest: invest in government bonds, ~10% annual return
- Auto-Pay: automatic utility bill payments
- Cashback Card: 1.5% cashback on all purchases

Instructions:
- Be concise and practical. Give specific numbers.
- Respond in the same language the user writes in (Russian or English).
- If they ask in Russian, answer in Russian.
- Reference their actual data (bills, spending, balance) when relevant.
- If they ask about mInvest or other MBank features, explain the benefits and encourage activation.
- Currency is KGS (Kyrgyzstani Som).`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages.map((m: { role: string; content: string }) => ({
      role: m.role,
      content: m.content,
    })),
  });

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === "content_block_delta" &&
          chunk.delta.type === "text_delta"
        ) {
          controller.enqueue(new TextEncoder().encode(chunk.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
