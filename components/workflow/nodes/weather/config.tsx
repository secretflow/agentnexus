import { VariableEditor } from "@/components/editor";
import { TOOL_ATTRS } from "@/lib/constants";
import type { WeatherWorkConfig } from "@/lib/workflow";
import { VariableConfig, useVariableRefs } from "../../variable";
import { registerNodeConfig } from "../registry";

const defaultConfig: WeatherWorkConfig = {
  city: "",
  variables: [
    {
      name: "temp_c",
      type: "number",
      required: false,
      description: "温度(摄氏度)",
    },
    {
      name: "wind_mph",
      type: "number",
      required: false,
      description: "风速(英里每小时)",
    },
    {
      name: "pressure_mb",
      type: "number",
      required: false,
      description: "气压(毫巴)",
    },
  ],
};

function ConfigComponent({
  nodeId,
  configs,
  onConfigChange,
}: {
  nodeId: string;
  configs: WeatherWorkConfig;
  onConfigChange: (configs: WeatherWorkConfig) => void;
}) {
  const { availableVariableRefs } = useVariableRefs(nodeId);

  return (
    <div className="space-y-4">
      <div>
        <h4 className="mb-2 font-medium text-sm">城市</h4>
        <VariableEditor
          defaultValue={configs.city || ""}
          availableVariableRefs={availableVariableRefs}
          onChange={(value) => {
            onConfigChange({ ...configs, city: value });
          }}
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

registerNodeConfig(TOOL_ATTRS.weather.id, ConfigComponent, defaultConfig);
