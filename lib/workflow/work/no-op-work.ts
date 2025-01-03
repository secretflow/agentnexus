import type { Work } from ".";
import { SuccessWorkReport, type WorkReport } from "../report";
import type { WorkContext } from "./work-context";

export type NoOpWorkConfig = Record<string, unknown>;

export class NoOpWork implements Work {
  public id: string;
  public config: NoOpWorkConfig;

  constructor(id?: string, config?: NoOpWorkConfig) {
    this.id = id || "noop";
    this.config = config || {};
  }

  async call(workContext: WorkContext): Promise<WorkReport> {
    return new SuccessWorkReport(workContext);
  }
}
