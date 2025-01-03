import { ApiError, getKnowledgebase, getWorkspaceOrThrow, returnErrorResponse } from "@/lib/api";
import { getSearchParams } from "@/lib/utils";
import type { KnowledgebaseProps, UserProps, WorkspaceProps } from "@/lib/zod";
import { type AxiomRequest, withAxiom } from "next-axiom";
import { getCurrentUser } from "./session";

type WithKnowledgebaseHandler = ({
  req,
  params,
  searchParams,
  user,
  workspace,
  knowledgebase,
}: {
  req: Request;
  params: Record<string, string>;
  searchParams: Record<string, string>;
  user: UserProps;
  workspace: WorkspaceProps;
  knowledgebase: KnowledgebaseProps;
}) => Promise<Response>;

export const withKnowledgebase = (handler: WithKnowledgebaseHandler) =>
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
        const knowledgebaseId = syncParams.knowledgebaseId || searchParams.knowledgebaseId;

        if (!(workspaceId && knowledgebaseId)) {
          throw new ApiError({
            code: "bad_request",
            message: "缺少 workspaceId 或 knowledgebaseId",
          });
        }

        const workspace = await getWorkspaceOrThrow(user.id, workspaceId);
        const knowledgebase = (await getKnowledgebase(
          knowledgebaseId,
          workspaceId,
        )) as KnowledgebaseProps;

        return await handler({
          req,
          params: syncParams,
          searchParams,
          user,
          workspace,
          knowledgebase,
        });
      } catch (error) {
        return returnErrorResponse(error);
      }
    },
  );
