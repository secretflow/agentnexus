import { getChatVotes, parseRequestBody, responseData, upsertChatVote } from "@/lib/api";
import { withApiKey } from "@/lib/auth";
import { recordMessageVote } from "@/lib/tinybird";
import { MessageVoteSchema } from "@/lib/zod";

export const GET = withApiKey(async ({ params }) => {
  const { chatId } = params;
  const votes = await getChatVotes(chatId);
  return responseData(votes);
});

export const PATCH = withApiKey(async ({ req }) => {
  const body = await parseRequestBody(req);
  const data = MessageVoteSchema.parse(body);
  const { chatId, messageId, isUpvoted } = data;
  const vote = await upsertChatVote(chatId, messageId, isUpvoted);
  recordMessageVote(req, messageId, isUpvoted ? "up" : "down");
  return responseData(vote);
});
