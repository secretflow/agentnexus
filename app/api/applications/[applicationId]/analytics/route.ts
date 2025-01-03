import { getAnalytics, responseData } from "@/lib/api";
import { withApplication } from "@/lib/auth";
import { AnalyticsQuerySchema } from "@/lib/zod";

export const GET = withApplication(async ({ searchParams }) => {
  const query = AnalyticsQuerySchema.parse(searchParams);
  const data = await getAnalytics(query);
  return responseData(data);
});
