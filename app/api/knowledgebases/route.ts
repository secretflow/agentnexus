import { createKnowledgebase, getKnowledgebases, parseRequestBody, responseData } from "@/lib/api";
import { withWorkspace } from "@/lib/auth";
import { CreateKnowledgebaseSchema } from "@/lib/zod";

export const GET = withWorkspace(async ({ workspace }) => {
  const knowledgebases = await getKnowledgebases(workspace.id);
  return responseData(knowledgebases);
});

export const POST = withWorkspace(async ({ req, workspace, user }) => {
  const body = await parseRequestBody(req);
  const data = CreateKnowledgebaseSchema.parse(body);
  const knowledgebase = await createKnowledgebase(user.id, workspace.id, data);
  return responseData(knowledgebase);
});
