import { type NextRequest, NextResponse } from "next/server";
import { ApiError } from "./error";

export const parseRequestUrl = (req: NextRequest) => {
  const domain = req.headers.get("host") as string;
  const path = req.nextUrl.pathname;

  const searchParams = req.nextUrl.searchParams.toString();
  const searchParamsString = searchParams.length > 0 ? `?${searchParams}` : "";
  const fullPath = `${path}${searchParamsString}`;

  return { domain, path, fullPath, searchParamsString };
};

export const parseRequestBody = async (req: Request) => {
  try {
    return await req.json();
  } catch (e) {
    throw new ApiError({
      code: "bad_request",
      message:
        "Invalid JSON format in request body. Please ensure the request body is a valid JSON object.",
    });
  }
};

export function responseData(
  // biome-ignore lint/suspicious/noExplicitAny: data can be any type
  data: any,
  headers?: Record<string, string>,
) {
  return NextResponse.json(data, { headers, status: 200 });
}

export function parseRequestApiKey(req: NextRequest) {
  let apiKey: string | undefined = undefined;

  const authorizationHeader = req.headers.get("Authorization");
  if (authorizationHeader) {
    apiKey = authorizationHeader.replace("Bearer ", "");
  }

  return apiKey;
}
