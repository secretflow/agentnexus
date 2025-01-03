import { Cube, MobilePhone, Window } from "@/components/icons";
import { LoadingSpinner } from "@/components/ui";
import { useAnalyticsData } from "@/lib/swr";
import { useContext, useState } from "react";
import { AnalyticsCard } from "./analytics-card";
import { BarList } from "./bar-list";
import { DeviceIcon } from "./device-icon";
import { AnalyticsContext } from "./provider";
import type { DeviceTabs } from "./types";

export function Devices() {
  const { eventType, start, end, interval } = useContext(AnalyticsContext);
  const [tab, setTab] = useState<DeviceTabs>("device");
  const dataKey = eventType;

  const { data } = useAnalyticsData<
    {
      device?: string;
      browser?: string;
      os?: string;
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
        { id: "device", label: "Devices", icon: MobilePhone },
        { id: "browser", label: "Browsers", icon: Window },
        { id: "os", label: "OS", icon: Cube },
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
                    icon: <DeviceIcon display={d[tab] || ""} tab={tab} className="h-4 w-4" />,
                    title: d[tab] || "Unknown",
                    value: d[dataKey] || 0,
                  }))
                  ?.sort((a, b) => b.value - a.value) || []
              }
              maxValue={Math.max(...data?.map((d) => d[dataKey] ?? 0)) ?? 0}
              barBackground="bg-green-100"
              hoverBackground="hover:bg-gradient-to-r hover:from-green-50 hover:to-transparent hover:border-green-500"
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
