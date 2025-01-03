import { type Assertion, type WorkReport, WorkReportAssertion } from "../report";
import { NoOpWork, type Work, type WorkContext } from "../work";
import { AbstractWorkFlow } from "./abstract-work-flow";

export class RepeatFlow extends AbstractWorkFlow {
  private work: Work = new NoOpWork();
  private times = 0;
  private assertion = new WorkReportAssertion();

  constructor(id: string) {
    super(id);
  }

  withWork(work: Work) {
    this.work = work;
    return this;
  }

  withTimes(times: number) {
    this.times = times;
    return this;
  }

  until(assertion: Assertion) {
    this.assertion = assertion;
    return this;
  }

  async call(workContext: WorkContext) {
    return this.times && this.times > 0 ? this.doFor(workContext) : this.doLoop(workContext);
  }

  private async doFor(workContext: WorkContext) {
    let workReport: WorkReport;
    let result: boolean;

    for (let i = 0; i < this.times; i++) {
      workReport = await this.work.call(workContext);
      result = await this.assertion.assert(workReport);

      if (!result) {
        break;
      }
    }

    return workReport!;
  }

  private async doLoop(workContext: WorkContext) {
    let workReport: WorkReport;

    let result: boolean;
    do {
      workReport = await this.work.call(workContext);
      result = await this.assertion!.assert(workReport);
    } while (result);

    return workReport;
  }
}
