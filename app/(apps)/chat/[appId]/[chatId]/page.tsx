"use client";

import { Chat as PreviewChat } from "@/components/chat";
import { convertToUIMessages } from "@/lib/ai";
import { useChatMessages } from "@/lib/swr";
import { useParams } from "next/navigation";

export default function ChatPage() {
  const { chatId } = useParams<{ appId: string; chatId: string }>();
  const { messages } = useChatMessages();

  return <PreviewChat id={chatId} initialMessages={convertToUIMessages(messages || [])} />;
}
