import { prisma } from "@/lib/prisma";
import type { UpsertWorkflowProps } from "@/lib/zod";
import { ApiError } from "./error";

export async function getWorkflow(applicationId: string) {
  const workflow = await prisma.workflow.findFirst({
    where: {
      applicationId,
    },
  });
  if (!workflow) {
    return await upsertWorkflow(applicationId, {
      content: {
        nodes: [],
        edges: [],
      },
    });
  }

  return workflow;
}

export async function upsertWorkflow(applicationId: string, workflow: UpsertWorkflowProps) {
  const existingWorkflow = await prisma.workflow.findFirst({
    where: {
      applicationId,
    },
  });
  if (existingWorkflow) {
    return prisma.workflow.update({
      where: {
        id: existingWorkflow.id,
        applicationId,
      },
      data: {
        ...workflow,
      },
    });
  }

  const { content } = workflow;
  if (!content) {
    throw new ApiError({
      code: "bad_request",
      message: "the content of workflow is required",
    });
  }

  return prisma.workflow.create({
    data: {
      applicationId,
      content: workflow.content!,
    },
  });
}
