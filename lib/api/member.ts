import { prisma } from "@/lib/prisma";
import { ApiError } from "./error";

export async function getWorkspaceMembers(workspaceId: string) {
  const workspace = await prisma.workspace.findFirst({
    where: {
      id: workspaceId,
    },
    select: {
      members: {
        select: {
          user: true,
        },
      },
    },
  });
  if (!workspace) {
    throw new ApiError({
      code: "not_found",
      message: "未找到工作空间",
    });
  }

  return workspace.members.map((member) => member.user);
}

export async function createWorkspaceMember(workspaceId: string, userId: string) {
  const member = await prisma.member.create({
    data: {
      workspaceId,
      userId,
    },
  });

  return member;
}

export async function deleteWorkspaceMember(workspaceId: string, userId: string) {
  const member = await prisma.member.delete({
    where: {
      userId_workspaceId: {
        workspaceId,
        userId,
      },
    },
  });

  return member;
}
