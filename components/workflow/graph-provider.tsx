"use client";

import { type EdgeOptions, type NodeOptions, useGraphStore } from "@antv/xflow";
import { useParams } from "next/navigation";
import { type ReactNode, Suspense, createContext, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

export const GraphContext = createContext<{
  nodes: NodeOptions[];
  edges: EdgeOptions[];
  consolePanelOpen: boolean;

  persistGraphStore: () => Promise<void>;
  setConsolePanelOpen: (open: boolean) => void;
}>({
  nodes: [],
  edges: [],
  consolePanelOpen: false,

  persistGraphStore: async () => {},
  setConsolePanelOpen: () => {},
});

export function GraphProvider({ children }: { children: ReactNode }) {
  const { applicationId, workspaceId } = useParams<{
    applicationId: string;
    workspaceId: string;
  }>();

  const [consolePanelOpen, setConsolePanelOpen] = useState(false);

  const nodes = useGraphStore((state) => state.nodes);
  const edges = useGraphStore((state) => state.edges);
  const getNodes = useGraphStore((state) => state.getNodes);
  const getEdges = useGraphStore((state) => state.getEdges);

  const persistGraphStore = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/applications/${applicationId}/workflow?workspaceId=${workspaceId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: { nodes: getNodes(), edges: getEdges() },
          }),
        },
      );
      if (res.ok) {
        const json = await res.json();
        return json;
      } else {
        const { message } = await res.json();
        toast.error(message);
      }
    } catch (e) {
      toast.error("Workflow 保存失败，请稍后重试！");
    }
  }, [nodes, edges, applicationId, workspaceId]);

  const debouncedPersistGraphStore = useDebouncedCallback(persistGraphStore, 2000);

  useEffect(() => {
    debouncedPersistGraphStore();
  }, [nodes, edges]);

  return (
    <Suspense>
      <GraphContext.Provider
        value={{
          nodes,
          edges,
          consolePanelOpen,
          persistGraphStore,
          setConsolePanelOpen,
        }}
      >
        {children}
      </GraphContext.Provider>
    </Suspense>
  );
}
