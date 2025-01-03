import {
  ApiError,
  createWorkspaceMember,
  getWorkspaceByInviteCode,
  parseRequestBody,
  responseData,
  returnErrorResponse,
} from "@/lib/api";
import { withSession } from "@/lib/auth";

export const POST = withSession(async ({ req, user }) => {
  const { code } = await parseRequestBody(req);
  const workspace = await getWorkspaceByInviteCode(code);

  if (!workspace) {
    return returnErrorResponse(
      new ApiError({
        code: "not_found",
        message: "该链接无效，请联系工作空间所有者获取最新链接",
      }),
    );
  }

  const alreadyJoined =
    workspace.members.some((member) => member.userId === user.id) || workspace.userId === user.id;

  if (alreadyJoined) {
    return returnErrorResponse(
      new ApiError({
        code: "bad_request",
        message: "您已加入该工作空间",
      }),
    );
  }

  await createWorkspaceMember(workspace.id, user.id);
  return responseData(workspace);
});
