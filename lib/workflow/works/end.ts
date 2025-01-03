import { NODE_ATTRS } from "@/lib/constants";
import type { VariableRefProps } from "@/lib/zod";
import { log } from "../../utils";
import { SuccessWorkReport } from "../report";
import { registerWork } from "../utils";
import { type Work, type WorkContext, WorkStatus } from "../work";

export type EndWorkConfig = {
  variableRefs: VariableRefProps[];
};

@registerWork(NODE_ATTRS.end.id)
class EndWork implements Work {
  public id: string;
  public config: EndWorkConfig;

  constructor(id: string, config: EndWorkConfig) {
    this.id = id;
    this.config = config;
  }

  async call(workContext: WorkContext) {
    const result: Record<string, string | number | null> = {};

    this.config.variableRefs.forEach(({ name, ref }) => {
      if (ref) {
        result[name] = workContext.get(ref.nodeId)?.output[ref.variable] ?? null;
      } else {
        result[name] = null;
      }
    });

    workContext.set(this.id, {
      input: result,
      output: result,
      status: WorkStatus.SUCCESS,
    });

    log.success(`EndWork ${this.id} successed!`);

    return new SuccessWorkReport(workContext);
  }
}

export { EndWork };
