import type { GraphModelProps, NodeProps } from "@/lib/zod";

type Cell = { cell: string };

export function findChildrens(model: GraphModelProps, nodeId: string): string[] {
  return model.edges
    .filter((edge) => (edge.source as Cell).cell === nodeId)
    .map((edge) => (edge.target as Cell).cell);
}

export function findAncestor(model: GraphModelProps, nodeId: string): string[] {
  const parents: string[] = [];
  const queue: string[] = [nodeId];
  const visited: { [key: string]: boolean } = {};

  while (queue.length > 0) {
    const currentNodeId = queue.shift()!;
    if (visited[currentNodeId]) continue;
    visited[currentNodeId] = true;

    const parentNodes = model.edges
      .filter((edge) => (edge.target as Cell).cell === currentNodeId)
      .map((edge) => (edge.source as Cell).cell);
    parents.push(...parentNodes);
    queue.push(...parentNodes);
  }
  return Array.from(new Set(parents));
}

// Find the single parent node of the given node
// Ex: A -> B, A -> C, B -> D, C -> D, findSingleParent(model, "D") => "A"
export function findSingleParent(model: GraphModelProps, nodeId: string): string | null {
  const parents = model.edges
    .filter((edge) => (edge.target as Cell).cell === nodeId)
    .map((edge) => (edge.source as Cell).cell);

  if (parents.length === 0) {
    return null;
  }

  if (parents.length === 1) {
    return parents[0];
  }

  const ancestors = parents.map((parent) => findAncestor(model, parent));
  const first = ancestors[0]!;
  return first.find((node) => ancestors.every((ancestor) => ancestor.includes(node))) || null;
}

export function breadthFirstSearch(
  model: GraphModelProps,
  startNodeId: string,
  iterator: (node: NodeProps) => void,
) {
  const visited: Set<string> = new Set();
  const queue: string[] = [startNodeId];

  while (queue.length > 0) {
    const nodeId = queue.shift()!;

    if (!visited.has(nodeId)) {
      visited.add(nodeId);

      iterator(model.nodes.find((node) => node.id === nodeId)!);

      const adjacentNodes = findChildrens(model, nodeId);

      queue.push(...adjacentNodes);
    }
  }
}
