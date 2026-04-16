// /api/chat — streaming chat with tool calling.
// Vercel AI SDK v6 + DeepSeek deepseek-chat.
// Body: { messages: UIMessage[], personaId: "caring" | "toxic" }
// convertToModelMessages transforms UIMessage[] → ModelMessage[] for streamText.
// Falls back to pre-computed offline responses when DeepSeek is unreachable.

import {
  streamText,
  stepCountIs,
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
} from "ai";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { personas, subscriptions, type PersonaId } from "@/lib/mockData";
import { tools } from "@/lib/tools";
import { serverFrozenSubIds } from "@/lib/subscriptionState";
import {
  detectFallbackTool,
  getFallbackOutput,
  getFallbackText,
} from "@/lib/fallbackResponses";

const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY ?? "",
});

// ── Offline fallback ──────────────────────────────────────────────────────────

type RawPart = { type: string; text?: string };
type RawMessage = { role: string; content?: unknown; parts?: RawPart[] };

function extractText(msg: RawMessage): string {
  // UIMessage v6: text lives in parts[].text
  if (Array.isArray(msg.parts)) {
    const t = msg.parts
      .filter((p) => p.type === "text")
      .map((p) => p.text ?? "")
      .join(" ")
      .trim();
    if (t) return t;
  }
  // Legacy / content-string fallback
  if (typeof msg.content === "string") return msg.content;
  if (Array.isArray(msg.content)) {
    return (msg.content as RawPart[])
      .filter((p) => p.type === "text")
      .map((p) => p.text ?? "")
      .join(" ")
      .trim();
  }
  return "";
}

function buildFallbackResponse(
  messages: RawMessage[],
  personaId: string
): Response {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const text = lastUser ? extractText(lastUser) : "";

  const toolName = detectFallbackTool(text);
  const output = getFallbackOutput(toolName);
  const reply = getFallbackText(
    toolName,
    (personaId as PersonaId) === "toxic" ? "toxic" : "caring"
  );
  const callId = "fallback-1";

  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      writer.write({ type: "start" });
      writer.write({ type: "start-step" });
      // dynamic: true tells the client to render via DynamicToolUIPart
      writer.write({
        type: "tool-input-start",
        toolCallId: callId,
        toolName,
        dynamic: true,
      });
      writer.write({
        type: "tool-input-available",
        toolCallId: callId,
        toolName,
        input: {},
        dynamic: true,
      });
      writer.write({
        type: "tool-output-available",
        toolCallId: callId,
        output,
      });
      writer.write({ type: "finish-step" });
      writer.write({ type: "text-start", id: "ft1" });
      writer.write({ type: "text-delta", id: "ft1", delta: reply });
      writer.write({ type: "text-end", id: "ft1" });
      writer.write({ type: "finish", finishReason: "stop" });
    },
  });

  return createUIMessageStreamResponse({ stream });
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  let messages: RawMessage[];
  let personaId: string;

  try {
    const body = await req.json();
    messages = body.messages ?? [];
    personaId = body.personaId ?? "caring";
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const persona = personas.find((p) => p.id === personaId) ?? personas[0];

  // Allow forcing offline mode via env flag (useful for demo/pitch)
  if (process.env.OFFLINE_MODE === "true") {
    return buildFallbackResponse(messages, personaId);
  }

  // Build dynamic frozen-state context so the LLM knows current state
  // even if it doesn't re-call the tool (responds from conversation history).
  const frozenNames = Array.from(serverFrozenSubIds)
    .map((id) => subscriptions.find((s) => s.id === id)?.name)
    .filter(Boolean)
    .join(", ");
  const frozenCtx =
    frozenNames.length > 0
      ? `\n\n[АКТУАЛЬНОЕ СОСТОЯНИЕ ПОДПИСОК]: Пользователь заморозил через интерфейс: ${frozenNames}. Это точные данные — никогда не говори что "все подписки активны". Если спрашивают о подписках — ОБЯЗАТЕЛЬНО вызови manage_subscriptions чтобы получить свежий список.`
      : `\n\n[АКТУАЛЬНОЕ СОСТОЯНИЕ ПОДПИСОК]: Все подписки активны (ни одна не заморожена).`;
  const systemWithContext = persona.systemPrompt + frozenCtx;

  try {
    const modelMessages = await convertToModelMessages(messages as Parameters<typeof convertToModelMessages>[0]);

    const result = streamText({
      model: deepseek("deepseek-chat"),
      system: systemWithContext,
      messages: modelMessages,
      tools,
      toolChoice: "auto",
      stopWhen: stepCountIs(5),
    });

    return result.toUIMessageStreamResponse();
  } catch {
    // Network error, quota exceeded, or key missing → serve from cache
    return buildFallbackResponse(messages, personaId);
  }
}
