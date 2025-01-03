import { type Assertion, type WorkReport, WorkReportAssertion } from "../report";
import type { Work, WorkContext } from "../work";
import { NoOpWork } from "../work";
import { AbstractWorkFlow } from "./abstract-work-flow";

export class ConditionalFlow extends AbstractWorkFlow {
  private toExecute: Work = new NoOpWork();
  private nextOnTrue: Work = new NoOpWork();
  private nextOnFalse: Work = new NoOpWork();
  private assertion = new WorkReportAssertion();

  constructor(id: string) {
    super(id);
  }

  withWork(work: Work) {
    this.toExecute = work;
    return this;
  }

  then(work: Work) {
    this.nextOnTrue = work;
    return this;
  }

  otherwise(work: Work) {
    this.nextOnFalse = work;
    return this;
  }

  when(assertion: Assertion) {
    this.assertion = assertion;
    return this;
  }

  async call(workContext: WorkContext) {
    let report: WorkReport;
    report = await this.toExecute.call(workContext);

    const result = await this.assertion.assert(report);
    if (result) {
      report = await this.nextOnTrue.call(workContext);
    } else {
      if (!(this.nextOnFalse instanceof NoOpWork)) {
        report = await this.nextOnFalse.call(workContext);
      }
    }

    return report;
  }
}
