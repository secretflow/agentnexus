import { VariableEditor } from "@/components/editor";
import { KnowledgebasesAddBlock } from "@/components/knowledgebase";
import { TOOL_ATTRS } from "@/lib/constants";
import type { KnowledgeRetrievalConfig } from "@/lib/workflow";
import { VariableConfig, useVariableRefs } from "../../variable";
import { registerNodeConfig } from "../registry";

const defaultConfig: KnowledgeRetrievalConfig = {
  question: "",
  knowledgebases: [],
  chatConfig: {
    recall: {
      topK: 3,
      score: 0.3,
      semantics: 1,
    },
  },
  variables: [
    {
      name: "result",
      type: "string",
      required: false,
    },
  ],
};

function ConfigComponent({
  nodeId,
  configs,
  onConfigChange,
}: {
  nodeId: string;
  configs: KnowledgeRetrievalConfig;
  onConfigChange: (configs: KnowledgeRetrievalConfig) => void;
}) {
  const { availableVariableRefs } = useVariableRefs(nodeId);

  return (
    <div className="space-y-4">
      <div>
        <h4 className="mb-2 font-medium text-sm">输入变量</h4>
        <VariableEditor
          defaultValue={configs.question || ""}
          availableVariableRefs={availableVariableRefs}
          onChange={(value) => {
            onConfigChange({ ...configs, question: value });
          }}
        />
      </div>
      <div>
        <h4 className="mb-2 font-medium text-sm">知识库</h4>
        <KnowledgebasesAddBlock
          enableSwitch={false}
          knowledgebases={configs.knowledgebases.map(({ id, name }) => ({
            id,
            name,
            enabled: true,
          }))}
          onKnowledgebasesChange={(v) => {
            onConfigChange({
              ...configs,
              knowledgebases: v.map(({ id, name }) => ({ id, name })),
            });
          }}
          recallConfig={configs.chatConfig.recall}
          onRecallConfigChange={(recall) => {
            onConfigChange({
              ...configs,
              chatConfig: {
                ...configs.chatConfig,
                recall,
              },
            });
          }}
          description="从知识库检索内容"
        />
      </div>
      <div>
        <h4 className="mb-2 font-medium text-sm">输出变量</h4>
        <VariableConfig
          isEditable={false}
          isAddable={false}
          isDeletable={false}
          variables={configs.variables}
          onVariablesChange={(variables) => {
            onConfigChange({ ...configs, variables });
          }}
        />
      </div>
    </div>
  );
}

registerNodeConfig(TOOL_ATTRS.knowledgeRetrieval.id, ConfigComponent, defaultConfig);
