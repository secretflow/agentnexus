import type { WorkReport } from "../report";
import type { WorkContext } from "../work";
import type { WorkFlow } from "./work-flow";

export abstract class AbstractWorkFlow implements WorkFlow {
  constructor(public id: string) {}

  abstract call(workContext: WorkContext): Promise<WorkReport>;
}
