import { Book } from "@/components/icons";
import { VariableViewer } from "@/components/workflow/variable";
import { TOOL_ATTRS } from "@/lib/constants";
import { register } from "@antv/xflow";
import type { Node } from "@antv/xflow";
import { useGraphStore } from "@antv/xflow";
import { useEffect } from "react";
import { getPortProperties } from "../../utils";

const { id: shape, icon: Icon } = TOOL_ATTRS.knowledgeRetrieval;
const NODE_WIDTH = 280;
const NODE_HEIGHT = 68;
const NODE_VARIABLE_HEIGHT = 32;

const NodeComponent = ({ node }: { node: Node }) => {
  const data = node.getData();
  const updateNode = useGraphStore((state) => state.updateNode);
  const knowledgebases = data.configs.knowledgebases || [];

  useEffect(() => {
    updateNode(node.id, {
      width: NODE_WIDTH,
      height: NODE_HEIGHT + NODE_VARIABLE_HEIGHT * knowledgebases.length,
    });
  }, [knowledgebases]);

  return (
    <div className="node h-full w-full rounded-lg bg-white text-[0.8125rem] text-gray-700 leading-5 ring-1 ring-gray-700/10">
      <div className="flex items-center p-4 pb-0">
        <Icon className="size-5" />
        <div className="ml-2 font-medium">{data.title}</div>
      </div>
      <div className="p-4">
        <VariableViewer
          className="bg-gray-50"
          variables={knowledgebases.map(({ name }: { name: string }) => ({
            icon: Book,
            name: name,
          }))}
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
