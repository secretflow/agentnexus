"use client";
import { CHAT_API_KEY } from "@/lib/constants";
import { useLocalStorage } from "@/lib/hooks";
import { useChatApp, useChatVotes } from "@/lib/swr";
import type { Attachment, Message } from "ai";
import { useChat } from "ai/react";
import { useState } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import { ChatHeader } from "./chat-header";
import { Messages } from "./messages";
import { MultimodalInput } from "./multimodal-input";

export function Chat({
  id,
  initialMessages,
}: {
  id: string;
  initialMessages: Array<Message>;
}) {
  const { chatApp } = useChatApp();
  const appId = chatApp?.applicationId!;

  const { mutate } = useSWRConfig();
  const { votes } = useChatVotes();

  const [apiKey] = useLocalStorage<string>(CHAT_API_KEY, "");
  const { messages, setMessages, handleSubmit, input, setInput, append, isLoading, stop } = useChat(
    {
      api: `/api/apps/${appId}/chats/${id}`,
      body: { id },
      headers: { Authorization: `Bearer ${apiKey}` },
      initialMessages,
      experimental_throttle: 100,
      onFinish: () => {
        mutate(`/api/apps/${appId}/chats`);
      },
      onError: (error) => {
        if (error instanceof Error) {
          toast.error(error.message);
          // Remove the last message if it is an error message
          // Is there a better way to interact?
          setMessages(messages);
        }
      },
    },
  );

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);

  if (!chatApp) {
    return null;
  }

  return (
    <div className="flex h-dvh min-w-0 flex-col bg-background">
      <ChatHeader model={chatApp.model} appId={appId} />
      <Messages
        appId={appId}
        chatId={id}
        isLoading={isLoading}
        votes={votes}
        messages={messages}
        showOverview
        showActionButton
      />
      <form className="mx-auto flex w-full gap-2 bg-background px-4 pb-4 md:max-w-3xl md:pb-6">
        <MultimodalInput
          appId={appId}
          chatId={id}
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          stop={stop}
          attachments={attachments}
          setAttachments={setAttachments}
          messages={messages}
          setMessages={setMessages}
          append={append}
        />
      </form>
    </div>
  );
}
