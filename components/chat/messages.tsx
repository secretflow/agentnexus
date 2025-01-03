import { useScrollToBottom } from "@/lib/hooks";
import type { VoteProps } from "@/lib/zod";
import type { Message } from "ai";
import equal from "fast-deep-equal";
import { memo } from "react";
import { PreviewMessage, ThinkingMessage } from "./message";
import { Overview } from "./overview";

interface MessagesProps {
  appId: string;
  chatId: string;
  isLoading: boolean;
  votes: Array<VoteProps> | undefined;
  messages: Array<Message>;
  showOverview?: boolean;
  showActionButton?: boolean;
}

function PureMessages({
  appId,
  chatId,
  isLoading,
  votes,
  messages,
  showOverview,
  showActionButton,
}: MessagesProps) {
  const [messagesContainerRef, messagesEndRef] = useScrollToBottom<HTMLDivElement>();

  return (
    <div
      ref={messagesContainerRef}
      className="flex min-w-0 flex-1 flex-col gap-6 overflow-y-auto pt-4"
    >
      {messages.length === 0 && showOverview && <Overview />}

      {messages.map((message, index) => (
        <PreviewMessage
          key={message.id}
          appId={appId}
          chatId={chatId}
          message={message}
          isLoading={isLoading && messages.length - 1 === index}
          vote={votes ? votes.find((vote) => vote.messageId === message.id) : undefined}
          showActionButton={showActionButton}
        />
      ))}

      {isLoading && messages.length > 0 && messages[messages.length - 1].role === "user" && (
        <ThinkingMessage />
      )}

      <div ref={messagesEndRef} className="min-h-[24px] min-w-[24px] shrink-0" />
    </div>
  );
}

export const Messages = memo(PureMessages, (prevProps, nextProps) => {
  if (prevProps.isLoading !== nextProps.isLoading) return false;
  if (prevProps.isLoading && nextProps.isLoading) return false;
  if (prevProps.messages.length !== nextProps.messages.length) return false;
  if (!equal(prevProps.votes, nextProps.votes)) return false;

  return true;
});
