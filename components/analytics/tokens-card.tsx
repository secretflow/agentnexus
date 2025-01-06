import { useAnalyticsData } from "@/lib/swr";
import NumberFlow from "@number-flow/react";
import { useContext } from "react";
import { AnalyticsCountCard } from "./analytics-count-card";
import { AnalyticsContext } from "./provider";

export function TokensCard() {
  const { start, end, interval } = useContext(AnalyticsContext);

  const { data } = useAnalyticsData<{ tokens: number }[]>({
    eventType: "tokens",
    groupBy: "count",
    start,
    end,
    interval,
  });

  return (
    <AnalyticsCountCard type="tokens">
      <div className="font-bold text-2xl">
        <NumberFlow
          willChange
          value={data?.[0].tokens || 0}
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
