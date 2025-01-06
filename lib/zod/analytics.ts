import { capitalize, parseDateTime } from "@/lib/utils";
import { z } from "zod";

export const ANALYTICS_EVENT_TYPES = ["users", "chats", "messages", "tokens"] as const;
export const ANALYTICS_GROUP_BY = [
  "timeseries",
  "device",
  "browser",
  "os",
  "referer",
  "count",
  "country",
  "city",
  "region",
] as const;
export const ANALYTICS_INTERVALS = [
  "24h",
  "7d",
  "30d",
  "90d",
  "ytd",
  "1y",
  "all",
  "all_unfiltered",
] as const;

export const AnalyticsEventSchema = z
  .enum(ANALYTICS_EVENT_TYPES)
  .describe("The event type to retrieve analytics for.");

export const AnalyticsGroupBySchema = z
  .enum(ANALYTICS_GROUP_BY)
  .describe("The group by type to retrieve analytics for.");

export const parseDateSchema = z
  .string()
  .transform((v) => parseDateTime(v))
  .refine((v) => !!v, { message: "无效的时间" });

export const AnalyticsQuerySchema = z.object({
  appId: z.string().describe("The application ID to retrieve analytics for."),
  eventType: AnalyticsEventSchema,
  groupBy: AnalyticsGroupBySchema,
  interval: z
    .enum(ANALYTICS_INTERVALS)
    .optional()
    .describe("The interval to retrieve analytics for. If undefined, defaults to 24h."),
  start: parseDateSchema
    .optional()
    .describe("The start date and time when to retrieve analytics from."),
  end: parseDateSchema
    .optional()
    .describe("The end date and time when to retrieve analytics from."),
  timezone: z
    .string()
    .optional()
    .describe("The timezone to retrieve analytics for. If undefined, defaults to UTC."),
  device: z
    .string()
    .optional()
    .transform((v) => capitalize(v) as string | undefined)
    .describe("The device to retrieve analytics for."),
  browser: z
    .string()
    .optional()
    .transform((v) => capitalize(v) as string | undefined)
    .describe("The browser to retrieve analytics for."),
  os: z
    .string()
    .optional()
    .transform((v) => {
      if (v === "iOS") return "iOS";
      return capitalize(v) as string | undefined;
    })
    .describe("The OS to retrieve analytics for."),
  referer: z.string().optional().describe("The referer to retrieve analytics for."),
  country: z.string().optional().describe("The country to retrieve analytics for."),
  city: z.string().optional().describe("The city to retrieve analytics for."),
  region: z.string().optional().describe("The region to retrieve analytics for."),
});

export const AnalyticsParamsForTB = z
  .object({
    start: z.string(),
    end: z.string(),
    granularity: z.enum(["minute", "hour", "day", "month"]).optional(),
    timezone: z.string().optional(),
  })
  .merge(
    AnalyticsQuerySchema.pick({
      eventType: true,
      appId: true,
      browser: true,
      device: true,
      os: true,
      referer: true,
      country: true,
      city: true,
      region: true,
    }),
  );

const analyticsItemCount = {
  chats: z.number().optional().describe("The total number of chats"),
  messages: z.number().optional().describe("The total number of messages"),
  users: z.number().optional().describe("The total number of users"),
  prompt_tokens: z.number().optional().describe("The total number of prompt tokens"),
  completion_tokens: z.number().optional().describe("The total number of completion tokens"),
  tokens: z.number().optional().describe("The total number of tokens"),
  up_votes: z.number().optional().describe("The total number of up votes"),
  down_votes: z.number().optional().describe("The total number of down votes"),
};

export const AnalyticsResponse = {
  count: z.object(analyticsItemCount),
  timeseries: z.object({
    ...analyticsItemCount,
    start: z.string().describe("The starting timestamp of the interval"),
  }),
  device: z.object({
    ...analyticsItemCount,
    device: z.string().describe("The device type"),
  }),
  browser: z.object({
    ...analyticsItemCount,
    browser: z.string().describe("The browser type"),
  }),
  os: z.object({
    ...analyticsItemCount,
    os: z.string().describe("The OS type"),
  }),
  referer: z.object({
    ...analyticsItemCount,
    referer: z.string().describe("The referer"),
  }),
  country: z.object({
    ...analyticsItemCount,
    country: z.string().describe("The country"),
  }),
  city: z.object({
    ...analyticsItemCount,
    city: z.string().describe("The city"),
    country: z.string().describe("The country"),
  }),
  region: z.object({
    ...analyticsItemCount,
    region: z.string().describe("The region"),
    country: z.string().describe("The country"),
  }),
} as const;

export type AnalyticsEvent = z.infer<typeof AnalyticsEventSchema>;
export type AnalyticsGroupBy = z.infer<typeof AnalyticsGroupBySchema>;
export type AnalyticsQuery = z.infer<typeof AnalyticsQuerySchema>;
