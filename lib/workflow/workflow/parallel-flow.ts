import { ParallelWorkReport, type WorkReport } from "../report";
import type { Work, WorkContext } from "../work";
import { AbstractWorkFlow } from "./abstract-work-flow";

export class ParallelFlow extends AbstractWorkFlow {
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
    const workReports: WorkReport[] = await Promise.all(
      this.workList.map((work) => work.call(workContext)),
    );

    return new ParallelWorkReport(workReports);
  }
}
