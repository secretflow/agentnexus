import { ApiError, returnErrorResponse } from "@/lib/api";
import { getSearchParams } from "@/lib/utils";
import type { UserProps } from "@/lib/zod";
import { type AxiomRequest, withAxiom } from "next-axiom";
import { auth } from "./auth";

export const getCurrentUser = async () => {
  const session = await auth();
  return session?.user as UserProps;
};

type WithSessionHandler = ({
  req,
  params,
  searchParams,
  user,
}: {
  req: Request;
  params: Record<string, string>;
  searchParams: Record<string, string>;
  user: UserProps;
}) => Promise<Response>;

export const withSession = (handler: WithSessionHandler) =>
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
        return await handler({ req, params: syncParams, searchParams, user });
      } catch (error) {
        return returnErrorResponse(error);
      }
    },
  );
