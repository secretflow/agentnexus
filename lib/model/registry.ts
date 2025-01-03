import { Registry } from "@/lib/utils";
import type { ModelProvider } from "./model-provider";

const modelProviderRegistry = new Registry<ModelProvider>();

function registerModelProvider(provider: ModelProvider) {
  modelProviderRegistry.register(provider.name, provider);
}

export { registerModelProvider, modelProviderRegistry };
