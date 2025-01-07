import { z } from "zod";
import { ModelSchema } from "./model";

const ChatToolSchema = z.object({
  id: z.string().describe("The id of the tool."),
  enabled: z.boolean().describe("The enabled of the tool."),
});

const ChatKnowledgebaseSchema = z.object({
  id: z.string().describe("The id of the knowledgebase."),
  name: z.string().describe("The name of the knowledgebase."),
  enabled: z.boolean().describe("The enabled of the knowledgebase."),
});

export const RecallConfigSchema = z.object({
  topK: z.number().describe("The topK of the recall."),
  score: z.number().describe("The score of the recall."),
  semantics: z.number().describe("The semantics of the recall."),
});

export const ModelConfigSchema = z.object({
  temperature: z.number().min(0).max(1).describe("The temperature of the model."),
  maxTokens: z.number().min(1).max(4096).describe("The maxTokens of the model."),
  presencePenalty: z.number().min(0).max(1).describe("The presencePenalty of the model."),
  frequencyPenalty: z.number().min(0).max(1).describe("The frequencyPenalty of the model."),
});

export const ChatConfigSchema = z.object({
  recall: RecallConfigSchema.optional().describe("The recall of the chatconfig."),
  modelSetting: ModelConfigSchema.optional().describe("The model settings of the chatconfig."),
});

export const ChatAppSchema = z.object({
  id: z.string().describe("The unique ID of the chatapp."),
  applicationId: z.string().describe("The application ID of the chatapp."),
  model: ModelSchema.describe("The model of the chatapp."),
  tools: z.array(ChatToolSchema).describe("The tools of the chatapp."),
  knowledgebases: z.array(ChatKnowledgebaseSchema).describe("The knowledgebases of the chatapp."),
  config: ChatConfigSchema.describe("The config of the chatapp."),
  prompt: z.string().describe("The prompt of the chatapp."),
  createdAt: z.date().describe("The created timestamp of the chatapp."),
  updatedAt: z.date().describe("The updated timestamp of the chatapp."),
});

export const UpsertChatAppSchema = ChatAppSchema.pick({
  model: true,
  prompt: true,
  tools: true,
  knowledgebases: true,
  config: true,
}).partial();

export const ChatSchema = z.object({
  id: z.string().describe("The id of the chat."),
  title: z.string().describe("The title of the chat."),
  chatAppId: z.string().describe("The chatAppId of the chat."),
  clientId: z.string().describe("The clientId of the chat."),
  createdAt: z.date().describe("The created timestamp of the chat."),
  updatedAt: z.date().describe("The updated timestamp of the chat."),
});

export const CreateChatSchema = ChatSchema.pick({
  id: true,
  title: true,
  chatAppId: true,
  clientId: true,
});

export const ChatMessageSchema = z.object({
  id: z.string().describe("The id of the message."),
  chatId: z.string().describe("The chatId of the message."),
  role: z.string().describe("The role of the message."),
  content: z.object({}).describe("The content of the message."),
  createdAt: z.date().describe("The created timestamp of the message."),
  updatedAt: z.date().describe("The updated timestamp of the message."),
});

export const MessageVoteSchema = z.object({
  chatId: z.string().describe("The chatId of the vote."),
  messageId: z.string().describe("The messageId of the vote."),
  isUpvoted: z.boolean().describe("The isUpvoted of the vote."),
});

export const CreateChatMessageSchema = ChatMessageSchema.pick({
  id: true,
  chatId: true,
  role: true,
  content: true,
});

export type ChatAppProps = z.infer<typeof ChatAppSchema>;
export type UpsertChatAppProps = z.infer<typeof UpsertChatAppSchema>;

export type ChatToolProps = z.infer<typeof ChatToolSchema>;
export type ChatKnowledgebaseProps = z.infer<typeof ChatKnowledgebaseSchema>;
export type RecallConfigProps = z.infer<typeof RecallConfigSchema>;
export type ModelConfigProps = z.infer<typeof ModelConfigSchema>;
export type ChatConfigProps = z.infer<typeof ChatConfigSchema>;

export type ChatProps = z.infer<typeof ChatSchema>;
export type CreateChatProps = z.infer<typeof CreateChatSchema>;

export type ChatMessageProps = z.infer<typeof ChatMessageSchema>;
export type CreateChatMessageProps = z.infer<typeof CreateChatMessageSchema>;
export type VoteProps = z.infer<typeof MessageVoteSchema>;
