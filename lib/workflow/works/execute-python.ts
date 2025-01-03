import { TOOL_ATTRS } from "@/lib/constants";
import { getToolProvider } from "@/lib/tools";
import { log } from "@/lib/utils";
import type { VariableProps, VariableRefProps } from "@/lib/zod";
import { FailureWorkReport, SuccessWorkReport } from "../report";
import { registerWork } from "../utils";
import { type Work, type WorkContext, WorkStatus } from "../work";

export type ExecutePythonWorkConfig = {
  code: string;
  params: VariableRefProps[];
  variables: VariableProps[];
};

const toolId = TOOL_ATTRS.executePython.id;
@registerWork(toolId)
class ExecutePythonWork implements Work {
  public id: string;
  public config: ExecutePythonWorkConfig;

  constructor(id: string, config: ExecutePythonWorkConfig) {
    this.id = id;
    this.config = config;
  }

  async call(workContext: WorkContext) {
    const { code, params } = this.config;
    const fnParams: Record<string, string | number | null> = {};
    params.forEach(({ name, ref }) => {
      if (ref) {
        fnParams[name] = workContext.get(ref.nodeId)?.output[ref.variable] ?? null;
      } else {
        fnParams[name] = null;
      }
    });

    const executePythonToolProvider = getToolProvider(toolId);
    if (!executePythonToolProvider) {
      const errMsg = `Tool provider not found: ${toolId}`;
      workContext.set(this.id, {
        input: { code, params },
        output: null,
        status: WorkStatus.FAILED,
        error: errMsg,
      });
      return new FailureWorkReport(workContext, new Error(errMsg));
    }

    const res = (await executePythonToolProvider.call(code, fnParams)) as string | undefined;

    workContext.set(this.id, {
      input: { code, params },
      output: res,
      status: WorkStatus.SUCCESS,
    });

    log.success(`ExecutePythonWork ${this.id} successed!`);

    return new SuccessWorkReport(workContext);
  }
}

export { ExecutePythonWork };
