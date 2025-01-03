import { NODE_ATTRS } from "@/lib/constants";
import { useWorkflow } from "@/lib/swr";
import { uuid } from "@/lib/utils";
import type { GraphModelProps } from "@/lib/zod";
import { useGraphStore } from "@antv/xflow";
import { useCallback, useEffect } from "react";

export function GraphInitializer() {
  const initData = useGraphStore((state) => state.initData);

  const { workflow, loading } = useWorkflow();

  const addInitialNodeIfEmpty = useCallback(() => {
    if (workflow) {
      if (workflow.content.nodes.length === 0) {
        const model = getInitialGraphModel();
        initData(model);
      } else {
        initData(workflow.content);
      }
    }
  }, [workflow]);

  useEffect(() => {
    if (!loading && workflow) {
      addInitialNodeIfEmpty();
    }
  }, [workflow, loading]);

  return null;
}

function getInitialGraphModel(): GraphModelProps {
  const { id: type, name } = NODE_ATTRS.start;
  const id = uuid();
  return {
    nodes: [
      {
        id,
        shape: type,
        x: 0,
        y: 0,
        data: {
          id,
          title: name,
          type,
          description: "",
          configs: {
            variables: [],
          },
        },
      },
    ],
    edges: [],
  };
}
