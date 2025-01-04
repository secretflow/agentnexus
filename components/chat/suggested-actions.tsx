"use client";

import { Button } from "@/components/ui";
import type { ChatRequestOptions, CreateMessage, Message } from "ai";
import { motion } from "framer-motion";
import { memo } from "react";

interface SuggestedActionsProps {
  appId: string;
  chatId: string;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
}

function PureSuggestedActions({ appId, chatId, append }: SuggestedActionsProps) {
  const suggestedActions = [
    {
      title: "What is the weather",
      label: "in Hangzhou?",
      action: "What is the weather in Hangzhou?",
    },
    {
      title: "Execute the following python code",
      label: "random.randint(1, 10)",
      action: "Execute the following python code: random.randint(1, 10)",
    },
  ];

  return (
    <div className="grid w-full gap-2 sm:grid-cols-2">
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className={index > 1 ? "hidden sm:block" : "block"}
        >
          <Button
            text={
              <div className="flex items-start gap-1 sm:flex-col">
                <span className="font-medium">{suggestedAction.title}</span>
                <span className="text-muted-foreground">{suggestedAction.label}</span>
              </div>
            }
            variant="secondary"
            onClick={async () => {
              if (appId && chatId) {
                window.history.replaceState({}, "", `/chat/${appId}/${chatId}`);
              }

              append({
                role: "user",
                content: suggestedAction.action,
              });
            }}
            className="h-auto w-full justify-start rounded-xl px-4 py-3.5"
          />
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(PureSuggestedActions, () => true);
