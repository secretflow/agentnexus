import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui";
import type { NodeProps } from "@/lib/zod";
import { useGraphEvent, useGraphStore } from "@antv/xflow";
import { useMemo, useState } from "react";
import { nodeConfigRegistry } from "./nodes";
import { getNodeAttr } from "./utils";

export function NodeConfigPanel() {
  const [open, setOpen] = useState(false);
  const [nodeData, setNodeData] = useState<NodeProps["data"]>();
  const getNodes = useGraphStore((state) => state.getNodes);
  const updateNode = useGraphStore((state) => state.updateNode);

  useGraphEvent("node:click", ({ e, node }) => {
    if (e.target.getAttribute("port") !== null) return;
    const data = getNodes().find((n) => n.id === node.id)?.data as NodeProps["data"];
    setNodeData(data);
    setOpen(true);
  });

  const NodeIcon = useMemo(() => {
    if (!nodeData) return null;
    const icon = getNodeAttr(nodeData.type)?.icon;
    if (!icon) return null;
    return icon;
  }, [nodeData]);

  const ConfigComponent = useMemo(() => {
    if (!nodeData) return null;

    const register = nodeConfigRegistry.get(nodeData.type);
    if (!register) return null;

    return register.component;
  }, [nodeData]);

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleConfigsChange = (configs: any) => {
    if (nodeData) {
      const id = nodeData.id;
      setNodeData({ ...nodeData, configs });
      updateNode(id, { data: { ...nodeData, configs } });
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen} modal={false}>
      <SheetContent className="top-[109px] p-0 sm:w-[540px]">
        <SheetHeader className="px-4 py-2">
          <SheetTitle className="flex items-center text-gray-700">
            {NodeIcon && <NodeIcon className="mr-2 size-5" />}
            {nodeData?.title}
          </SheetTitle>
          <SheetDescription>{nodeData?.description}</SheetDescription>
        </SheetHeader>
        <div className="border-t p-4">
          {nodeData?.configs && ConfigComponent && (
            <ConfigComponent
              nodeId={nodeData.id}
              configs={nodeData.configs}
              // biome-ignore lint/suspicious/noExplicitAny: <explanation>
              onConfigChange={(configs: any) => handleConfigsChange(configs)}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
