import { prisma } from "@/lib/prisma";
import { hashToken, nanoid } from "@/lib/utils";

export async function getTokens(applicationId: string) {
  const tokens = prisma.token.findMany({
    where: {
      applicationId,
    },
    select: {
      id: true,
      name: true,
      userId: true,
      partialKey: true,
      lastUsed: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: [{ lastUsed: "desc" }, { createdAt: "desc" }],
  });

  return tokens;
}

export async function createToken(name: string, userId: string, applicationId: string) {
  const token = `axs_${nanoid(24)}`;
  const hashedKey = await hashToken(token);
  const partialKey = `${token.slice(0, 3)}...${token.slice(-4)}`;

  await prisma.token.create({
    data: {
      name,
      hashedKey,
      partialKey,
      userId,
      applicationId,
      rateLimit: 60,
    },
  });

  return token;
}

export async function updateToken(name: string, tokenId: string, applicationId: string) {
  const token = await prisma.token.update({
    where: {
      id: tokenId,
      applicationId,
    },
    data: {
      name,
    },
    select: {
      id: true,
      name: true,
      partialKey: true,
      lastUsed: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  return token;
}

export async function deleteToken(tokenId: string, applicationId: string) {
  const token = await prisma.token.delete({
    where: {
      id: tokenId,
      applicationId,
    },
    select: {
      id: true,
    },
  });

  return token;
}

export async function deleteTokenByUserId(userId: string) {
  await prisma.token.deleteMany({
    where: {
      userId,
    },
  });
}

export async function getTokenByHashedKey(hashedKey: string) {
  const token = await prisma.token.findUnique({
    where: {
      hashedKey,
    },
    select: {
      id: true,
      rateLimit: true,
      applicationId: true,
      expires: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      application: {
        select: {
          id: true,
          name: true,
          type: true,
          workspaceId: true,
          published: true,
        },
      },
    },
  });

  return token;
}

export async function updateTokenLastUsed(hashedKey: string) {
  await prisma.token.update({
    where: {
      hashedKey,
    },
    data: {
      lastUsed: new Date(),
    },
  });
}
