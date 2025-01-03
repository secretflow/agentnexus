import { Graph } from "@antv/xflow";

Graph.registerEdge(
  "dag-edge",
  {
    inherit: "edge",
    attrs: {
      line: {
        stroke: "#8f8f8f",
        strokeWidth: 1,
        targetMarker: {
          name: "classic",
          size: 8,
        },
      },
    },
    zIndex: -1,
  },
  true,
);
