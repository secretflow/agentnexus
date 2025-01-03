import z from "zod";

export const TokenSchema = z.object({
  id: z.string().describe("The unique identifier of the token"),
  userId: z.string().describe("The user ID of the token"),
  name: z.string().describe("The name of the token"),
  partialKey: z.string().describe("The partial key of the token"),
  lastUsed: z.date().nullable().describe("The last time the token was used"),
  createdAt: z.date().describe("The time the token was created"),
  updatedAt: z.date().describe("The time the token was last updated"),
  user: z.object({
    id: z.string(),
    name: z.string().nullable(),
    image: z.string().nullable(),
  }),
});

export const CreateTokenSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(1)
    .max(32),
});

export const UpdateTokenSchema = CreateTokenSchema;

export type TokenProps = z.infer<typeof TokenSchema>;
export type CreateTokenProps = z.infer<typeof CreateTokenSchema>;
