import { NODE_ATTRS } from "@/lib/constants";
import { uuid } from "@/lib/utils";
import { breadthFirstSearch, findChildrens, findSingleParent } from "@/lib/utils";
import type { GraphModelProps } from "@/lib/zod";
import {
  ConditionalFlow,
  ParallelFlow,
  RepeatFlow,
  SequentialFlow,
  type WorkFlow,
} from "../workflow";
import { workRegistry } from "./registry";

export function compileDagToWorkflow(
  model: GraphModelProps,
  startupOptions: Record<string, string | number>,
): WorkFlow {
  // There must be a start node and an end node
  const start = model.nodes.find((node) => node.data.type === NODE_ATTRS.start.id);
  const end = model.nodes.find((node) => node.data.type === NODE_ATTRS.end.id);
  if (!start || !end) {
    throw new Error("Start and end node are required");
  }

  const rootWorkflow = new SequentialFlow(uuid());
  const workflowRecords = new Map<string, SequentialFlow>();

  workflowRecords.set(start.id!, rootWorkflow);

  breadthFirstSearch(model, start.id!, (node) => {
    const nodeId = node.id!;
    const nodeType = node.data.type;
    const childNodes = findChildrens(model, nodeId);

    const workClass = workRegistry.get(nodeType);
    if (!workClass) {
      throw new Error(`Unknown work type: ${nodeType}`);
    }
    const work = new workClass(nodeId, node.data.configs);

    if (nodeType === NODE_ATTRS.start.id) {
      work.setStartupOptions(startupOptions);
    }

    let workflow = workflowRecords.get(nodeId);
    if (!workflow) {
      const uniqueParent = findSingleParent(model, nodeId);
      if (uniqueParent) {
        workflow = workflowRecords.get(uniqueParent);
      }
    }
    if (!workflow) {
      throw new Error(`Unable to find workflow for node: ${nodeId}`);
    }
    workflowRecords.set(nodeId, workflow);

    if (nodeType === NODE_ATTRS.condition.id) {
      if (childNodes.length === 2) {
        const conditionWorkflow = new ConditionalFlow(uuid());
        const thenWorkflow = new SequentialFlow(uuid());
        const elseWorkflow = new SequentialFlow(uuid());
        conditionWorkflow.withWork(work);
        conditionWorkflow.then(thenWorkflow);
        conditionWorkflow.otherwise(elseWorkflow);
        workflow.addWork(conditionWorkflow);
        workflowRecords.set(childNodes[0], thenWorkflow);
        workflowRecords.set(childNodes[1], elseWorkflow);
      } else {
        throw new Error("Condition node must have 2 children");
      }
    } else if (nodeType === NODE_ATTRS.repeat.id) {
      const repeatWorkflow = new RepeatFlow(uuid());
      repeatWorkflow.withWork(work);
      repeatWorkflow.withTimes(3);
      workflow.addWork(repeatWorkflow);
    } else {
      workflow.addWork(work);
    }

    if (childNodes.length > 1 && nodeType !== NODE_ATTRS.condition.id) {
      const parallelWorkflow = new ParallelFlow(uuid());
      childNodes.forEach((childNodeId) => {
        const childWorkflow = new SequentialFlow(uuid());
        parallelWorkflow.addWork(childWorkflow);
        workflowRecords.set(childNodeId, childWorkflow);
      });
      workflow.addWork(parallelWorkflow);
    }
  });

  return rootWorkflow;
}
