import { z } from "zod";

export const ModelSchema = z.object({
  id: z.string({ required_error: "请选择模型" }).describe("The modelId of the model."),
  description: z.string().optional().describe("The description of the model."),
  provider: z.string().describe("The provier of the model."),
});

export const ModelProviderSchema = z.object({
  name: z.string().describe("The name of the model provider."),
  models: z.array(ModelSchema).describe("The models provided by the model provider."),
});

export type ModelProps = z.infer<typeof ModelSchema>;
export type ModelProviderProps = z.infer<typeof ModelProviderSchema>;
