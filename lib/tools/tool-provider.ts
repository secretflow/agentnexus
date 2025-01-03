import type { AIFunctionLike } from "@agentic/core";
import type { ElementType } from "react";

export interface ToolProvider {
  id: string;
  name: string;
  introduction: string;
  icon: ElementType;

  toolName: string;

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  call(...args: any): Promise<any>;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  getAiFunction(args?: any): AIFunctionLike;
}
