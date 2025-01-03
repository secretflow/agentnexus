import { createApplication, getApplications, parseRequestBody, responseData } from "@/lib/api";
import { withWorkspace } from "@/lib/auth";
import { CreateApplicationSchema } from "@/lib/zod";

export const GET = withWorkspace(async ({ workspace }) => {
  const applications = await getApplications(workspace.id);
  return responseData(applications);
});

export const POST = withWorkspace(async ({ req, workspace, user }) => {
  const body = await parseRequestBody(req);
  const data = CreateApplicationSchema.parse(body);
  const application = await createApplication(user.id, workspace.id, data);
  return responseData(application);
});
