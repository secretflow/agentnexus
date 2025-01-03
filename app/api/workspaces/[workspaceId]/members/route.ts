import {
  ApiError,
  deleteTokenByUserId,
  deleteWorkspaceMember,
  getUserOrThrow,
  getWorkspaceMembers,
  responseData,
  returnErrorResponse,
} from "@/lib/api";
import { withWorkspace } from "@/lib/auth";

export const GET = withWorkspace(async ({ workspace }) => {
  const owner = await getUserOrThrow(workspace.userId);
  const members = await getWorkspaceMembers(workspace.id);

  return responseData([
    { ...owner, role: "owner" },
    ...members.map((member) => ({ ...member, role: "member" })),
  ]);
});

export const DELETE = withWorkspace(async ({ workspace, searchParams, user }) => {
  const { deleteUserId } = searchParams;

  if (workspace.userId === user.id) {
    // i am the workspace owner
    if (deleteUserId === user.id) {
      return returnErrorResponse(
        new ApiError({
          code: "forbidden",
          message: "工作空间所有者无法删除自己",
        }),
      );
    }
  } else {
    if (deleteUserId !== user.id) {
      return returnErrorResponse(
        new ApiError({
          code: "forbidden",
          message: "你有没有权限删除其他成员",
        }),
      );
    }
  }

  const member = await deleteWorkspaceMember(workspace.id, deleteUserId);

  // remove the token created by the user
  await deleteTokenByUserId(deleteUserId);

  return responseData(member);
});
