import { parseRequestBody, returnErrorResponse } from "@/lib/api";
import { withApplication } from "@/lib/auth";
import { WorkContext, WorkStatus, compileDagToWorkflow } from "@/lib/workflow";
import { NextResponse } from "next/server";

export const maxDuration = 120;

export const POST = withApplication(async ({ req }) => {
  const { dag, input } = await parseRequestBody(req);

  try {
    const workflow = compileDagToWorkflow(dag, input);
    const report = await workflow.call(new WorkContext());

    if (report.getWorkStatus() === WorkStatus.SUCCESS) {
      const result = report.getWorkContext();
      return NextResponse.json(result.toJson());
    } else {
      const errors = report.getError();
      const error = Array.isArray(errors) ? errors[0] : errors;
      return returnErrorResponse(error);
    }
  } catch (e) {
    return returnErrorResponse(e);
  }
});
