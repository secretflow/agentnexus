import { getUserOrThrow, parseRequestBody, responseData, updateUser } from "@/lib/api";
import { withSession } from "@/lib/auth";

export const GET = withSession(async ({ user }) => {
  const { subscribed } = await getUserOrThrow(user.id);
  return responseData({ subscribed });
});

export const PATCH = withSession(async ({ req, user }) => {
  const { subscribed } = await parseRequestBody(req);
  const updatedUser = await updateUser(user.id, { subscribed });
  return responseData({ subscribed: updatedUser.subscribed });
});
