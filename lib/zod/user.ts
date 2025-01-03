import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().describe("The unique identifier of the user"),
  name: z.string().describe("The name of the user"),
  email: z.string().email("无效的邮箱格式").describe("The email of the user"),
  subscribed: z.boolean().describe("The subscription status of the user"),
  image: z.string().optional().describe("The image URL of the user"),
  createdAt: z.date().describe("The time the user was created"),
  updatedAt: z.date().describe("The time the user was last updated"),
});

export const UpdateUserSchema = UserSchema.pick({
  name: true,
  email: true,
  image: true,
  subscribed: true,
}).partial();

export const MemberSchema = z.object({
  id: z.string().describe("The unique identifier of the member"),
  userId: z.string().describe("The user ID of the member"),
  workspaceId: z.string().describe("The workspace ID of the member"),
  createdAt: z.date().describe("The time the member was created"),
  updatedAt: z.date().describe("The time the member was last updated"),
});

export type UserProps = z.infer<typeof UserSchema>;
export type UserWithRoleProps = UserProps & { role: "member" | "owner" };
export type UpdateUserProps = z.infer<typeof UpdateUserSchema>;
