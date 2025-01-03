import { INTERVAL_DATA } from "@/lib/constants";
import * as chrono from "chrono-node";

export const parseDateTime = (str: Date | string) => {
  if (str instanceof Date) return str;
  return chrono.parseDate(str);
};

export const getDaysDifference = (startDate: Date, endDate: Date) => {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getStartEndDates = ({
  interval,
  start,
  end,
}: {
  interval?: string;
  start?: string | Date | null;
  end?: string | Date | null;
}) => {
  let startDate: Date;
  let endDate: Date;
  let granularity: "minute" | "hour" | "day" | "month" = "day";

  if (start) {
    startDate = new Date(start);
    endDate = end ? new Date(end) : new Date(Date.now());

    const daysDifference = getDaysDifference(startDate, endDate);

    if (daysDifference <= 2) {
      granularity = "hour";
    } else if (daysDifference > 180) {
      granularity = "month";
    }

    // Swap start and end if start is greater than end
    if (startDate > endDate) {
      [startDate, endDate] = [endDate, startDate];
    }
  } else {
    interval = interval ?? "24h";
    startDate = INTERVAL_DATA[interval].startDate;
    endDate = new Date(Date.now());
    granularity = INTERVAL_DATA[interval].granularity;
  }

  return { startDate, endDate, granularity };
};
