import {
  ApiError,
  getApplicationOrThrow,
  getChatApp,
  responseData,
  returnErrorResponse,
} from "@/lib/api";

export const GET = async (req: Request) => {
  const segments = req.url.split("/");
  const appId = segments[segments.length - 1];

  try {
    const application = await getApplicationOrThrow(appId);
    if (!application.published) {
      return returnErrorResponse(
        new ApiError({
          code: "forbidden",
          message: "应用程序未发布",
        }),
      );
    }

    const chatApp = await getChatApp(appId);
    return responseData(chatApp);
  } catch (error) {
    return returnErrorResponse(error);
  }
};
