import { z } from "zod";

export const VARIABLE_TYPES = ["string", "number"] as const;

export const VariableSchema = z.object({
  name: z.string().min(1).max(32).describe("The name of the variable."),
  type: z.enum(VARIABLE_TYPES).describe("The type of the variable."),
  required: z.boolean().describe("The required of the variable."),
  maxLength: z.number().optional().describe("The max length of the variable."),
  description: z.string().optional().describe("The description of the variable."),
});

export const VariableRefSchema = z.object({
  name: z.string().min(1).max(32).describe("The name of the variable."),
  ref: z
    .object({
      nodeId: z.string().describe("Id of the node to which the variable belongs."),
      variable: z.string().describe("The name of the variable."),
    })
    .nullable()
    .default(null)
    .describe("The reference of the variable."),
});

export type VariableType = (typeof VARIABLE_TYPES)[number];
export type VariableProps = z.infer<typeof VariableSchema>;
export type VariableRefProps = z.infer<typeof VariableRefSchema>;
