import type { VariableProps } from "@/lib/zod";

export type VariableValue = Record<string, string | number>;

export type VariableViewProps = {
  name: string;
  value?: string | number;
  icon?: React.ElementType;
};

export type VariableRefGroup = {
  nodeId: string; // source node id
  title: string; // source node title
  type: string; // source node type
  icon: React.FC<React.SVGProps<SVGSVGElement>>; // source node icon
  variables: VariableProps[]; // variables of source node
};
