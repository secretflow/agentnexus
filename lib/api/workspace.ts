import { prisma } from "@/lib/prisma";
import { nanoid } from "@/lib/utils";
import type { CreateWorkspaceProps, UpdateWrorkspaceProps } from "@/lib/zod";
import { ApiError } from "./error";

export async function getWorkspaces(userId: string) {
  return prisma.workspace.findMany({
    where: {
      OR: [{ userId }, { members: { some: { userId } } }],
    },
    select: {
      id: true,
      name: true,
      image: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      applications: {
        select: {
          id: true,
        },
      },
      knowledgebases: {
        select: {
          id: true,
        },
      },
      members: {
        select: {
          userId: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getWorkspaceOrThrow(userId: string, workspaceId: string) {
  const workspace = await prisma.workspace.findFirst({
    where: {
      id: workspaceId,
      OR: [{ userId }, { members: { some: { userId } } }],
    },
    select: {
      id: true,
      name: true,
      image: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
      inviteCode: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      applications: {
        select: {
          id: true,
        },
      },
      knowledgebases: {
        select: {
          id: true,
        },
      },
      members: {
        select: {
          userId: true,
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
  return workspace;
}

export async function getWorkspaceByInviteCode(inviteCode: string) {
  const workspace = await prisma.workspace.findUnique({
    where: {
      inviteCode,
    },
    select: {
      id: true,
      userId: true,
      members: {
        select: {
          userId: true,
        },
      },
    },
  });

  return workspace;
}

export async function createWorkspace(userId: string, workspace: CreateWorkspaceProps) {
  const existingWorkspace = await prisma.workspace.findFirst({
    where: {
      userId,
      name: workspace.name,
    },
  });
  if (existingWorkspace) {
    throw new ApiError({
      code: "bad_request",
      message: "工作空间名称已经存在",
    });
  }
  return prisma.workspace.create({
    data: {
      userId,
      ...workspace,
      inviteCode: nanoid(24),
    },
  });
}

export async function updateWorkspace(workspaceId: string, data: UpdateWrorkspaceProps) {
  return prisma.workspace.update({
    where: {
      id: workspaceId,
    },
    data,
  });
}

export async function deleteWorksapce(workspaceId: string, userId: string) {
  // only the owner can delete the workspace
  const workspace = await prisma.workspace.findUnique({
    where: {
      id: workspaceId,
      userId,
    },
  });

  if (!workspace) {
    throw new ApiError({
      code: "not_found",
      message: "仅工作空间所有者可删除工作空间。",
    });
  }

  return prisma.workspace.delete({
    where: {
      id: workspace.id,
    },
  });
}
