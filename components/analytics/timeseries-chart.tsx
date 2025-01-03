"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui";
import { useAnalyticsData } from "@/lib/swr";
import { getDaysDifference } from "@/lib/utils";
import { useCallback, useContext } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Analytics_EVENT_ATTR } from "./constant";
import { AnalyticsContext } from "./provider";

const chartConfig = {
  users: {
    label: Analytics_EVENT_ATTR.users.title,
    color: "hsl(var(--chart-1))",
  },
  chats: {
    label: Analytics_EVENT_ATTR.chats.title,
    color: "hsl(var(--chart-2))",
  },
  messages: {
    label: Analytics_EVENT_ATTR.messages.title,
    color: "hsl(var(--chart-5))",
  },
  tokens: {
    label: Analytics_EVENT_ATTR.tokens.title,
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export function TimeseriesChart() {
  const { start, end, interval, eventType } = useContext(AnalyticsContext);
  const { title, description } = Analytics_EVENT_ATTR[eventType];

  const { data } = useAnalyticsData<{ start: string }[]>({
    eventType,
    groupBy: "timeseries",
    start,
    end,
    interval,
  });

  const formatDate = useCallback(
    (date: Date) => {
      if (start && end) {
        const daysDifference = getDaysDifference(start, end);

        if (daysDifference <= 2)
          return date.toLocaleTimeString("zh-CN", {
            hour: "numeric",
            minute: "numeric",
          });
        else if (daysDifference > 180)
          return date.toLocaleDateString("zh-CN", {
            month: "short",
            year: "numeric",
          });
      } else if (interval) {
        switch (interval) {
          case "24h":
            return date.toLocaleTimeString("zh-CN", {
              hour: "numeric",
              minute: "numeric",
            });
          case "ytd":
          case "1y":
          case "all":
            return date.toLocaleDateString("zh-CN", {
              month: "short",
              year: "numeric",
            });
          default:
            break;
        }
      }

      return date.toLocaleDateString("zh-CN", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    },
    [start, end, interval],
  );

  const color = `var(--color-${eventType})`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[360px] w-full">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillMain" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={color} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="start"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return formatDate(date);
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    return formatDate(date);
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey={eventType}
              type="linear"
              fill="url(#fillMain)"
              stroke={color}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
