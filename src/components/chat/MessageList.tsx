"use client";

import { useEffect, useRef } from "react";
import { UIMessage } from "ai";
import MessageBubble from "./MessageBubble";

type Props = { messages: UIMessage[] };

export default function MessageList({ messages }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) return null;

  return (
    <div className="px-4 pt-4 pb-2">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
