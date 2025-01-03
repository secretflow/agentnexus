import { useAnalyticsData } from "@/lib/swr";
import NumberFlow from "@number-flow/react";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useContext } from "react";
import { AnalyticsCountCard } from "./analytics-count-card";
import { AnalyticsContext } from "./provider";

export function MessagesCard() {
  const { start, end, interval } = useContext(AnalyticsContext);

  const { data } = useAnalyticsData<{ messages: number; up_votes: number; down_votes: number }[]>({
    eventType: "messages",
    groupBy: "count",
    start,
    end,
    interval,
  });

  return (
    <AnalyticsCountCard type="messages">
      <div className="flex gap-10">
        <div className="font-bold text-2xl">
          <NumberFlow
            willChange
            value={data?.[0].messages || 0}
            isolate
            continuous
            opacityTiming={{
              duration: 250,
              easing: "ease-out",
            }}
          />
        </div>
        <div className="flex gap-4 text-gray-500 text-lg">
          <div className="flex items-center gap-2">
            <ThumbsUp className="size-4" />
            <span className="text-lg">
              <NumberFlow
                willChange
                value={data?.[0].up_votes || 0}
                isolate
                continuous
                opacityTiming={{
                  duration: 250,
                  easing: "ease-out",
                }}
              />
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThumbsDown className="size-4" />
            <span>
              <NumberFlow
                willChange
                value={data?.[0].down_votes || 0}
                isolate
                continuous
                opacityTiming={{
                  duration: 250,
                  easing: "ease-out",
                }}
              />
            </span>
          </div>
        </div>
      </div>
    </AnalyticsCountCard>
  );
}
