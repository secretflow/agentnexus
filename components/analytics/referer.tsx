import { ReferredVia } from "@/components/icons";
import { LoadingSpinner } from "@/components/ui";
import { useAnalyticsData } from "@/lib/swr";
import { useContext, useState } from "react";
import { AnalyticsCard } from "./analytics-card";
import { BarList } from "./bar-list";
import { AnalyticsContext } from "./provider";

export function Referer() {
  const { eventType, start, end, interval } = useContext(AnalyticsContext);
  const dataKey = eventType;

  const [tab, setTab] = useState<"referer">("referer");
  const { data } = useAnalyticsData<
    {
      referer?: string;
      users: number;
      chats: number;
      messages: number;
      tokens: number;
    }[]
  >({
    eventType,
    groupBy: tab,
    start,
    end,
    interval,
  });

  return (
    <AnalyticsCard
      tabs={[{ id: "referer", label: "Referrer", icon: ReferredVia }]}
      selectedTabId={tab}
      onSelectTab={setTab}
      expandLimit={8}
      hasMore={(data?.length ?? 0) > 8}
    >
      {({ limit, setShowModal }) =>
        data ? (
          data.length > 0 ? (
            <BarList
              data={
                data
                  ?.map((d) => ({
                    icon: <ReferredVia className="h-4 w-4" />,
                    title: d[tab] || "Unknown",
                    value: d[dataKey] || 0,
                  }))
                  ?.sort((a, b) => b.value - a.value) || []
              }
              maxValue={Math.max(...data?.map((d) => d[dataKey] ?? 0)) ?? 0}
              barBackground="bg-red-100"
              hoverBackground="hover:bg-gradient-to-r hover:from-red-50 hover:to-transparent hover:border-red-500"
              setShowModal={setShowModal}
              {...(limit && { limit })}
            />
          ) : (
            <div className="flex h-[300px] items-center justify-center">
              <p className="text-gray-600 text-sm">暂无数据</p>
            </div>
          )
        ) : (
          <div className="flex h-[300px] items-center justify-center">
            <LoadingSpinner />
          </div>
        )
      }
    </AnalyticsCard>
  );
}
