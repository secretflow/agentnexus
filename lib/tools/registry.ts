import { Registry } from "@/lib/utils";
import type { ToolProvider } from "./tool-provider";

const toolProviderRegistry = new Registry<ToolProvider>();

function registerToolProvider(provider: ToolProvider) {
  toolProviderRegistry.register(provider.id, provider);
}

export { registerToolProvider, toolProviderRegistry };
