import { createChatResponse, generateTitleFromUserMessage } from "@/lib/ai";
import {
  createChat,
  createChatMessages,
  deleteChat,
  getChat,
  getChatApp,
  responseData,
} from "@/lib/api";
import { withApiKey } from "@/lib/auth";
import { recordChat, recordMessages } from "@/lib/tinybird";
import { uuid } from "@/lib/utils";
import type { ChatAppProps } from "@/lib/zod";
import type { Message } from "ai";

export const GET = withApiKey(async ({ params }) => {
  const { chatId } = params;
  const chat = await getChat(chatId);
  return responseData(chat);
});

export const POST = withApiKey(async ({ req, params, token }) => {
  const { appId } = params;
  const chatApp = (await getChatApp(appId)) as ChatAppProps;
  const { model, tools, prompt, knowledgebases, config } = chatApp;

  const {
    id,
    messages,
  }: {
    id: string;
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
      beforeCreateChat: async (languageModel, userMessage) => {
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
      },
      afterCreateChat: async (messages, dataStream) => {
        const chatMessages = messages.map((message) => {
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
        await createChatMessages(chatMessages);

        recordMessages(
          req,
          chatMessages.map(({ id, chatId, role }) => {
            return { appId, clientId: token.id, chatId, messageId: id, role };
          }),
        );
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
