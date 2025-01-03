import type { ModelProps } from "@/lib/zod";
import type { EmbeddingModel, LanguageModelV1 } from "ai";

export interface ModelProvider {
  name: string;
  apiKey: string;
  baseURL: string;

  getModelList(): Promise<ModelProps[]>;
  getLanguageModel(modelId: string): LanguageModelV1;
  getEmbeddingModel(modelId: string): EmbeddingModel<string>;
}
