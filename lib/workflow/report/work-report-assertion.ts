import { WorkStatus } from "../work";
import type { WorkReport } from "./work-report";

export interface Assertion {
  assert(workReport: WorkReport): Promise<boolean>;
}

export class WorkReportAssertion implements Assertion {
  assert(workReport: WorkReport): Promise<boolean> {
    return Promise.resolve(workReport.getWorkStatus() === WorkStatus.SUCCESS);
  }
}
