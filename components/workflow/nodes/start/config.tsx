import { NODE_ATTRS } from "@/lib/constants";
import type { StartWorkConfig } from "@/lib/workflow";
import { VariableConfig } from "../../variable";
import { registerNodeConfig } from "../registry";

const defaultConfig: StartWorkConfig = {
  variables: [],
};

function ConfigComponent({
  configs,
  onConfigChange,
}: {
  configs: StartWorkConfig;
  onConfigChange: (configs: StartWorkConfig) => void;
}) {
  return (
    <div>
      <h4 className="mb-2 font-medium text-sm">输入变量</h4>
      <VariableConfig
        variables={configs.variables}
        onVariablesChange={(variables) => {
          onConfigChange({ ...configs, variables });
        }}
      />
    </div>
  );
}

registerNodeConfig(NODE_ATTRS.start.id, ConfigComponent, defaultConfig);
