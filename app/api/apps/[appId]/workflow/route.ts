import { getWorkflow, parseRequestBody, responseData, returnErrorResponse } from "@/lib/api";
import { withApiKey } from "@/lib/auth";
import { WorkContext, WorkStatus, compileDagToWorkflow } from "@/lib/workflow";
import type { GraphModelProps } from "@/lib/zod";

export const maxDuration = 120;

export const POST = withApiKey(async ({ req, application }) => {
  const params = await parseRequestBody(req);
  const workflow = await getWorkflow(application.id);

  try {
    const flow = compileDagToWorkflow(workflow.content as GraphModelProps, params);
    const report = await flow.call(new WorkContext());

    if (report.getWorkStatus() === WorkStatus.SUCCESS) {
      const result = report.getWorkContext();
      return responseData(result.toJson());
    } else {
      const errors = report.getError();
      const error = Array.isArray(errors) ? errors[0] : errors;
      return returnErrorResponse(error);
    }
  } catch (e) {
    return returnErrorResponse(e);
  }
});
