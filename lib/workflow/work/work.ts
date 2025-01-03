import type { WorkReport } from "../report";
import type { WorkContext } from "./work-context";

export interface Work {
  id: string;
  config?: Record<string, unknown>;

  call(workContext: WorkContext): Promise<WorkReport>;
  validate?(): boolean;
}
