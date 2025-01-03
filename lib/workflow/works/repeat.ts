import { NODE_ATTRS } from "@/lib/constants";
import { log } from "../../utils";
import { SuccessWorkReport } from "../report";
import { registerWork } from "../utils";
import { type Work, type WorkContext, WorkStatus } from "../work";

export type RepeatWorkConfig = Record<string, string | number>;

@registerWork(NODE_ATTRS.repeat.id)
class RepeatWork implements Work {
  public id: string;
  public config: RepeatWorkConfig;

  constructor(id: string, config: RepeatWorkConfig) {
    this.id = id;
    this.config = config;
  }

  async call(workContext: WorkContext) {
    workContext.set(this.id, {
      input: this.config,
      output: this.config,
      status: WorkStatus.SUCCESS,
    });

    log.success(`RepeatWork ${this.id} successed!`);

    return new SuccessWorkReport(workContext);
  }
}

export { RepeatWork };
