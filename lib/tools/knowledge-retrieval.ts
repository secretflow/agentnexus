import { findRelevantContent, generateSimilarQuestions } from "@/lib/ai";
import { DEFAULT_MODEL, DEFAULT_RECALL_CONFIG, TOOL_ATTRS } from "@/lib/constants";
import { getLanguageModel } from "@/lib/model";
import type { ChatConfigProps } from "@/lib/zod";
import { createAIFunction } from "@agentic/core";
import type { LanguageModelV1 } from "ai";
import { z } from "zod";
import { registerToolProvider } from "./registry";

registerToolProvider({
  ...TOOL_ATTRS.knowledgeRetrieval,

  async call(question: string, knowledgebaseIds: string[], config: ChatConfigProps | undefined) {
    const questions = await generateSimilarQuestions({
      model: getLanguageModel(DEFAULT_MODEL.provider, DEFAULT_MODEL.id)!,
      question,
    });
    const results = await findRelevantContent(
      questions,
      knowledgebaseIds,
      config?.recall?.score || DEFAULT_RECALL_CONFIG.score,
      config?.recall?.topK || DEFAULT_RECALL_CONFIG.topK,
    );
    return results;
  },

  getAiFunction(args: {
    knowledgebaseIds: string[];
    model: LanguageModelV1;
    config: ChatConfigProps | undefined;
  }) {
    const { knowledgebaseIds, model, config } = args;

    return createAIFunction(
      {
        name: "getInformation",
        description: "get information from your knowledge base to answer questions.",
        inputSchema: z.object({
          question: z.string().describe("the users question"),
        }),
      },
      async ({ question }) => {
        const questions = await generateSimilarQuestions({ model, question });
        const results = await findRelevantContent(
          questions,
          knowledgebaseIds,
          config?.recall?.score || DEFAULT_RECALL_CONFIG.score,
          config?.recall?.topK || DEFAULT_RECALL_CONFIG.topK,
        );
        return results;
      },
    );
  },
});
