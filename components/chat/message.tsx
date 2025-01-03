"use client";

import { SparklesIcon } from "@/components/icons";
import { TOOL_ATTRS } from "@/lib/constants";
import type { VoteProps } from "@/lib/zod";
import type { Message } from "ai";
import equal from "fast-deep-equal";
import { motion } from "framer-motion";
import { memo } from "react";
import { Firecrawl, KnowledgeRetrieval, PythonConsole, Weather, WebSearch } from "./cards";
import { Markdown } from "./markdown";
import { MessageActions } from "./message-actions";
import { PreviewAttachment } from "./preview-attachment";

const PurePreviewMessage = ({
  appId,
  chatId,
  message,
  isLoading,
  vote,
  showActionButton,
}: {
  appId: string;
  chatId: string;
  message: Message;
  isLoading: boolean;
  vote: VoteProps | undefined;
  showActionButton?: boolean;
}) => {
  return (
    <motion.div
      className="group/message mx-auto w-full max-w-3xl px-4"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      data-role={message.role}
    >
      <div className="flex w-full gap-4 rounded-xl group-data-[role=user]/message:ml-auto group-data-[role=user]/message:w-fit group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:bg-primary group-data-[role=user]/message:px-3 group-data-[role=user]/message:py-2 group-data-[role=user]/message:text-primary-foreground">
        {message.role === "assistant" && (
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full ring-1 ring-border">
            <SparklesIcon size={14} />
          </div>
        )}

        <div className="flex w-full flex-col gap-2">
          {message.content && (
            <div className="flex flex-col gap-4">
              <Markdown>{message.content as string}</Markdown>
            </div>
          )}

          {message.toolInvocations && message.toolInvocations.length > 0 && (
            <div className="flex flex-col gap-4">
              {message.toolInvocations.map((toolInvocation) => {
                const { toolName, toolCallId, state, args } = toolInvocation;

                if (state === "result") {
                  const { result } = toolInvocation;

                  return (
                    <div key={toolCallId}>
                      {toolName === TOOL_ATTRS.weather.toolName ? (
                        <Weather weatherAtLocation={result} args={args} />
                      ) : toolName === TOOL_ATTRS.executePython.toolName ? (
                        <PythonConsole result={result} args={args} />
                      ) : toolName === TOOL_ATTRS.knowledgeRetrieval.toolName ? (
                        <KnowledgeRetrieval result={result} args={args} />
                      ) : toolName === TOOL_ATTRS.webSearch.toolName ? (
                        <WebSearch result={result} args={args} />
                      ) : toolName === TOOL_ATTRS.firecrawl.toolName ? (
                        <Firecrawl result={result} args={args} />
                      ) : (
                        <pre>{JSON.stringify(result, null, 2)}</pre>
                      )}
                    </div>
                  );
                } else {
                  return (
                    <div key={toolCallId}>
                      {toolName === TOOL_ATTRS.weather.toolName ? (
                        <Weather loading args={args} />
                      ) : toolName === TOOL_ATTRS.executePython.toolName ? (
                        <PythonConsole loading args={args} />
                      ) : toolName === TOOL_ATTRS.knowledgeRetrieval.toolName ? (
                        <KnowledgeRetrieval loading args={args} />
                      ) : toolName === TOOL_ATTRS.webSearch.toolName ? (
                        <WebSearch loading args={args} />
                      ) : toolName === TOOL_ATTRS.firecrawl.toolName ? (
                        <Firecrawl loading args={args} />
                      ) : null}
                    </div>
                  );
                }
              })}
            </div>
          )}

          {message.experimental_attachments && (
            <div className="flex flex-row gap-2">
              {message.experimental_attachments.map((attachment) => (
                <PreviewAttachment key={attachment.url} attachment={attachment} />
              ))}
            </div>
          )}

          {showActionButton && (
            <MessageActions
              key={`action-${message.id}`}
              appId={appId}
              chatId={chatId}
              message={message}
              vote={vote}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const PreviewMessage = memo(PurePreviewMessage, (prevProps, nextProps) => {
  if (prevProps.isLoading !== nextProps.isLoading) return false;
  if (prevProps.isLoading && nextProps.isLoading) return false;
  if (!equal(prevProps.vote, nextProps.vote)) return false;
  return true;
});

export const ThinkingMessage = () => {
  const role = "assistant";

  return (
    <motion.div
      className="group/message mx-auto w-full max-w-3xl px-4 "
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
      data-role={role}
    >
      <div className="flex w-full gap-4 rounded-xl group-data-[role=user]/message:ml-auto group-data-[role=user]/message:w-fit group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:bg-muted group-data-[role=user]/message:px-3 group-data-[role=user]/message:py-2">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full ring-1 ring-border">
          <SparklesIcon size={14} />
        </div>

        <div className="flex w-full flex-col gap-2">
          <div className="flex flex-col gap-4 text-muted-foreground">思考...</div>
        </div>
      </div>
    </motion.div>
  );
};
