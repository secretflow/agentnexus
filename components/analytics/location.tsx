import { FlagWavy, LocationPin, OfficeBuilding } from "@/components/icons";
import { LoadingSpinner } from "@/components/ui";
import { COUNTRIES } from "@/lib/constants";
import { useAnalyticsData } from "@/lib/swr";
import { useContext, useState } from "react";
import { AnalyticsCard } from "./analytics-card";
import { BarList } from "./bar-list";
import { AnalyticsContext } from "./provider";

export function Locations() {
  const { eventType, start, end, interval } = useContext(AnalyticsContext);
  const [tab, setTab] = useState<"country" | "city" | "region">("country");
  const dataKey = eventType;

  const { data } = useAnalyticsData<
    {
      country?: string;
      city?: string;
      region?: string;
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
      tabs={[
        { id: "country", label: "Countries", icon: FlagWavy },
        { id: "city", label: "Cities", icon: OfficeBuilding },
        { id: "region", label: "Regions", icon: LocationPin },
      ]}
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
                    icon: (
                      <img
                        alt={d.country}
                        src={`https://flag.vercel.app/m/${d.country}.svg`}
                        className="h-3 w-5"
                      />
                    ),
                    title: tab === "country" ? COUNTRIES[d[tab]!] : d[tab] || "Unknown",
                    value: d[dataKey] || 0,
                  }))
                  ?.sort((a, b) => b.value - a.value) || []
              }
              maxValue={Math.max(...data?.map((d) => d[dataKey] ?? 0)) ?? 0}
              barBackground="bg-blue-100"
              hoverBackground="hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent hover:border-blue-500"
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
