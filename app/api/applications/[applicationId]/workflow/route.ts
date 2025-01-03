import { getWorkflow, parseRequestBody, responseData, upsertWorkflow } from "@/lib/api";
import { withApplication } from "@/lib/auth";
import { UpsertWrokflowSchema } from "@/lib/zod";

export const GET = withApplication(async ({ application }) => {
  const workflow = await getWorkflow(application.id);
  return responseData(workflow);
});

export const POST = withApplication(async ({ req, application }) => {
  const body = await parseRequestBody(req);
  const data = UpsertWrokflowSchema.parse(body);
  const workflow = await upsertWorkflow(application.id, data);
  return responseData(workflow);
});

export const PATCH = POST;
