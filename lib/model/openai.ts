import { fetcher } from "@/lib/utils";
import { createOpenAI } from "@ai-sdk/openai";
import type { ModelProvider } from "./model-provider";
import { registerModelProvider } from "./registry";

const OpenAIModelProvider: ModelProvider = {
  name: "openai",
  apiKey: process.env.OPENAI_API_KEY as string,
  baseURL: process.env.OPENAI_API_BASE_URL as string,

  async getModelList() {
    const models = await fetcher(`${this.baseURL}/v1/models`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });
    return models.data;
  },

  getLanguageModel(modelId: string) {
    return createOpenAI({
      apiKey: this.apiKey,
      baseURL: this.baseURL,
      compatibility: "strict",
    })(modelId);
  },

  getEmbeddingModel(modelId: string) {
    return createOpenAI({
      apiKey: this.apiKey,
      baseURL: this.baseURL + "/v1",
    }).embedding(modelId);
  },
};

registerModelProvider(OpenAIModelProvider);
