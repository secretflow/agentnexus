import {
  deleteWorksapce,
  getWorkspaceOrThrow,
  parseRequestBody,
  responseData,
  updateWorkspace,
} from "@/lib/api";
import { withWorkspace } from "@/lib/auth";
import { UpdateWorkspaceSchema } from "@/lib/zod";

export const GET = withWorkspace(async ({ workspace, user }) => {
  const data = await getWorkspaceOrThrow(workspace.userId, workspace.id);
  return responseData({
    ...data,
    isOwner: data.userId === user.id,
  });
});

export const PATCH = withWorkspace(async ({ req, workspace }) => {
  const body = await parseRequestBody(req);
  const workspaceData = UpdateWorkspaceSchema.parse(body);
  const updatedWorkspace = await updateWorkspace(workspace.id, workspaceData);
  return responseData(updatedWorkspace);
});

export const DELETE = withWorkspace(async ({ workspace, user }) => {
  const deletedWorkspace = await deleteWorksapce(workspace.id, user.id);
  return responseData(deletedWorkspace);
});
