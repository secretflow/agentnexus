import { CodeBlock } from "@/components/ui";
import { TOOL_ATTRS } from "@/lib/constants";
import type { ExecutePythonWorkConfig } from "@/lib/workflow";
import { UpsertVariableRefForm, VariableConfig, useVariableRefs } from "../../variable";
import { registerNodeConfig } from "../registry";

const defaultConfig: ExecutePythonWorkConfig = {
  code: `def main(arg1: str, arg2: str) -> dict:
    return {
        "result": arg1 + arg2,
    }`,
  params: [
    {
      name: "arg1",
      ref: null,
    },
    {
      name: "arg2",
      ref: null,
    },
  ],
  variables: [
    {
      name: "result",
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
  configs: ExecutePythonWorkConfig;
  onConfigChange: (configs: ExecutePythonWorkConfig) => void;
}) {
  const { availableVariableRefs } = useVariableRefs(nodeId);

  return (
    <div className="space-y-4">
      <div>
        <h4 className="mb-2 font-medium text-sm">输入变量</h4>
        <UpsertVariableRefForm
          availableVariableRefs={availableVariableRefs}
          variableRefs={configs.params}
          onValueChange={({ variableRefs }) => {
            onConfigChange({
              ...configs,
              params: variableRefs,
            });
          }}
        />
      </div>
      <div>
        <h4 className="mb-2 font-medium text-sm">代码</h4>
        <CodeBlock
          className="border border-gray-200"
          language="python"
          value={configs.code}
          onChange={(e) => {
            onConfigChange({ ...configs, code: e.target.value });
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

registerNodeConfig(TOOL_ATTRS.executePython.id, ConfigComponent, defaultConfig);
