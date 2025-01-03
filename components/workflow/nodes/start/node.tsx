import { VariableList } from "@/components/workflow/variable";
import { NODE_ATTRS } from "@/lib/constants";
import { register } from "@antv/xflow";
import type { Node } from "@antv/xflow";
import { useGraphStore } from "@antv/xflow";
import { useEffect } from "react";
import { getPortProperties } from "../../utils";

const NODE_WIDTH = 280;
const NODE_HEIGHT = 68;
const NODE_VARIABLE_HEIGHT = 32;
const { id: shape, icon: Icon } = NODE_ATTRS.start;

const NodeComponent = ({ node }: { node: Node }) => {
  const updateNode = useGraphStore((state) => state.updateNode);
  const data = node.getData();
  const variables = data.configs.variables;

  useEffect(() => {
    updateNode(node.id, {
      width: NODE_WIDTH,
      height: NODE_HEIGHT + NODE_VARIABLE_HEIGHT * variables.length,
    });
  }, [variables]);

  return (
    <div className="node h-full w-full rounded-lg bg-white text-[0.8125rem] text-gray-700 leading-5 ring-1 ring-gray-700/10">
      <div className="flex items-center p-4 pb-0">
        <Icon className="size-5 text-gray-500" />
        <div className="ml-2 font-medium">{data.title}</div>
      </div>
      <div className="p-4">
        <VariableList
          className="bg-gray-50"
          variables={variables}
          isEditable={false}
          isDeletable={false}
        />
      </div>
    </div>
  );
};

register({
  shape,
  component: NodeComponent,
  width: NODE_WIDTH,
  height: NODE_HEIGHT,
  effect: ["data"],
  ports: {
    groups: {
      right: getPortProperties("right"),
    },
    items: [
      {
        group: "right",
        id: "port_out",
      },
    ],
  },
});
