import { NODE_ATTRS } from "@/lib/constants/";
import { log } from "@/lib/utils";
import type { VariableProps } from "@/lib/zod";
import { SuccessWorkReport } from "../report";
import { registerWork } from "../utils";
import { type Work, type WorkContext, WorkStatus } from "../work";

export type StartWorkConfig = {
  variables: VariableProps[];
};

@registerWork(NODE_ATTRS.start.id)
class StartWork implements Work {
  public id: string;
  public config: StartWorkConfig;
  public startupOptions: Record<string, string | number> = {};

  constructor(id: string, config: StartWorkConfig) {
    this.id = id;
    this.config = config;
  }

  setStartupOptions(options: Record<string, string | number>) {
    this.startupOptions = options;
  }

  async call(workContext: WorkContext) {
    log.start("start run workflow...");

    workContext.set(this.id, {
      input: this.startupOptions,
      output: this.startupOptions,
      status: WorkStatus.SUCCESS,
    });

    log.success(`StartWork ${this.id} successed!`);

    return new SuccessWorkReport(workContext);
  }
}

export { StartWork };
