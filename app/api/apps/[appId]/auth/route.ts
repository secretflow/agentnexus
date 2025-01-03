import { responseData } from "@/lib/api";
import { withApiKey } from "@/lib/auth";
import { recordUser } from "@/lib/tinybird";

export const GET = withApiKey(async ({ req, application, token }) => {
  recordUser({
    req,
    appId: application.id,
    clientId: token.id,
  });
  return responseData({ valid: true });
});
