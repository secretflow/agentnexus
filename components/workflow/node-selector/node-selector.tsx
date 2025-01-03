import { uuid } from "@/lib/utils";
import { useGraphEvent, useGraphStore } from "@antv/xflow";
import { createElement, useRef } from "react";
import { type Root, createRoot } from "react-dom/client";
import tippy, { type Instance, type Props } from "tippy.js";
import { nodeConfigRegistry } from "../nodes";
import { getNodeAttr } from "../utils";
import { NodeSelectorPanel } from "./node-selector-panel";

export function NodeSelector() {
  const hoverRef = useRef<Instance<Props>>();
  const rootRef = useRef<Root>();

  const addNodes = useGraphStore((state) => state.addNodes);
  const addEdges = useGraphStore((state) => state.addEdges);

  useGraphEvent("node:port:click", ({ e, node, port }) => {
    tippy(e.target, {
      appendTo: () => document.body,
      showOnCreate: true,
      interactive: true,
      trigger: "manual",
      placement: "top-start",
      content: "<div id='node-selector-card-anchor' class='-mx-[9px] -my-[5px]'></div>",
      allowHTML: true,
      theme: "light",
      arrow: false,
      onMount(instance) {
        const anchor = instance.popper.querySelector("#node-selector-card-anchor");
        if (anchor) {
          rootRef.current = createRoot(anchor);
          rootRef.current.render(
            createElement(NodeSelectorPanel, {
              onSelect: (type: string) => {
                const attrs = getNodeAttr(type);
                const configs = nodeConfigRegistry.get(type)?.defaultConfig || {};
                const position = node.position();
                const sourceId = node.id;
                const targetId = uuid();

                addNodes([
                  {
                    id: targetId,
                    x: position.x + 400,
                    y: position.y,
                    shape: type,
                    data: { id: targetId, title: attrs?.name, type, description: "", configs },
                  },
                ]);
                addEdges([
                  {
                    id: uuid(),
                    shape: "dag-edge",
                    source: { cell: sourceId, port },
                    target: { cell: targetId, port: "port_in" },
                  },
                ]);

                instance.hide();
              },
            }),
          );
        }
      },
      onHide() {
        if (rootRef.current) {
          rootRef.current.unmount();
          rootRef.current = undefined;
        }
      },
    });
  });

  useGraphEvent("node:port:mouseenter", (evt) => {
    hoverRef.current = tippy(evt.e.target as Element, {
      appendTo: () => document.body,
      content: "<strong>点击</strong>添加<br/><strong>拖拽</strong>连接",
      showOnCreate: true,
      interactive: true,
      trigger: "manual",
      placement: "left",
      allowHTML: true,
      animation: "scale",
      theme: "light",
    });
  });

  useGraphEvent("node:port:mouseleave", () => {
    if (hoverRef.current) {
      hoverRef.current.destroy();
    }
  });

  return null;
}
