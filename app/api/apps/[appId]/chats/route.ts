import { getChatsByClientId, responseData } from "@/lib/api";
import { withApiKey } from "@/lib/auth";

export const GET = withApiKey(async ({ params, token }) => {
  const { appId } = params;
  const chats = await getChatsByClientId(appId, token.id);
  return responseData(chats);
});
