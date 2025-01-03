import { NextResponse } from "next/server";
import z from "zod";
import { generateErrorMessage } from "zod-error";

const docErrorUrl = "/docs/errors";

export const ErrorCode = z.enum([
  "bad_request",
  "unauthorized",
  "forbidden",
  "not_found",
  "unprocessable_entity",
  "internal_server_error",
]);

export const errorCodeToHttpStatus: Record<z.infer<typeof ErrorCode>, number> = {
  bad_request: 400,
  unauthorized: 401,
  forbidden: 403,
  not_found: 404,
  unprocessable_entity: 422,
  internal_server_error: 500,
};

export class ApiError extends Error {
  public readonly code: z.infer<typeof ErrorCode>;
  public readonly docUrl?: string;

  constructor({
    code,
    message,
    docUrl,
  }: {
    code: z.infer<typeof ErrorCode>;
    message: string;
    docUrl?: string;
  }) {
    super(message);
    this.code = code;
    this.docUrl = docUrl ?? `${docErrorUrl}#${code.replace("_", "-")}`;
  }
}

export function returnErrorResponse(err: unknown, headers?: Record<string, string>) {
  let status = 500;
  let error = {
    code: "internal_server_error",
    message: "Internal Server Error",
    doc_url: `${docErrorUrl}#internal-server-error`,
  };

  if (err instanceof ApiError) {
    error = {
      code: err.code,
      message: err.message,
      doc_url: `${err.docUrl}`,
    };
    status = errorCodeToHttpStatus[err.code];
  } else if (err instanceof z.ZodError) {
    error = {
      code: "unprocessable_entity",
      message: generateErrorMessage(err.issues, {
        maxErrors: 1,
        delimiter: {
          component: ": ",
        },
        path: {
          enabled: false,
        },
        code: {
          enabled: false,
        },
        message: {
          enabled: true,
          label: "",
        },
      }),
      doc_url: `${docErrorUrl}#unprocessable-entity`,
    };
    status = errorCodeToHttpStatus.unprocessable_entity;
  } else if (err instanceof Error) {
    error.message = err.message;
  }

  return NextResponse.json(error, { headers, status });
}
