import { createWorkspace, getWorkspaces, parseRequestBody, responseData } from "@/lib/api";
import { withSession } from "@/lib/auth";
import { CreateWorkspaceSchema } from "@/lib/zod";

export const GET = withSession(async ({ user }) => {
  const workspaces = await getWorkspaces(user.id);
  return responseData(
    workspaces.map((workspace) => ({ ...workspace, isOwner: workspace.userId === user.id })),
  );
});

export const POST = withSession(async ({ req, user }) => {
  const body = await parseRequestBody(req);
  const data = CreateWorkspaceSchema.parse(body);
  const workspace = await createWorkspace(user.id, data);
  return responseData(workspace);
});
