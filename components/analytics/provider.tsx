"use client";

import type { AnalyticsEvent } from "@/lib/zod";
import { type PropsWithChildren, createContext, useState } from "react";

export const AnalyticsContext = createContext<{
  eventType: AnalyticsEvent;
  start: Date | undefined;
  end: Date | undefined;
  interval: string | undefined;
  setEventType: (eventType: AnalyticsEvent) => void;
  setStart: (start: Date | undefined) => void;
  setEnd: (end: Date | undefined) => void;
  setInterval: (interval: string | undefined) => void;
}>({
  eventType: "chats",
  start: new Date(),
  end: new Date(),
  interval: undefined,
  setEventType: () => {},
  setStart: () => {},
  setEnd: () => {},
  setInterval: () => {},
});

export function AnalyticsProvider({ children }: PropsWithChildren) {
  const [eventType, setEventType] = useState<AnalyticsEvent>("users");
  const [start, setStart] = useState<Date | undefined>(undefined);
  const [end, setEnd] = useState<Date | undefined>(undefined);
  const [interval, setInterval] = useState<string | undefined>("24h");

  return (
    <AnalyticsContext.Provider
      value={{
        eventType,
        start,
        end,
        interval,
        setEventType,
        setStart,
        setEnd,
        setInterval,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
}
