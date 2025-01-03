import { deleteUser, parseRequestBody, responseData, updateUser } from "@/lib/api";
import { withSession } from "@/lib/auth";
import { UpdateUserSchema } from "@/lib/zod";

export const PATCH = withSession(async ({ req, user }) => {
  const body = await parseRequestBody(req);
  const data = UpdateUserSchema.parse(body);
  const updatedUser = await updateUser(user.id, data);
  return responseData(updatedUser);
});

export const DELETE = withSession(async ({ user }) => {
  const deletedUser = await deleteUser(user.id);
  return responseData(deletedUser);
});
