import { TOOL_ATTRS } from "@/lib/constants";
import { getToolProvider } from "@/lib/tools";
import { log } from "@/lib/utils";
import type { ChatConfigProps, RetrievalResultProps, VariableProps } from "@/lib/zod";
import { FailureWorkReport, SuccessWorkReport } from "../report";
import { interpolateString, registerWork } from "../utils";
import { type Work, type WorkContext, WorkStatus } from "../work";

export type KnowledgeRetrievalConfig = {
  question: string;
  knowledgebases: { id: string; name: string }[];
  chatConfig: ChatConfigProps;
  variables: VariableProps[];
};

const toolId = TOOL_ATTRS.knowledgeRetrieval.id;
@registerWork(toolId)
class KnowledgeRetrievalWork implements Work {
  public id: string;
  public config: KnowledgeRetrievalConfig;

  constructor(id: string, config: KnowledgeRetrievalConfig) {
    this.id = id;
    this.config = config;
  }

  async call(workContext: WorkContext) {
    const toolProvider = getToolProvider(toolId);
    const question = interpolateString(this.config.question, workContext);

    if (!toolProvider) {
      const errMsg = `Tool provider not found: ${toolId}`;
      workContext.set(this.id, {
        input: { question, knowledgebaseIds: this.config.knowledgebases },
        output: null,
        status: WorkStatus.FAILED,
        error: errMsg,
      });
      return new FailureWorkReport(workContext, new Error(errMsg));
    }

    const res = (await toolProvider.call(
      question,
      this.config.knowledgebases.map((kb) => kb.id),
      this.config.chatConfig,
    )) as RetrievalResultProps[];
    const result = res.map((r) => `${r.content}`).join("\n\n");

    workContext.set(this.id, {
      input: { question, knowledgebaseIds: this.config.knowledgebases },
      output: {
        result,
      },
      status: WorkStatus.SUCCESS,
    });

    log.success(`KnowledgeRetrievalWork ${this.id} successed!`);

    return new SuccessWorkReport(workContext);
  }
}

export { KnowledgeRetrievalWork };
