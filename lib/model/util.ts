import type { ModelProviderProps } from "@/lib/zod";
import { modelProviderRegistry } from "./registry";

export function getLanguageModel(provider: string, modelId: string) {
  const modelProvider = modelProviderRegistry.get(provider);
  return modelProvider?.getLanguageModel(modelId);
}

export function getEmbeddingModel(provider: string, modelId: string) {
  const modelProvider = modelProviderRegistry.get(provider);
  return modelProvider?.getEmbeddingModel(modelId);
}

export async function getLanguageModelList() {
  const keys = modelProviderRegistry.keys();
  const results: ModelProviderProps[] = [];

  for (const key of keys) {
    const provider = modelProviderRegistry.get(key);
    if (provider) {
      const models = await provider.getModelList();
      results.push({
        name: provider.name,
        models: models.map((model) => ({
          id: model.id,
          provider: provider.name,
        })),
      });
    }
  }

  return results;
}
