import { getMostRecentUserMessage, regularPrompt } from "@/lib/ai";
import { withApplication } from "@/lib/auth";
import { getLanguageModel } from "@/lib/model";
import { getAiTools } from "@/lib/tools";
import type { ChatConfigProps, ChatKnowledgebaseProps, ChatToolProps, ModelProps } from "@/lib/zod";
import { createAISDKTools } from "@agentic/ai-sdk";
import { type Message, convertToCoreMessages, streamText } from "ai";

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

  // model is required
  if (!model) {
    return new Response("请先选择模型", { status: 400 });
  }
  const languageModel = getLanguageModel(model.provider, model.id);
  if (!languageModel) {
    return new Response("该模型未注册", { status: 400 });
  }

  // user message is required
  const coreMessages = convertToCoreMessages(messages);
  const userMessage = getMostRecentUserMessage(coreMessages);
  if (!userMessage) {
    return new Response("No user message found", { status: 400 });
  }

  // knowledgebases
  const knowledgebaseIds =
    knowledgebases
      ?.filter((knowledgebase) => knowledgebase.enabled)
      .map((knowledgebase) => knowledgebase.id) || [];

  // tools
  const toolIds = tools?.filter((tool) => tool.enabled).map((tool) => tool.id) || [];
  if (knowledgebaseIds.length > 0) {
    toolIds.push("knowledgeRetrieval");
  }
  const { tools: aiTools, activeTools } = getAiTools(toolIds, {
    model: languageModel,
    knowledgebaseIds,
    config,
  });

  // prompt
  const systemPrompt = `${regularPrompt}\n\n${prompt}`;

  try {
    const result = streamText({
      model: languageModel,
      system: systemPrompt,
      messages: coreMessages,
      maxSteps: 5,
      experimental_activeTools: activeTools,
      tools: createAISDKTools(...aiTools),
      experimental_telemetry: {
        isEnabled: true,
        functionId: "stream-text",
      },
    });

    return result.toDataStreamResponse({
      getErrorMessage: (error) => {
        if (error instanceof Error) {
          return error.message;
        }
        return "Unknown error";
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }
  }

  return new Response("Unknown error", { status: 500 });
});
