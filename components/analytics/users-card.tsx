import { useAnalyticsData } from "@/lib/swr";
import NumberFlow from "@number-flow/react";
import { useContext } from "react";
import { AnalyticsCountCard } from "./analytics-count-card";
import { AnalyticsContext } from "./provider";

export function UsersCard() {
  const { start, end, interval } = useContext(AnalyticsContext);

  const { data } = useAnalyticsData<{ users: number }[]>({
    eventType: "users",
    groupBy: "count",
    start,
    end,
    interval,
  });

  return (
    <AnalyticsCountCard type="users">
      <div className="font-bold text-2xl">
        <NumberFlow
          willChange
          value={data?.[0].users || 0}
          isolate
          continuous
          opacityTiming={{
            duration: 250,
            easing: "ease-out",
          }}
        />
      </div>
    </AnalyticsCountCard>
  );
}
