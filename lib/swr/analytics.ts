import { createQueryString, fetcher } from "@/lib/utils";
import type { AnalyticsEvent, AnalyticsGroupBy } from "@/lib/zod";
import { useParams } from "next/navigation";
import useSWR from "swr";

export function useAnalyticsData<T>(query: {
  eventType: AnalyticsEvent;
  groupBy: AnalyticsGroupBy;
  start: Date | undefined;
  end: Date | undefined;
  interval: string | undefined;
}) {
  const { applicationId, workspaceId } = useParams<{
    applicationId: string;
    workspaceId: string;
  }>();

  const { eventType, groupBy, start, end, interval } = query;
  const params = {
    appId: applicationId,
    workspaceId,
    eventType,
    groupBy,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    ...(start && end && { start: start.toISOString(), end: end.toISOString() }),
    ...(interval && { interval }),
  };

  const { data, error, mutate } = useSWR<T>(
    workspaceId &&
      applicationId &&
      `/api/applications/${applicationId}/analytics?${createQueryString(params)}`,
    fetcher,
    {
      dedupingInterval: 60000,
    },
  );

  return {
    data,
    error,
    mutate,
    loading: workspaceId && applicationId && !data && !error,
  };
}
