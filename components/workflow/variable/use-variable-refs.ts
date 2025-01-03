import { findAncestor } from "@/lib/utils";
import type { EdgeProps, NodeProps } from "@/lib/zod";
import { useGraphStore } from "@antv/xflow";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { getNodeAttr } from "../utils";
import type { VariableRefGroup } from "./types";

export function useVariableRefs(nodeId: string) {
  const nodes = useGraphStore((state) => state.nodes);
  const edges = useGraphStore((state) => state.edges);
  const getNodes = useGraphStore((state) => state.getNodes);
  const getEdges = useGraphStore((state) => state.getEdges);

  const [availableVariableRefs, setAvailableVariableRefs] = useState<VariableRefGroup[]>([]);

  const getAvailableVariableRefs = () => {
    const nodes = getNodes() as NodeProps[];
    const edges = getEdges() as EdgeProps[];
    const ancestor = findAncestor({ nodes, edges }, nodeId);
    const vars = ancestor
      .map((id) => {
        const node = nodes.find((n) => n.id === id);
        if (node) {
          return {
            nodeId: id,
            title: node.data.title,
            type: node.data.type,
            icon: getNodeAttr(node.data.type)?.icon,
            variables: node.data?.configs?.variables || [],
          };
        }
      })
      .filter((v) => v && v.variables.length > 0) as VariableRefGroup[];
    setAvailableVariableRefs(vars);
  };

  const debouncedGetAvailableVariableRefs = useDebouncedCallback(getAvailableVariableRefs, 500);

  useEffect(() => {
    debouncedGetAvailableVariableRefs();
  }, [nodes, edges]);

  return {
    availableVariableRefs,
  };
}
