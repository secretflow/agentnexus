import { DateRangePicker } from "@/components/ui/date-picker";
import { INTERVAL_DATA, INTERVAL_DISPLAYS } from "@/lib/constants";
import { useContext } from "react";
import { AnalyticsContext } from "./provider";

export function Filter() {
  const { start, end, interval, setStart, setEnd, setInterval } = useContext(AnalyticsContext);

  return (
    <div>
      <DateRangePicker
        className="w-full sm:min-w-[200px] md:w-fit"
        align="start"
        value={
          start && end
            ? {
                from: start,
                to: end,
              }
            : undefined
        }
        presetId={!start || !end ? (interval ?? "24h") : undefined}
        onChange={(range, preset) => {
          if (preset) {
            setStart(undefined);
            setEnd(undefined);
            setInterval(preset.id);
            return;
          }

          if (!range || !range.from || !range.to) return;

          setStart(range.from);
          setEnd(range.to);
          setInterval(undefined);
        }}
        presets={INTERVAL_DISPLAYS.map(({ display, value }) => {
          const start = INTERVAL_DATA[value].startDate;
          const end = new Date();

          return {
            id: value,
            label: display,
            dateRange: {
              from: start,
              to: end,
            },
          };
        })}
      />
    </div>
  );
}
