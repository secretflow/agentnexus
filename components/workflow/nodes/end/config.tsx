import { NODE_ATTRS } from "@/lib/constants";
import type { EndWorkConfig } from "@/lib/workflow";
import { UpsertVariableRefForm, useVariableRefs } from "../../variable";
import { registerNodeConfig } from "../registry";

const defaultConfig: EndWorkConfig = {
  variableRefs: [],
};

function ConfigComponent({
  nodeId,
  configs,
  onConfigChange,
}: {
  nodeId: string;
  configs: EndWorkConfig;
  onConfigChange: (configs: EndWorkConfig) => void;
}) {
  const { availableVariableRefs } = useVariableRefs(nodeId);

  return (
    <div>
      <h4 className="mb-2 font-medium text-sm">输出变量</h4>
      <UpsertVariableRefForm
        availableVariableRefs={availableVariableRefs}
        variableRefs={configs.variableRefs}
        onValueChange={({ variableRefs }) => {
          onConfigChange({
            ...configs,
            variableRefs,
          });
        }}
      />
    </div>
  );
}

registerNodeConfig(NODE_ATTRS.end.id, ConfigComponent, defaultConfig);
