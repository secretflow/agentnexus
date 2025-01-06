import { createChatResponse } from "@/lib/ai";
import { withApplication } from "@/lib/auth";
import type { ChatConfigProps, ChatKnowledgebaseProps, ChatToolProps, ModelProps } from "@/lib/zod";
import type { Message } from "ai";

export const maxDuration = 120;

export const POST = withApplication(async ({ req }) => {
  const {
    model,
    prompt,
    tools,
    knowledgebases,
    config,
    messages,
  }: {
    model: ModelProps | undefined;
    prompt: string | undefined;
    tools: ChatToolProps[] | undefined;
    knowledgebases: ChatKnowledgebaseProps[] | undefined;
    config: ChatConfigProps | undefined;
    messages: Array<Message>;
  } = await req.json();

  try {
    return createChatResponse({
      prompt,
      model,
      messages,
      knowledgebases,
      tools,
      config,
    });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }
  }

  return new Response("Unknown error", { status: 500 });
});
