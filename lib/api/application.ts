import { prisma } from "@/lib/prisma";
import type { CreateApplicationProps, UpdateApplicationProps } from "@/lib/zod";
import { ApiError } from "./error";

export async function getApplications(workspaceId: string) {
  return prisma.application.findMany({
    where: {
      workspaceId,
    },
    select: {
      id: true,
      name: true,
      type: true,
      description: true,
      published: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getApplicationOrThrow(applicationId: string) {
  const application = await prisma.application.findUnique({
    where: {
      id: applicationId,
    },
  });
  if (!application) {
    throw new ApiError({
      code: "not_found",
      message: "未找到应用",
    });
  }

  return application;
}

export async function createApplication(
  userId: string,
  workspaceId: string,
  application: CreateApplicationProps,
) {
  const existingApplication = await prisma.application.findFirst({
    where: {
      workspaceId,
      name: application.name,
    },
  });
  if (existingApplication) {
    throw new ApiError({
      code: "bad_request",
      message: "应用名称已经存在",
    });
  }
  return prisma.application.create({
    data: {
      userId,
      workspaceId,
      ...application,
    },
  });
}

export async function updateApplication(
  workspaceId: string,
  applicationId: string,
  data: UpdateApplicationProps,
) {
  return prisma.application.update({
    where: {
      id: applicationId,
      workspaceId,
    },
    data,
  });
}

export async function deleteApplication(workspaceId: string, applicationId: string) {
  return prisma.application.delete({
    where: {
      id: applicationId,
      workspaceId,
    },
  });
}
