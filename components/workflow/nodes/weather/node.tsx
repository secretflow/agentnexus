import { VariableViewer } from "@/components/workflow/variable";
import { TOOL_ATTRS } from "@/lib/constants";
import { register } from "@antv/xflow";
import type { Node } from "@antv/xflow";
import { getPortProperties } from "../../utils";

const { id: shape, icon: Icon } = TOOL_ATTRS.weather;

const NodeComponent = ({ node }: { node: Node }) => {
  const data = node.getData();

  return (
    <div className="node h-full w-full rounded-lg bg-white text-[0.8125rem] text-gray-700 leading-5 ring-1 ring-gray-700/10">
      <div className="flex items-center p-4 pb-0">
        <Icon className="size-5" />
        <div className="ml-2 font-medium">{data.title}</div>
      </div>
      <div className="p-4">
        <VariableViewer
          className="bg-gray-50"
          variables={[
            {
              name: "city",
            },
          ]}
        />
      </div>
    </div>
  );
};

register({
  shape,
  component: NodeComponent,
  width: 280,
  height: 100,
  effect: ["data"],
  ports: {
    groups: {
      left: getPortProperties("left"),
      right: getPortProperties("right"),
    },
    items: [
      {
        group: "left",
        id: "port_in",
      },
      {
        group: "right",
        id: "port_out",
      },
    ],
  },
});
