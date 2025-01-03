import {
  ApiError,
  getApplicationOrThrow,
  getWorkspaceOrThrow,
  returnErrorResponse,
} from "@/lib/api";
import { getSearchParams } from "@/lib/utils";
import type { ApplicationProps, WorkspaceProps } from "@/lib/zod";
import type { UserProps } from "@/lib/zod";
import { type AxiomRequest, withAxiom } from "next-axiom";
import { getCurrentUser } from "./session";

type WithApplicationHandler = ({
  req,
  params,
  searchParams,
  user,
  workspace,
  application,
}: {
  req: Request;
  params: Record<string, string>;
  searchParams: Record<string, string>;
  user: UserProps;
  workspace: WorkspaceProps;
  application: ApplicationProps;
}) => Promise<Response>;

export const withApplication = (handler: WithApplicationHandler) =>
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
        const applicationId = syncParams.applicationId || searchParams.applicationId;

        if (!(workspaceId && applicationId)) {
          throw new ApiError({
            code: "bad_request",
            message: "缺少 workspaceId 或 applicationId",
          });
        }

        const workspace = await getWorkspaceOrThrow(user.id, workspaceId);
        const application = (await getApplicationOrThrow(applicationId)) as ApplicationProps;

        return await handler({
          req,
          params: syncParams,
          searchParams,
          user,
          workspace,
          application,
        });
      } catch (error) {
        return returnErrorResponse(error);
      }
    },
  );
