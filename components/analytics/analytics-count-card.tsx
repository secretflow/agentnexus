import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { AnalyticsEvent } from "@/lib/zod";
import { useContext } from "react";
import { Analytics_EVENT_ATTR } from "./constant";
import { AnalyticsContext } from "./provider";

export function AnalyticsCountCard({
  type,
  children,
}: {
  type: AnalyticsEvent;
  children: React.ReactNode;
}) {
  const { eventType, setEventType } = useContext(AnalyticsContext);
  const { title, icon: Icon } = Analytics_EVENT_ATTR[type];

  return (
    <Card
      onClick={() => setEventType(type)}
      className={cn(
        "cursor-pointer border border-gray-200 text-gray-600 shadow-none transition-[filter] hover:drop-shadow-card-hover",
        {
          "border-2 border-gray-500": eventType === type,
        },
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="font-medium">{title}</CardTitle>
        <Icon className="size-5" />
      </CardHeader>
      <CardContent className="flex gap-10">{children}</CardContent>
    </Card>
  );
}
