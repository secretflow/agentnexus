"use client";

import { Chat } from "@/components/chat";
import { convertToUIMessages } from "@/lib/ai";
import { useChatMessages } from "@/lib/swr";
import { useParams } from "next/navigation";

export default function ChatPage() {
  const { chatId } = useParams<{ appId: string; chatId: string }>();
  const { messages } = useChatMessages();

  return <Chat id={chatId} initialMessages={convertToUIMessages(messages || [])} />;
}
