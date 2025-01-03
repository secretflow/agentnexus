import {
  generateTitleFromUserMessage,
  getMostRecentUserMessage,
  regularPrompt,
  sanitizeResponseMessages,
} from "@/lib/ai";
import {
  createChat,
  createChatMessages,
  deleteChat,
  getChat,
  getChatApp,
  responseData,
} from "@/lib/api";
import { withApiKey } from "@/lib/auth";
import { getLanguageModel } from "@/lib/model";
import { recordChat, recordMessages } from "@/lib/tinybird";
import { getAiTools } from "@/lib/tools";
import { uuid } from "@/lib/utils";
import type { ChatAppProps } from "@/lib/zod";
import { createAISDKTools } from "@agentic/ai-sdk";
import { type Message, convertToCoreMessages, createDataStreamResponse, streamText } from "ai";

export const GET = withApiKey(async ({ params }) => {
  const { chatId } = params;
  const chat = await getChat(chatId);
  return responseData(chat);
});

export const POST = withApiKey(async ({ req, params, token }) => {
  const { appId } = params;
  const chatApp = (await getChatApp(appId)) as ChatAppProps;
  const { model, tool, prompt, knowledgebase } = chatApp;

  const {
    id,
    messages,
  }: {
    id: string;
    messages: Array<Message>;
  } = await req.json();

  // model
  if (!model) {
    return new Response("该应用未配置模型", { status: 400 });
  }
  const languageModel = getLanguageModel(model.provider, model.id);
  if (!languageModel) {
    return new Response("该应用配置的模型未注册", { status: 400 });
  }

  // messages
  const coreMessages = convertToCoreMessages(messages);
  const userMessage = getMostRecentUserMessage(coreMessages);

  if (!userMessage) {
    return new Response("No user message found", { status: 400 });
  }

  // knowledgebases
  const knowledgebaseIds = knowledgebase?.filter((k) => k.enabled).map((k) => k.id) || [];

  // tools
  const toolIds = tool?.filter((t) => t.enabled).map((t) => t.id) || [];
  if (knowledgebaseIds.length > 0) {
    toolIds.push("knowledgeRetrieval");
  }
  const { tools: aiTools, activeTools } = getAiTools(toolIds, {
    model: languageModel,
    knowledgebaseIds,
    config: chatApp.config,
  });

  // prompt
  const systemPrompt = `${regularPrompt}\n\n${prompt}`;

  // chat
  const chat = await getChat(id, false);
  if (!chat) {
    const title = await generateTitleFromUserMessage({
      model: languageModel,
      message: userMessage,
    });
    await createChat({ id, title, chatAppId: chatApp.id, clientId: token.id });

    recordChat({
      req,
      appId,
      chatId: id,
      clientId: token.id,
    });
  }

  const messageId = uuid();
  await createChatMessages([{ ...userMessage, id: messageId, chatId: id }]);
  recordMessages(req, [
    {
      appId,
      clientId: token.id,
      chatId: id,
      messageId,
      role: "user",
    },
  ]);

  // request
  try {
    return createDataStreamResponse({
      execute(dataStream) {
        const result = streamText({
          model: languageModel,
          system: systemPrompt,
          messages: coreMessages,
          maxSteps: 5,
          experimental_activeTools: activeTools,
          tools: createAISDKTools(...aiTools),
          onFinish: async ({ response }) => {
            const responseMessagesWithoutIncompleteToolCalls = sanitizeResponseMessages(
              response.messages,
            );

            const messages = responseMessagesWithoutIncompleteToolCalls.map((message) => {
              const messageId = uuid();

              if (message.role === "assistant") {
                dataStream.writeMessageAnnotation({
                  messageIdFromServer: messageId,
                });
              }
              return {
                id: messageId,
                chatId: id,
                role: message.role,
                content: message.content,
              };
            });
            await createChatMessages(messages);

            recordMessages(
              req,
              messages.map(({ id, chatId, role }) => {
                return { appId, clientId: token.id, chatId, messageId: id, role };
              }),
            );
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
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }
  }

  return new Response("Unknown error", { status: 500 });
});

export const DELETE = withApiKey(async ({ params }) => {
  const { chatId } = params;
  const chat = await deleteChat(chatId);
  return responseData(chat);
});
