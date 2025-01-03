import { ApiError, getWorkspaceOrThrow, returnErrorResponse } from "@/lib/api";
import { getSearchParams } from "@/lib/utils";
import type { UserProps, WorkspaceProps } from "@/lib/zod";
import { type AxiomRequest, withAxiom } from "next-axiom";
import { getCurrentUser } from "./session";

type WithWorkspaceHandler = ({
  req,
  params,
  searchParams,
  user,
  workspace,
}: {
  req: Request;
  params: Record<string, string>;
  searchParams: Record<string, string>;
  user: UserProps;
  workspace: WorkspaceProps;
}) => Promise<Response>;

export const withWorkspace = (handler: WithWorkspaceHandler) =>
  withAxiom(
    async (
      req: AxiomRequest,
      { params = Promise.resolve({}) }: { params: Promise<Record<string, string>> },
    ) => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          throw new ApiError({
            code: "unauthorized",
            message: "未认证，请先登录",
          });
        }

        const syncParams = await params;
        const searchParams = getSearchParams(req.url);
        const workspaceId = syncParams.workspaceId || searchParams.workspaceId;

        if (!workspaceId) {
          throw new ApiError({
            code: "bad_request",
            message: "缺少工作空间 ID",
          });
        }

        const workspace = await getWorkspaceOrThrow(user.id, workspaceId);

        return await handler({ req, params: syncParams, searchParams, user, workspace });
      } catch (error) {
        return returnErrorResponse(error);
      }
    },
  );
