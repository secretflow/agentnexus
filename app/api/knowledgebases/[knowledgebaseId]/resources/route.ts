import { generateEmbeddings } from "@/lib/ai";
import {
  ApiError,
  createEmbedding,
  getKnowledgebaseResources,
  responseData,
  returnErrorResponse,
  upsertKnowledgebaseResource,
} from "@/lib/api";
import { withKnowledgebase } from "@/lib/auth";
import { getEmbeddingModel } from "@/lib/model";
import { nanoid } from "@/lib/utils";
import { splitDocument } from "@/lib/utils/split-text";
import type { ModelProps } from "@/lib/zod";
import type { SplitConfigProps } from "@/lib/zod";

export const GET = withKnowledgebase(async ({ knowledgebase }) => {
  const resources = await getKnowledgebaseResources(knowledgebase.id);
  return responseData(resources);
});

export const POST = withKnowledgebase(async ({ req, knowledgebase }) => {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const fileType = formData.get("fileType") as string;
  const data = JSON.parse(formData.get("data") as string);

  const model = knowledgebase.model as ModelProps;
  const embeddingModel = getEmbeddingModel(model.provider, model.id);
  if (!embeddingModel) {
    return returnErrorResponse(
      new ApiError({
        code: "bad_request",
        message: "Empty embedding model",
      }),
    );
  }

  const resource = await upsertKnowledgebaseResource(knowledgebase.id, data);
  const splitConfigs = resource.splitConfigs as SplitConfigProps;

  const chunkedContent = await splitDocument(file, fileType, splitConfigs);
  const embeddings = await generateEmbeddings(
    chunkedContent.map((chunk) => chunk.pageContent),
    embeddingModel,
  );

  for (let i = 0; i < chunkedContent.length; i++) {
    const content = chunkedContent[i].pageContent;
    const embedding = embeddings[i];
    const id = nanoid(25).toLocaleLowerCase();
    await createEmbedding(id, resource.id, knowledgebase.id, content, embedding);
  }

  return responseData(resource);
});
