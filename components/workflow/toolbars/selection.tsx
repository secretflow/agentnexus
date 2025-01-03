import { Button } from "@/components/ui";
import { useGraphInstance } from "@antv/xflow";
import { MousePointer, SquareDashedMousePointer } from "lucide-react";
import { useCallback, useState } from "react";

export function SelectionTool() {
  const [rubberband, setRubberband] = useState(false);
  const graph = useGraphInstance();

  const toggleSelectionState = useCallback(() => {
    if (graph) {
      if (rubberband) {
        graph.enablePanning();
        graph.setRubberbandModifiers("shift");
        setRubberband(false);
      } else {
        graph.disablePanning();
        graph.setRubberbandModifiers(null);
        setRubberband(true);
      }
    }
  }, [graph, rubberband]);

  return (
    <Button
      text={rubberband ? "拖拽" : "框选"}
      onClick={toggleSelectionState}
      className="px-2"
      variant="ghost"
      icon={
        rubberband ? (
          <MousePointer className="size-4" />
        ) : (
          <SquareDashedMousePointer className="size-4" />
        )
      }
    />
  );
}
