import { prisma } from "@/lib/prisma";
import type { UpdateUserProps } from "@/lib/zod";
import { ApiError } from "./error";

export async function getUserOrThrow(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new ApiError({
      code: "not_found",
      message: "用户不存在",
    });
  }

  return user;
}

export async function updateUser(userId: string, userInfo: UpdateUserProps) {
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      ...userInfo,
    },
  });

  return user;
}

export async function deleteUser(userId: string) {
  const workspaces = await prisma.workspace.findMany({
    where: {
      userId,
    },
  });

  if (workspaces.length > 0) {
    throw new ApiError({
      code: "forbidden",
      message: "当前账号下还有工作空间，请先删除所有工作空间后再注销账号！",
    });
  }

  return prisma.user.delete({
    where: {
      id: userId,
    },
  });
}
