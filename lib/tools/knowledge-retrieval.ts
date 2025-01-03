import { findRelevantContent, generateSimilarQuestions } from "@/lib/ai";
import { TOOL_ATTRS } from "@/lib/constants";
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
      model: getLanguageModel("openai", "gpt-4o-mini")!,
      question,
    });
    const results = await findRelevantContent(
      questions,
      knowledgebaseIds,
      config?.recall?.score || 0.3,
      config?.recall?.topK || 3,
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
          config?.recall?.score || 0.3,
          config?.recall?.topK || 3,
        );
        return results;
      },
    );
  },
});
