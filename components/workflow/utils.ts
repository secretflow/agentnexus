import { NODE_ATTRS, TOOL_ATTRS } from "@/lib/constants";

export function getPortProperties(position: "left" | "right") {
  return {
    position,
    markup: [
      // {
      //   tagName: "circle",
      //   selector: "outer",
      // },
      {
        tagName: "circle",
        selector: "inner",
      },
    ],
    attrs: {
      // outer: {
      //   r: 10,
      //   magnet: true,
      //   stroke: "transparent",
      //   fill: "transparent",
      // },
      inner: {
        r: 5,
        magnet: true,
        stroke: "#c2c8d5",
        strokeWidth: 1,
        fill: "#fff",
      },
    },
  };
}

export function getNodeAttr(type: string) {
  if (NODE_ATTRS.hasOwnProperty(type)) {
    return NODE_ATTRS[type as keyof typeof NODE_ATTRS];
  }
  if (TOOL_ATTRS.hasOwnProperty(type)) {
    return TOOL_ATTRS[type as keyof typeof TOOL_ATTRS];
  }
}
