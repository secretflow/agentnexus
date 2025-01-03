import { WorkContext, WorkStatus } from "../work";

export interface WorkReport {
  getWorkStatus(): WorkStatus;
  getWorkContext(): WorkContext;
  getError(): undefined | Error | Error[];
}

export class DefaultWorkReport implements WorkReport {
  constructor(
    protected workStatus: WorkStatus,
    protected workContext: WorkContext,
    protected error?: Error,
  ) {}

  getWorkStatus(): WorkStatus {
    return this.workStatus;
  }

  getWorkContext(): WorkContext {
    return this.workContext;
  }

  getError(): Error | undefined {
    return this.error;
  }
}

export class BrokenWorkReport extends DefaultWorkReport {
  constructor(workContext: WorkContext, err: Error) {
    super(WorkStatus.BROKEN, workContext, err);
  }
}

export class FailureWorkReport extends DefaultWorkReport {
  constructor(workContext: WorkContext, err: Error) {
    super(WorkStatus.FAILED, workContext, err);
  }
}

export class SuccessWorkReport extends DefaultWorkReport {
  constructor(workContext: WorkContext) {
    super(WorkStatus.SUCCESS, workContext);
  }
}

export class ParallelWorkReport implements WorkReport {
  constructor(private workReportList: WorkReport[]) {}

  getError(): Error[] {
    const errors: Error[] = [];

    for (const workReport of this.workReportList) {
      const error = <Error>workReport.getError();
      if (error != null) {
        errors.push(error);
      }
    }

    return errors;
  }

  getWorkContext(): WorkContext {
    const workContext = new WorkContext();

    for (const workReport of this.workReportList) {
      const tmpWorkContext = workReport.getWorkContext();
      tmpWorkContext.forEach((value, key) => {
        workContext.set(key, value);
      });
    }

    return workContext;
  }

  getWorkStatus(): WorkStatus {
    for (const workReport of this.workReportList) {
      const workStatus = workReport.getWorkStatus();
      if (workStatus === WorkStatus.FAILED || workStatus === WorkStatus.BROKEN) {
        return workStatus;
      }
    }

    return WorkStatus.SUCCESS;
  }

  getWorkList(): WorkReport[] {
    return this.workReportList;
  }
}
