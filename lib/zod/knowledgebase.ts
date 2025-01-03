import { ALLOWED_KNOWLEDGE_FILE_TYPES, MAX_KNOWLEDGE_FILE_SIZE } from "@/lib/constants";
import { getFileExtension } from "@/lib/utils";
import { z } from "zod";
import { ModelSchema } from "./model";

export const KnowledgebaseSchema = z.object({
  id: z.string().describe("The id of the knowledgebase."),
  name: z.string().describe("The name of the knowledgebase."),
  userId: z.string().describe("The user ID of the knowledgebase."),
  user: z.object({
    id: z.string(),
    name: z.string().nullable(),
    image: z.string().nullable(),
  }),
  workspaceId: z.string().describe("The workspace ID of the knowledgebase."),
  image: z.string().nullable().default(null).describe("The logo of the knowledgebase."),
  description: z
    .string()
    .nullable()
    .default(null)
    .describe("The description of the knowledgebase."),
  model: ModelSchema.describe("The model of the knowledgebase."),
  knowledgebaseResources: z
    .array(z.object({ id: z.string() }))
    .describe("The resources of the knowledgebase."),
  createdAt: z.date().describe("The time the knowledgebase was created"),
  updatedAt: z.date().describe("The time the knowledgebase was last updated"),
});

export const CreateKnowledgebaseSchema = z.object({
  name: z.string().min(1, { message: "请输入知识库名称" }).max(32),
  image: z.string().optional(),
  description: z.string().max(200).optional(),
  model: ModelSchema,
});

export const SplitConfigSchema = z.object({
  chunkSize: z.number().min(1).optional().describe("The chunkSize of the split config."),
  chunkOverlap: z.number().min(0).optional().describe("The chunkOverlap of the split config."),
  separators: z.string().optional().describe("The separators of the split config."),
});

export const KnowledgebaseResourceSchema = z.object({
  id: z.string().describe("The id of the resource."),
  knowledgebaseId: z.string().describe("The knowledgebaseId of the resource."),
  name: z.string().describe("The name of the resource."),
  enabled: z.boolean().describe("The enabled of the resource."),
  metadata: z
    .object({
      size: z.number().describe("The size of the resource."),
      filename: z.string().describe("The filename of the resource."),
      fileType: z.string().describe("The fileType of the resource."),
    })
    .describe("The metadata of the resource."),
  splitConfigs: SplitConfigSchema.describe("The split configs of the resource."),
  embeddings: z
    .array(
      z.object({
        id: z.string().describe("The id of the embedding."),
        content: z.string().describe("The content of the embedding."),
      }),
    )
    .describe("The embeddings of the resource."),
  createdAt: z.date().describe("The time the resource was created"),
  updatedAt: z.date().describe("The time the resource was last updated"),
});

export const KnowledgebaseResourceFileSchema = z
  .instanceof(File, {
    message: "请选择要上传的文件",
  })
  .refine((file) => file.size <= MAX_KNOWLEDGE_FILE_SIZE, {
    message: "文件大小限制为 1GB",
  })
  .refine((file) => ALLOWED_KNOWLEDGE_FILE_TYPES.includes(getFileExtension(file.name)), {
    message: "只支持上传 TXT、PDF、DOCX、HTML、MARKDOWN 格式文件",
  });

export const CreateKnowledgebaseResourceSchema = KnowledgebaseResourceSchema.pick({
  enabled: true,
  metadata: true,
  splitConfigs: true,
}).extend({
  name: z.string().min(1, { message: "请输入文档名称" }).max(32),
  file: KnowledgebaseResourceFileSchema,
});

export const UpdateKnowledgebaseResourceSchema = CreateKnowledgebaseResourceSchema.pick({
  enabled: true,
  metadata: true,
  splitConfigs: true,
  name: true,
})
  .partial()
  .extend({
    id: z.string(),
  });

export const EmbeddingSchema = z.object({
  id: z.string().describe("The id of the embeding."),
  resourceId: z.string().describe("The resourceId of the embedding."),
  knowledgebaseId: z.string().describe("The knowledgebaseId of the embedding."),
  content: z.string().describe("The content of the embedding."),
  embedding: z.string().describe("The embedding of the content."),
});

export type KnowledgebaseProps = z.infer<typeof KnowledgebaseSchema>;
export type CreateKnowledgebaseProps = z.infer<typeof CreateKnowledgebaseSchema>;

export type KnowledgebaseResourceProps = z.infer<typeof KnowledgebaseResourceSchema>;
export type CreateKnowledgebaseResourceProps = z.infer<typeof CreateKnowledgebaseResourceSchema>;
export type UpdateKnowledgebaseResourceProps = z.infer<typeof UpdateKnowledgebaseResourceSchema>;

export type EmbeddingProps = z.infer<typeof EmbeddingSchema>;

export type SplitConfigProps = z.infer<typeof SplitConfigSchema>;

export type RetrievalResultProps = {
  id: string;
  content: string;
  similarity: number;
  resourceId: string;
  knowledgebaseId: string;
};
