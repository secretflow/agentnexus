import { z } from "zod";

export const WorkspaceSchema = z.object({
  id: z.string().describe("The unique ID of the workspace."),
  name: z.string().describe("The name of the workspace."),
  image: z.string().nullable().default(null).describe("The logo of the workspace."),
  userId: z.string().describe("The user ID of the workspace."),
  user: z.object({
    id: z.string(),
    name: z.string().nullable(),
    image: z.string().nullable(),
  }),
  applications: z
    .array(z.object({ id: z.string() }))
    .default([])
    .describe("The applications of the workspace."),
  knowledgebases: z
    .array(z.object({ id: z.string() }))
    .default([])
    .describe("The knowledgebases of the workspace."),
  inviteCode: z.string().nullable().default(null).describe("The invite code of the workspace."),
  members: z
    .array(
      z.object({
        userId: z.string().describe("The user ID of the member."),
      }),
    )
    .default([])
    .describe("The members of the workspace."),
  createdAt: z.date().describe("The created timestamp of the workspace."),
  updatedAt: z.date().describe("The updated timestamp of the workspace."),
});

export const CreateWorkspaceSchema = z.object({
  name: z.string().min(1, { message: "请输入工作空间名称" }).max(32),
  image: z.string().optional(),
});

export const UpdateWorkspaceSchema = z.object({
  name: z.string().min(1, { message: "请输入工作空间名称" }).max(32).optional(),
  image: z.string().optional(),
  inviteCode: z.string().optional(),
});

export type WorkspaceProps = z.infer<typeof WorkspaceSchema>;
export type WorkspaceWithRoleProps = WorkspaceProps & {
  isOwner: boolean;
};
export type CreateWorkspaceProps = z.infer<typeof CreateWorkspaceSchema>;
export type UpdateWrorkspaceProps = z.infer<typeof UpdateWorkspaceSchema>;
