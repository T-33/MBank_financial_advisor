// /api/chat — streaming chat with tool calling.
// Vercel AI SDK v6 + DeepSeek deepseek-chat.
// Body: { messages: UIMessage[], personaId: "caring" | "toxic" }
// convertToModelMessages transforms UIMessage[] → ModelMessage[] for streamText.

import { streamText, stepCountIs, convertToModelMessages } from "ai";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { personas } from "@/lib/mockData";
import { tools } from "@/lib/tools";

const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export async function POST(req: Request) {
  const { messages, personaId } = await req.json();

  const persona = personas.find((p) => p.id === personaId) ?? personas[0];

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: deepseek("deepseek-chat"),
    system: persona.systemPrompt,
    messages: modelMessages,
    tools,
    toolChoice: "auto",
    stopWhen: stepCountIs(5),
  });

  return result.toUIMessageStreamResponse();
}
