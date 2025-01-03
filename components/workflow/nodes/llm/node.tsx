import { ModelViewer } from "@/components/model";
import { NODE_ATTRS } from "@/lib/constants";
import { register } from "@antv/xflow";
import type { Node } from "@antv/xflow";
import { getPortProperties } from "../../utils";

const { id: shape, icon: Icon } = NODE_ATTRS.llm;

const NodeComponent = ({ node }: { node: Node }) => {
  const data = node.getData();

  return (
    <div className="node h-full w-full rounded-lg bg-white text-[0.8125rem] text-gray-700 leading-5 ring-1 ring-gray-700/10">
      <div className="flex items-center p-4 pb-0">
        <Icon className="size-5 text-gray-500" />
        <div className="ml-2 font-medium">{data.title}</div>
      </div>
      <div className="p-4">
        <ModelViewer model={data.configs.model} />
      </div>
    </div>
  );
};

register({
  shape,
  component: NodeComponent,
  width: 280,
  height: 100,
  effect: ["data"], // re-render when data changes
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
