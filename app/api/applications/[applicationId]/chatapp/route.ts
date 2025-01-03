import { getChatApp, parseRequestBody, responseData, upsertChatApp } from "@/lib/api";
import { withApplication } from "@/lib/auth";
import { UpsertChatAppSchema } from "@/lib/zod";

export const GET = withApplication(async ({ application }) => {
  const chatApp = await getChatApp(application.id, true);
  return responseData(chatApp);
});

export const PATCH = withApplication(async ({ application, req }) => {
  const body = await parseRequestBody(req);
  const data = UpsertChatAppSchema.parse(body);
  const chatApp = await upsertChatApp(application.id, data);
  return responseData(chatApp);
});
