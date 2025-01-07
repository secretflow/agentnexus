import { ChatMessageRole, PromptEditor } from "@/components/editor";
import { useModelConfigModal } from "@/components/modals";
import { ModelSelector } from "@/components/model";
import { Button } from "@/components/ui";
import { DEFAULT_MODEL, DEFAULT_MODEL_CONFIG, NODE_ATTRS } from "@/lib/constants";
import type { LLMWorkConfig } from "@/lib/workflow";
import { Settings2 } from "lucide-react";
import { VariableConfig, useVariableRefs } from "../../variable";
import { registerNodeConfig } from "../registry";

const defaultConfig: LLMWorkConfig = {
  model: DEFAULT_MODEL,
  modelSettings: DEFAULT_MODEL_CONFIG,
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
  const { ModelConfigModal, setShowModelConfigModal } = useModelConfigModal({
    config: configs.modelSettings,
    onSubmit: (modelSettings) => {
      onConfigChange({ ...configs, modelSettings });
    },
  });

  return (
    <div className="space-y-4">
      <div>
        <h4 className="mb-2 font-medium text-sm">模型</h4>
        <div className="flex items-center space-x-2">
          <ModelSelector
            type="language"
            value={configs.model}
            onChange={(model) => {
              onConfigChange({ ...configs, model });
            }}
            className="w-[308px]"
            commandClassName="w-[308px]"
          />
          <Button
            variant="secondary"
            className="size-8 px-0"
            onClick={() => {
              setShowModelConfigModal(true);
            }}
            icon={<Settings2 className="size-4 text-gray-500" />}
          />
        </div>
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
      <ModelConfigModal />
    </div>
  );
}

registerNodeConfig(NODE_ATTRS.llm.id, ConfigComponent, defaultConfig);
