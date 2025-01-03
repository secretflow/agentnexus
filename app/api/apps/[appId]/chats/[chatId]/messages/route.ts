import { getChatMessages, responseData } from "@/lib/api";
import { withApiKey } from "@/lib/auth";

export const GET = withApiKey(async ({ params }) => {
  const { chatId } = params;
  const messages = await getChatMessages(chatId);
  return responseData(messages);
});
