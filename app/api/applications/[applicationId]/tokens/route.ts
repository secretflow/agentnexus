import { createToken, getTokens, parseRequestBody, responseData } from "@/lib/api";
import { withApplication } from "@/lib/auth";
import { TokenSchema } from "@/lib/zod";

export const GET = withApplication(async ({ application }) => {
  const tokens = await getTokens(application.id);
  return responseData(TokenSchema.array().parse(tokens));
});

export const POST = withApplication(async ({ req, user, application }) => {
  const { name } = await parseRequestBody(req);
  const token = await createToken(name, user.id, application.id);
  return responseData({ token });
});
