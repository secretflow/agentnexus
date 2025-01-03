import { ChatMessageRole, PromptEditor } from "@/components/editor";
import { ModelSelector } from "@/components/model";
import { NODE_ATTRS } from "@/lib/constants";
import type { LLMWorkConfig } from "@/lib/workflow";
import { VariableConfig, useVariableRefs } from "../../variable";
import { registerNodeConfig } from "../registry";

const defaultConfig: LLMWorkConfig = {
  model: {
    id: "gpt-4o-mini",
    provider: "openai",
  },
  system: "",
  prompt: "",
  variables: [
    {
      name: "text",
      type: "string",
      maxLength: 1024,
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
  configs: LLMWorkConfig;
  onConfigChange: (configs: LLMWorkConfig) => void;
}) {
  const { availableVariableRefs } = useVariableRefs(nodeId);

  return (
    <div className="space-y-4">
      <div>
        <h4 className="mb-2 font-medium text-sm">模型</h4>
        <ModelSelector
          type="language"
          value={configs.model}
          onChange={(model) => {
            onConfigChange({ ...configs, model });
          }}
        />
      </div>
      <div>
        <h4 className="mb-2 font-medium text-sm">提示词</h4>
        <PromptEditor
          availableVariableRefs={availableVariableRefs}
          role={ChatMessageRole.System}
          defaultValue={configs.system || ""}
          onChange={(val) => {
            onConfigChange({ ...configs, system: val });
          }}
        />
        <PromptEditor
          className="mt-2"
          availableVariableRefs={availableVariableRefs}
          role={ChatMessageRole.User}
          defaultValue={configs.prompt || ""}
          onChange={(val) => {
            onConfigChange({ ...configs, prompt: val });
          }}
        />
      </div>
      <div>
        <h4 className="mb-2 font-medium text-sm">输出变量</h4>
        <VariableConfig
          variables={configs.variables}
          onVariablesChange={(variables) => {
            onConfigChange({ ...configs, variables });
          }}
        />
      </div>
    </div>
  );
}

registerNodeConfig(NODE_ATTRS.llm.id, ConfigComponent, defaultConfig);
