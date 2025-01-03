import { useAnalyticsData } from "@/lib/swr";
import NumberFlow from "@number-flow/react";
import { useContext } from "react";
import { AnalyticsCountCard } from "./analytics-count-card";
import { AnalyticsContext } from "./provider";

export function ChatsCard() {
  const { start, end, interval } = useContext(AnalyticsContext);

  const { data } = useAnalyticsData<{ chats: number }[]>({
    eventType: "chats",
    groupBy: "count",
    start,
    end,
    interval,
  });

  return (
    <AnalyticsCountCard type="chats">
      <div className="font-bold text-2xl">
        <NumberFlow
          willChange
          value={data?.[0].chats || 0}
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
