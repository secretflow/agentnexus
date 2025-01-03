import { z } from "zod";

export const NodeSchema = z.object({
  id: z.string().describe("The unique ID of the node."),
  shape: z.string().describe("The type of the node."),
  x: z.number().describe("The x position of the node."),
  y: z.number().describe("The y position of the node."),
  data: z.object({
    id: z.string().describe("The ID of the node."),
    title: z.string().describe("The title of the node."),
    type: z.string().describe("The type of the node."),
    description: z.string().nullable().default(null).describe("The description of the node."),
    configs: z.any().describe("The configurations of the node."),
  }),
});

export const EdgeSchema = z.object({
  id: z.string().describe("The unique ID of the edge."),
  shape: z.string().describe("The type of the edge."),
  source: z.object({
    cell: z.string().describe("The source node ID of the edge."),
    port: z.string().describe("The source port ID of the edge."),
  }),
  target: z.object({
    cell: z.string().describe("The target node ID of the edge."),
    port: z.string().describe("The target port ID of the edge."),
  }),
});

export const WorkflowSchema = z.object({
  id: z.string().describe("The unique ID of the workflow."),
  applicationId: z.string().describe("The application ID of the workflow."),
  content: z
    .object({
      nodes: z.array(NodeSchema).describe("The nodes of the workflow."),
      edges: z.array(EdgeSchema).describe("The edges of the workflow."),
    })
    .describe("The content of the workflow."),
  createdAt: z.date().describe("The created timestamp of the workflow."),
  updatedAt: z.date().describe("The updated timestamp of the workflow."),
});

export const UpsertWrokflowSchema = WorkflowSchema.pick({
  content: true,
});

export type NodeProps = z.infer<typeof NodeSchema>;
export type EdgeProps = z.infer<typeof EdgeSchema>;
export type GraphModelProps = { nodes: NodeProps[]; edges: EdgeProps[] };
export type WorkflowProps = z.infer<typeof WorkflowSchema>;
export type UpsertWorkflowProps = z.infer<typeof UpsertWrokflowSchema>;
