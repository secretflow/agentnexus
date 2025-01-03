import { deleteApplication, parseRequestBody, responseData, updateApplication } from "@/lib/api";
import { withApplication } from "@/lib/auth";
import { UpdateApplicationSchema } from "@/lib/zod";

export const GET = withApplication(async ({ application }) => {
  return responseData(application);
});

export const PATCH = withApplication(async ({ req, application }) => {
  const body = await parseRequestBody(req);
  const data = UpdateApplicationSchema.parse(body);
  const app = await updateApplication(application.workspaceId, application.id, data);
  return responseData(app);
});

export const DELETE = withApplication(async ({ application }) => {
  const app = await deleteApplication(application.workspaceId, application.id);
  return responseData(app);
});
