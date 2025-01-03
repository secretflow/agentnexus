import { z } from "zod";

export const APPLICATION_TYPES = ["workflow", "agent"] as const;

export const ApplicationSchema = z.object({
  id: z.string().describe("The unique ID of the application."),
  userId: z.string().describe("The user ID of the application."),
  name: z.string().describe("The name of the application."),
  image: z.string().nullable().default(null).describe("The logo of the application."),
  description: z.string().nullable().default(null).describe("The description of the application."),
  type: z.enum(APPLICATION_TYPES).describe("The type of the application."),
  published: z.boolean().describe("The published status of the application."),
  workspaceId: z.string().describe("The workspace ID of the application."),
  user: z.object({
    id: z.string(),
    name: z.string().nullable(),
    image: z.string().nullable(),
  }),
  createdAt: z.date().describe("The created timestamp of the application."),
  updatedAt: z.date().describe("The updated timestamp of the application."),
});

export const CreateApplicationSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(1, { message: "请输入应用名称" })
    .max(32),
  image: z.string().optional(),
  description: z.string().max(200).optional(),
  type: z.enum(APPLICATION_TYPES),
});

export const UpdateApplicationSchema = CreateApplicationSchema.pick({
  name: true,
  image: true,
  description: true,
})
  .extend({
    published: z.boolean().optional(),
  })
  .partial();

export type ApplicationType = (typeof APPLICATION_TYPES)[number];
export type ApplicationProps = z.infer<typeof ApplicationSchema>;
export type CreateApplicationProps = z.infer<typeof CreateApplicationSchema>;
export type UpdateApplicationProps = z.infer<typeof UpdateApplicationSchema>;
