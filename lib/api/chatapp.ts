import { prisma } from "@/lib/prisma";
import type { CreateChatMessageProps, CreateChatProps, UpsertChatAppProps } from "@/lib/zod";
import { ApiError } from "./error";

export async function getChatApp(appId: string, createIfNotExists = false) {
  const app = await prisma.chatApp.findFirst({
    where: {
      applicationId: appId,
    },
  });

  if (!app) {
    if (createIfNotExists) {
      return await upsertChatApp(appId, {});
    } else {
      throw new ApiError({
        code: "not_found",
        message: "未找到聊天应用",
      });
    }
  }

  return app;
}

export async function upsertChatApp(applicationId: string, chatapp: UpsertChatAppProps) {
  const existingChatApp = await prisma.chatApp.findFirst({
    where: {
      applicationId,
    },
  });
  if (existingChatApp) {
    return prisma.chatApp.update({
      where: {
        id: existingChatApp.id,
        applicationId,
      },
      data: {
        ...chatapp,
      },
    });
  }

  return prisma.chatApp.create({
    data: {
      applicationId,
      ...chatapp,
    },
  });
}

export async function getChatsByClientId(appId: string, clientId: string) {
  const chatApp = await getChatApp(appId);

  return await prisma.chat.findMany({
    where: {
      chatAppId: chatApp.id,
      clientId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getChat(chatId: string, throwIfNotFound = true) {
  const chat = await prisma.chat.findUnique({
    where: {
      id: chatId,
    },
  });

  if (!chat && throwIfNotFound) {
    throw new ApiError({
      code: "not_found",
      message: "未找到聊天",
    });
  }

  return chat;
}

export async function createChat(chat: CreateChatProps) {
  return await prisma.chat.create({
    data: chat,
  });
}

export async function deleteChat(chatId: string) {
  const chat = await prisma.chat.delete({
    where: {
      id: chatId,
    },
    select: {
      id: true,
    },
  });

  return chat;
}

export async function createChatMessages(messages: CreateChatMessageProps[]) {
  return await prisma.message.createMany({
    data: messages,
  });
}

export async function getChatMessages(chatId: string) {
  return await prisma.message.findMany({
    where: {
      chatId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

export async function getChatVotes(chatId: string) {
  return await prisma.vote.findMany({
    where: {
      chatId,
    },
  });
}

export async function upsertChatVote(chatId: string, messageId: string, isUpvoted: boolean) {
  const existingVote = await prisma.vote.findFirst({
    where: {
      chatId,
      messageId,
    },
  });

  if (existingVote) {
    return await prisma.vote.update({
      where: {
        id: existingVote.id,
      },
      data: {
        isUpvoted,
      },
    });
  }

  return await prisma.vote.create({
    data: {
      chatId,
      messageId,
      isUpvoted,
    },
  });
}
