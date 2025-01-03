import { Slash } from "@/components/icons";
import { cn } from "@/lib/utils";
import type { VariableRefProps } from "@/lib/zod";
import { useMemo } from "react";
import type { VariableRefGroup } from "./types";
import { useVariableRefs } from "./use-variable-refs";

export function VariableRefsViewer({
  nodeId,
  variableRefs,
  className,
}: {
  nodeId: string;
  variableRefs: VariableRefProps[];
  className?: string;
}) {
  const { availableVariableRefs } = useVariableRefs(nodeId);

  return (
    <ul className="space-y-1">
      {variableRefs.map((variableRef, index) => (
        <VariableRefItem
          key={index}
          variableRef={variableRef}
          availableVariableRefs={availableVariableRefs}
          className={className}
        />
      ))}
    </ul>
  );
}

function VariableRefItem({
  variableRef,
  availableVariableRefs,
  className,
}: {
  variableRef: VariableRefProps;
  availableVariableRefs: VariableRefGroup[];
  className?: string;
}) {
  const variableRefItem = useMemo(() => {
    const { ref } = variableRef;
    if (!ref) {
      return null;
    }

    const node = availableVariableRefs.find((v) => v.nodeId === ref.nodeId);
    if (!node) {
      return null;
    }

    const variableItem = node.variables.find((v) => v.name === ref.variable);
    if (!variableItem) {
      return null;
    }

    return {
      title: node.title,
      icon: node.icon,
      variable: variableItem,
    };
  }, [variableRef, availableVariableRefs]);

  return (
    <li
      className={cn(
        "group relative flex cursor-pointer items-center justify-between rounded-sm border px-2 py-1 text-gray-500",
        className,
      )}
    >
      {variableRefItem ? (
        <div className="flex items-center space-x-1 text-xs">
          <variableRefItem.icon className="size-4 text-gray-500" />
          <span>{variableRefItem.title}</span>
          <Slash />
          <span>{variableRefItem.variable.name}</span>
        </div>
      ) : (
        <span className="text-gray-500 text-xs">该变量无法引用</span>
      )}
    </li>
  );
}
