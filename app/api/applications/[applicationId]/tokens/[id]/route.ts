import { deleteToken, parseRequestBody, responseData, updateToken } from "@/lib/api";
import { withApplication } from "@/lib/auth";
import { TokenSchema } from "@/lib/zod";

export const PATCH = withApplication(async ({ application, params, req }) => {
  const { name } = await parseRequestBody(req);
  const token = await updateToken(name, params.id, application.id);
  return responseData(TokenSchema.parse(token));
});

export const DELETE = withApplication(async ({ application, params }) => {
  const token = await deleteToken(params.id, application.id);
  return responseData(token);
});
