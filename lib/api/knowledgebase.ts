import { prisma } from "@/lib/prisma";
import type {
  CreateKnowledgebaseProps,
  CreateKnowledgebaseResourceProps,
  EmbeddingProps,
  UpdateKnowledgebaseResourceProps,
} from "@/lib/zod";
import { Prisma } from "@prisma/client";
import { ApiError } from "./error";

export async function getKnowledgebases(workspaceId: string) {
  return prisma.knowledgebase.findMany({
    where: {
      workspaceId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      image: true,
      model: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      knowledgebaseResources: {
        select: {
          id: true,
        },
      },
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getKnowledgebase(
  knowledgebaseId: string,
  workspaceId?: string,
  throwError = true,
) {
  const knowledgebase = await prisma.knowledgebase.findFirst({
    where: {
      workspaceId,
      id: knowledgebaseId,
    },
  });
  if (!knowledgebase && throwError) {
    throw new ApiError({
      code: "not_found",
      message: "未找到知识库",
    });
  }

  return knowledgebase;
}

export async function createKnowledgebase(
  userId: string,
  workspaceId: string,
  knowledgebase: CreateKnowledgebaseProps,
) {
  const existingKnowledgebase = await prisma.knowledgebase.findFirst({
    where: {
      workspaceId,
      name: knowledgebase.name,
    },
  });
  if (existingKnowledgebase) {
    throw new ApiError({
      code: "bad_request",
      message: "知识库名称已经存在",
    });
  }
  return prisma.knowledgebase.create({
    data: {
      userId,
      workspaceId,
      ...knowledgebase,
    },
  });
}

export async function deleteKnowledgebase(workspaceId: string, knowledgebaseId: string) {
  return prisma.knowledgebase.delete({
    where: {
      workspaceId,
      id: knowledgebaseId,
    },
  });
}

export async function getKnowledgebaseResourceOrThrow(knowledgebaseId: string, resourceId: string) {
  const resource = prisma.knowledgebaseResource.findFirst({
    where: {
      id: resourceId,
      knowledgebaseId: knowledgebaseId,
    },
    select: {
      id: true,
      knowledgebaseId: true,
      name: true,
      enabled: true,
      metadata: true,
      createdAt: true,
      updatedAt: true,
      embeddings: {
        select: {
          id: true,
          content: true,
        },
      },
    },
  });

  if (!resource) {
    throw new ApiError({
      code: "not_found",
      message: "未找到资源",
    });
  }

  return resource;
}

export async function getKnowledgebaseResources(knowledgebaseId: string) {
  return prisma.knowledgebaseResource.findMany({
    where: {
      knowledgebaseId: knowledgebaseId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function upsertKnowledgebaseResource(
  knowledgebaseId: string,
  resource: CreateKnowledgebaseResourceProps | UpdateKnowledgebaseResourceProps,
) {
  const { id, ...data } = resource as UpdateKnowledgebaseResourceProps;
  if (id) {
    const existingResource = await prisma.knowledgebaseResource.findFirst({
      where: {
        id,
        knowledgebaseId,
      },
    });
    if (existingResource) {
      return prisma.knowledgebaseResource.update({
        where: {
          id,
          knowledgebaseId,
        },
        data: {
          ...data,
        },
      });
    }
  }

  const existingSameName = await prisma.knowledgebaseResource.findFirst({
    where: {
      name: resource.name,
      knowledgebaseId,
    },
  });

  if (existingSameName) {
    throw new ApiError({
      code: "bad_request",
      message: "资源名称已经存在",
    });
  }

  return prisma.knowledgebaseResource.create({
    data: {
      knowledgebaseId,
      ...(resource as CreateKnowledgebaseResourceProps),
    },
  });
}

export async function deleteKnowledgebaseResource(knowledgebaseId: string, resourceId: string) {
  return prisma.knowledgebaseResource.delete({
    where: {
      id: resourceId,
      knowledgebaseId,
    },
  });
}

export async function createEmbedding(
  id: string,
  resourceId: string,
  knowledgebaseId: string,
  content: string,
  embedding: number[],
) {
  return await prisma.$executeRaw(
    Prisma.sql`INSERT INTO embeddings (id, resourceid, knowledgebaseid, content, embedding) VALUES (${id}, ${resourceId}, ${knowledgebaseId}, ${content}, ${embedding}::vector)`,
  );
}

export async function getEmbeddings(knowledgebaseId: string): Promise<EmbeddingProps[]> {
  // The lower-case resourceid and knowledgebaseid are used to resolve errors that occur when prisma is executed
  const embeddings = await prisma.$queryRaw<
    {
      id: string;
      resourceid: string;
      knowledgebaseid: string;
      content: string;
      embedding: string;
    }[]
  >`SELECT id, resourceid, knowledgebaseid, content, embedding::text FROM embeddings WHERE knowledgebaseid = ${knowledgebaseId}`;

  return embeddings.map(({ id, resourceid, knowledgebaseid, content, embedding }) => ({
    id,
    content,
    embedding,
    resourceId: resourceid,
    knowledgebaseId: knowledgebaseid,
  }));
}
