import { getMostRecentUserMessage, regularPrompt, sanitizeResponseMessages } from "@/lib/ai";
import { getLanguageModel } from "@/lib/model";
import { getAiTools } from "@/lib/tools";
import type { ChatConfigProps, ChatKnowledgebaseProps, ChatToolProps, ModelProps } from "@/lib/zod";
import { createAISDKTools } from "@agentic/ai-sdk";
import {
  type CoreAssistantMessage,
  type CoreToolMessage,
  type CoreUserMessage,
  type DataStreamWriter,
  type LanguageModelUsage,
  type LanguageModelV1,
  type Message,
  convertToCoreMessages,
  createDataStreamResponse,
  streamText,
} from "ai";

export async function createChatResponse({
  prompt,
  model,
  messages,
  knowledgebases,
  tools,
  config,
  beforeCreateChat,
  afterCreateChat,
}: {
  prompt: string | undefined;
  model: ModelProps | undefined;
  messages: Array<Message>;
  knowledgebases: ChatKnowledgebaseProps[] | undefined;
  tools: ChatToolProps[] | undefined;
  config: ChatConfigProps | undefined;
  beforeCreateChat?: (
    languageModel: LanguageModelV1,
    userMessage: CoreUserMessage,
  ) => Promise<void>;
  afterCreateChat?: (
    messages: Array<CoreAssistantMessage | CoreToolMessage>,
    usage: LanguageModelUsage,
    dataStream: DataStreamWriter,
  ) => Promise<void>;
}) {
  // prompt
  const systemPrompt = `${regularPrompt}\n\n${prompt}`;

  // model
  if (!model) {
    return new Response("请先为该应用配置模型", { status: 400 });
  }
  const languageModel = getLanguageModel(model.provider, model.id);
  if (!languageModel) {
    return new Response("模型未注册", { status: 400 });
  }

  // messages
  const coreMessages = convertToCoreMessages(messages);
  const userMessage = getMostRecentUserMessage(coreMessages);

  if (!userMessage) {
    return new Response("用户输入消息为空", { status: 400 });
  }

  // knowledgebases
  const knowledgebaseIds = knowledgebases?.filter((k) => k.enabled).map((k) => k.id) || [];

  // tools
  const toolIds = tools?.filter((t) => t.enabled).map((t) => t.id) || [];
  if (knowledgebaseIds.length > 0) {
    toolIds.push("knowledgeRetrieval");
  }
  const { tools: aiTools, activeTools } = getAiTools(toolIds, {
    model: languageModel,
    knowledgebaseIds,
    config,
  });

  // before create chat
  await beforeCreateChat?.(languageModel, userMessage);

  return createDataStreamResponse({
    execute(dataStream) {
      const result = streamText({
        model: languageModel,
        system: systemPrompt,
        messages: coreMessages,
        maxSteps: 5,
        experimental_activeTools: activeTools,
        tools: createAISDKTools(...aiTools),
        onFinish: async ({ response, usage }) => {
          await afterCreateChat?.(sanitizeResponseMessages(response.messages), usage, dataStream);
        },
        experimental_telemetry: {
          isEnabled: true,
          functionId: "stream-text",
        },
      });

      result.mergeIntoDataStream(dataStream);
    },
    onError(error) {
      if (error instanceof Error) {
        return error.message;
      }
      return "Unknown error";
    },
  });
}
