import {
  deleteKnowledgebaseResource,
  getKnowledgebaseResourceOrThrow,
  parseRequestBody,
  responseData,
  upsertKnowledgebaseResource,
} from "@/lib/api";
import { withKnowledgebase } from "@/lib/auth";
import { UpdateKnowledgebaseResourceSchema } from "@/lib/zod";

export const GET = withKnowledgebase(async ({ knowledgebase, params }) => {
  const resource = await getKnowledgebaseResourceOrThrow(knowledgebase.id, params.resourceId);
  return responseData(resource);
});

export const DELETE = withKnowledgebase(async ({ knowledgebase, params }) => {
  const resource = await deleteKnowledgebaseResource(knowledgebase.id, params.resourceId);
  return responseData(resource);
});

export const PATCH = withKnowledgebase(async ({ req, knowledgebase }) => {
  const body = await parseRequestBody(req);
  const data = UpdateKnowledgebaseResourceSchema.parse(body);
  const resource = await upsertKnowledgebaseResource(knowledgebase.id, data);
  return responseData(resource);
});
