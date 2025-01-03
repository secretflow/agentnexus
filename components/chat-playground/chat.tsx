"use client";

import { Messages, MultimodalInput } from "@/components/chat";
import { Tooltip } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { ChatConfigProps, ChatKnowledgebaseProps, ChatToolProps, ModelProps } from "@/lib/zod";
import type { Attachment, Message } from "ai";
import { useChat } from "ai/react";
import { RefreshCw } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function Chat({
  model,
  prompt,
  tools,
  knowledgebases,
  config,
  initialMessages,
}: {
  model: ModelProps | undefined;
  prompt: string | undefined;
  tools: ChatToolProps[] | undefined;
  knowledgebases: ChatKnowledgebaseProps[] | undefined;
  config: ChatConfigProps | undefined;
  initialMessages: Array<Message>;
}) {
  const { applicationId, workspaceId } = useParams<{
    applicationId: string;
    workspaceId: string;
  }>();
  const { messages, setMessages, handleSubmit, input, setInput, append, isLoading, stop } = useChat(
    {
      api: `/api/applications/${applicationId}/chatapp/chat?workspaceId=${workspaceId}`,
      body: { model, prompt, tools, knowledgebases, config },
      initialMessages,
      onError: (error) => {
        if (error instanceof Error) {
          toast.error(error.message);
          // Remove the last message if it is an error message
          // Is there a better way to interact
          setMessages(messages);
        }
      },
    },
  );

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);

  return (
    <div className="flex h-full min-w-0 flex-col rounded-lg bg-background">
      <div className="flex justify-between px-3 pt-3">
        <div className="font-medium">调试</div>
        <Tooltip content="重新开始会话">
          <RefreshCw
            className={cn(
              "size-5 cursor-pointer text-gray-600 transition-transform duration-700 ease-in-out hover:rotate-180",
              {
                "cursor-not-allowed": isLoading,
                "text-gray-400": isLoading,
              },
            )}
            onClick={() => {
              if (!isLoading) {
                setMessages([]);
              }
            }}
          />
        </Tooltip>
      </div>
      <Messages
        appId=""
        chatId=""
        messages={messages}
        votes={undefined}
        isLoading={isLoading}
        showActionButton={false}
      />
      <form className="mx-auto flex w-full gap-2 rounded-lg bg-background px-4 pb-4 md:max-w-3xl md:pb-6">
        <MultimodalInput
          appId=""
          chatId=""
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
