import { deleteKnowledgebase, responseData } from "@/lib/api";
import { withKnowledgebase } from "@/lib/auth";

export const GET = withKnowledgebase(async ({ knowledgebase }) => {
  return responseData(knowledgebase);
});

export const DELETE = withKnowledgebase(async ({ knowledgebase }) => {
  const data = await deleteKnowledgebase(knowledgebase.workspaceId, knowledgebase.id);
  return responseData(data);
});
