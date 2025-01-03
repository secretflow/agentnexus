import type { AIFunctionLike } from "@agentic/core";
import { toolProviderRegistry } from "./registry";

export function getToolProvider(toolId: string) {
  return toolProviderRegistry.get(toolId);
}

export function getToolProviderList() {
  return toolProviderRegistry.values();
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function getAiTools(toolIds: string[], args?: any) {
  const results: {
    tools: AIFunctionLike[];
    activeTools: string[];
  } = {
    tools: [],
    activeTools: [],
  };

  toolIds.forEach((toolId) => {
    const tool = getToolProvider(toolId);
    if (tool) {
      results.tools.push(tool.getAiFunction(args));
      results.activeTools.push(tool.toolName);
    }
  });

  return results;
}
