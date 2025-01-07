import { NODE_ATTRS } from "@/lib/constants";
import { getLanguageModel } from "@/lib/model";
import { log } from "@/lib/utils";
import type { ModelConfigProps, ModelProps } from "@/lib/zod";
import type { VariableProps } from "@/lib/zod";
import { generateObject } from "ai";
import { FailureWorkReport, SuccessWorkReport } from "../report";
import { interpolateString, registerWork, variablesToZod } from "../utils";
import { type Work, type WorkContext, WorkStatus } from "../work";

export type LLMWorkConfig = {
  model: ModelProps;
  modelSettings?: ModelConfigProps;
  system?: string;
  prompt: string;
  variables: VariableProps[];
};

@registerWork(NODE_ATTRS.llm.id)
class LLMWork implements Work {
  public id: string;
  public config: LLMWorkConfig;

  constructor(id: string, config: LLMWorkConfig) {
    this.id = id;
    this.config = config;
  }

  async call(workContext: WorkContext) {
    const { model, system, prompt, variables, modelSettings } = this.config;

    const formattedSystem = system ? interpolateString(system, workContext) : undefined;
    const formattedPrompt = interpolateString(prompt, workContext);

    const input = {
      model,
      system: formattedSystem,
      prompt: formattedPrompt,
    };

    const languageModel = getLanguageModel(model.provider, model.id);
    if (!languageModel) {
      const errorMsg = `${model.provider}/${model.id} not found`;
      workContext.set(this.id, {
        input,
        output: null,
        status: WorkStatus.FAILED,
        error: errorMsg,
      });
      return new FailureWorkReport(workContext, new Error(errorMsg));
    }

    try {
      const result = await generateObject({
        model: languageModel,
        system: formattedSystem,
        prompt: formattedPrompt,
        schema: variablesToZod(variables),
        ...modelSettings,
      });

      workContext.set(this.id, {
        input,
        output: {
          ...result.object,
          usage: result.usage,
        },
        status: WorkStatus.SUCCESS,
      });

      log.success(`LLMWork ${this.id} successed!`);

      return new SuccessWorkReport(workContext);
    } catch (error) {
      workContext.set(this.id, {
        input: input,
        output: null,
        status: WorkStatus.FAILED,
        error: (error as Error).message,
      });

      log.error(error as Error);

      return new FailureWorkReport(workContext, error as Error);
    }
  }
}

export { LLMWork };
