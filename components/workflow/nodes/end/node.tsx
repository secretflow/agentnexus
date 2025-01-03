import { NODE_ATTRS } from "@/lib/constants";
import type { VariableRefProps } from "@/lib/zod";
import { register } from "@antv/xflow";
import type { Node } from "@antv/xflow";
import { useGraphStore } from "@antv/xflow";
import { useEffect } from "react";
import { getPortProperties } from "../../utils";
import { VariableRefsViewer } from "../../variable";

const NODE_WIDTH = 280;
const NODE_HEIGHT = 64;
const NODE_VARIABLE_HEIGHT = 30;
const { id: shape, icon: Icon } = NODE_ATTRS.end;

const NodeComponent = ({ node }: { node: Node }) => {
  const updateNode = useGraphStore((state) => state.updateNode);
  const data = node.getData();
  const variableRefs = data.configs.variableRefs.filter((v: VariableRefProps) => !!v.ref);

  useEffect(() => {
    updateNode(node.id, {
      width: NODE_WIDTH,
      height: NODE_HEIGHT + NODE_VARIABLE_HEIGHT * variableRefs.length,
    });
  }, [variableRefs]);

  return (
    <div className="node h-full w-full rounded-lg bg-white text-[0.8125rem] text-gray-700 leading-5 ring-1 ring-gray-700/10">
      <div className="flex items-center p-4 pb-0">
        <Icon className="size-5 text-gray-500" />
        <div className="ml-2 font-medium">{data.title}</div>
      </div>
      <div className="p-4">
        <VariableRefsViewer variableRefs={variableRefs} nodeId={node.id} className="bg-gray-50" />
      </div>
    </div>
  );
};

register({
  shape,
  component: NodeComponent,
  width: NODE_WIDTH,
  height: NODE_HEIGHT,
  effect: ["data"], // re-render when data changes
  ports: {
    groups: {
      left: getPortProperties("left"),
    },
    items: [
      {
        group: "left",
        id: "port_in",
      },
    ],
  },
});
