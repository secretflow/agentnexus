import { tb } from "@/lib/tinybird";
import { getStartEndDates } from "@/lib/utils";
import { AnalyticsParamsForTB, type AnalyticsQuery, AnalyticsResponse } from "@/lib/zod";

export const getAnalytics = async (query: AnalyticsQuery) => {
  let { groupBy, interval, start, end, timezone = "UTC" } = query;

  const { startDate, endDate, granularity } = getStartEndDates({
    interval,
    start,
    end,
  });

  const pipe = tb.buildPipe({
    pipe: `${groupBy}_pipe`,
    parameters: AnalyticsParamsForTB,
    data: AnalyticsResponse[groupBy],
  });

  const response = await pipe({
    ...query,
    start: startDate.toISOString().replace("T", " ").replace("Z", ""),
    end: endDate.toISOString().replace("T", " ").replace("Z", ""),
    granularity,
    timezone,
  });

  return response.data;
};
