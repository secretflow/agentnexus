"use client";

import { Devices } from "./devices";
import { Filter } from "./filter";
import { Locations } from "./location";
import { Main } from "./main";
import { AnalyticsContext, AnalyticsProvider } from "./provider";
import { Referer } from "./referer";

export function Analytics() {
  return (
    <AnalyticsProvider>
      <Filter />
      <div className="mt-4">
        <Main />
        <AnalyticsContext.Consumer>
          {({ eventType }) =>
            eventType === "users" && (
              <div className="grid grid-cols-1 gap-5 py-4 md:grid-cols-2">
                <Locations />
                <Referer />
                <Devices />
              </div>
            )
          }
        </AnalyticsContext.Consumer>
      </div>
    </AnalyticsProvider>
  );
}
