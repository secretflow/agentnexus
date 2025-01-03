import type { WorkReport } from "../report";
import { type Work, type WorkContext, WorkStatus } from "../work";
import { AbstractWorkFlow } from "./abstract-work-flow";
export class SequentialFlow extends AbstractWorkFlow {
  private workList: Work[] = [];

  constructor(id: string) {
    super(id);
  }

  addWork(work: Work) {
    this.workList.push(work);
    return this;
  }

  withWorks(workList: Work[]) {
    this.workList = workList;
    return this;
  }

  async call(workContext: WorkContext) {
    let workReport: WorkReport;
    for (const work of this.workList) {
      workReport = await work.call(workContext);
      const workStatus = workReport.getWorkStatus();
      if (
        workReport != null &&
        (workStatus === WorkStatus.FAILED || workStatus === WorkStatus.BROKEN)
      )
        break;
    }
    return workReport!;
  }
}
