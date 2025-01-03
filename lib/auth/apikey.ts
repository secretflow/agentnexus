import {
  ApiError,
  getTokenByHashedKey,
  parseRequestApiKey,
  returnErrorResponse,
  updateTokenLastUsed,
} from "@/lib/api";
import { hashToken } from "@/lib/utils";
import type { ApplicationProps } from "@/lib/zod";
import type { TokenProps, UserProps } from "@/lib/zod";
import { waitUntil } from "@vercel/functions";
import { type AxiomRequest, withAxiom } from "next-axiom";

type WithApiKeyHandler = ({
  req,
  user,
  token,
  params,
  application,
}: {
  req: Request;
  user: UserProps;
  token: Pick<TokenProps, "id"> & Partial<TokenProps>;
  params: Record<string, string>;
  application: ApplicationProps;
}) => Promise<Response>;

export const withApiKey = (handler: WithApiKeyHandler) =>
  withAxiom(
    async (
      req: AxiomRequest,
      { params = Promise.resolve({}) }: { params: Promise<Record<string, string>> },
    ) => {
      try {
        const apiKey = parseRequestApiKey(req);

        if (!apiKey) {
          throw new ApiError({
            code: "unauthorized",
            message: "检测到 API 密钥为空，请检查并提供 API 密钥",
          });
        }

        const hashedKey = await hashToken(apiKey);
        const token = await getTokenByHashedKey(hashedKey);

        if (!token?.user) {
          throw new ApiError({
            code: "unauthorized",
            message: "您的 API 密钥无效，请检查并提供正确的密钥",
          });
        }

        if (token.expires && token.expires < new Date()) {
          throw new ApiError({
            code: "unauthorized",
            message: "您的 API 密钥已过期，请联系应用管理员重新获取秘钥",
          });
        }

        const syncParams = await params;
        const appId = syncParams.appId;
        const user = token.user as UserProps;
        const application = token.application as ApplicationProps;

        if (!appId || application?.id !== appId) {
          throw new ApiError({
            code: "bad_request",
            message: "无效的应用",
          });
        }

        if (!application.published) {
          throw new ApiError({
            code: "bad_request",
            message: "该应用还未发布，请发布后重试！",
          });
        }

        // TODO rate limit

        waitUntil(
          (async () => {
            await updateTokenLastUsed(hashedKey);
          })(),
        );

        return await handler({ req, user, application, token, params: syncParams });
      } catch (error) {
        return returnErrorResponse(error);
      }
    },
  );
