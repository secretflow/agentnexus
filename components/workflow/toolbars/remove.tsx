import { Button } from "@/components/ui";
import { useGraphEvent, useGraphStore, useKeyboard } from "@antv/xflow";
import { Trash2 } from "lucide-react";
import { useCallback, useContext } from "react";
import { GraphContext } from "../graph-provider";

export function RemoveTool() {
  const { nodes } = useContext(GraphContext);
  const removeNodes = useGraphStore((state) => state.removeNodes);
  const removeEdges = useGraphStore((state) => state.removeEdges);

  const removeSelectedNodes = useCallback(() => {
    const selected = nodes.filter((node) => node.selected);
    const ids = selected.map((node) => node.id!);
    removeNodes(ids);
  }, [nodes]);

  useGraphEvent("edge:mouseenter", ({ edge }) => {
    edge.addTools([
      {
        name: "button-remove",
        args: {
          distance: 0.5,
          markup: [
            {
              tagName: "circle",
              selector: "button",
              attrs: {
                r: 7,
                fill: "#000",
                cursor: "pointer",
              },
            },
            {
              tagName: "path",
              selector: "icon",
              attrs: {
                d: "M -3 -3 3 3 M -3 3 3 -3",
                fill: "none",
                stroke: "#FFFFFF",
                "stroke-width": 2,
                "pointer-events": "none",
              },
            },
          ],
          onClick: ({ cell }: { cell: { id: string } }) => {
            removeEdges([cell.id]);
          },
        },
      },
    ]);
  });

  useGraphEvent("edge:mouseleave", ({ edge }) => {
    edge.removeTools();
  });

  useKeyboard(["delete", "backspace"], () => removeSelectedNodes());

  const handleClick = () => {
    removeSelectedNodes();
  };

  return (
    <Button
      text="删除"
      onClick={handleClick}
      className="px-2"
      variant="ghost"
      icon={<Trash2 className="size-4" />}
    />
  );
}
