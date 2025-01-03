import { NODE_ATTRS } from "@/lib/constants";
import { log } from "../../utils";
import { SuccessWorkReport } from "../report";
import { registerWork } from "../utils";
import { type Work, type WorkContext, WorkStatus } from "../work";

export type ConditionWorkConfig = Record<string, string | number>;

@registerWork(NODE_ATTRS.condition.id)
class ConditionWork implements Work {
  public id: string;
  public config: ConditionWorkConfig;

  constructor(id: string, config: ConditionWorkConfig) {
    this.id = id;
    this.config = config;
  }

  async call(workContext: WorkContext) {
    workContext.set(this.id, {
      input: this.config,
      output: this.config,
      status: WorkStatus.SUCCESS,
    });

    log.success(`ConditionWork ${this.id} successed!`);

    return new SuccessWorkReport(workContext);
  }
}

export { ConditionWork };
