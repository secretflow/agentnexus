import { Card, CardContent } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { weatherapi } from "@agentic/weather";
import Image from "next/image";

const SAMPLE = {
  current: {
    uv: 0,
    cloud: 75,
    is_day: 0,
    temp_c: 21.2,
    temp_f: 70.2,
    vis_km: 3,
    gust_kph: 10.8,
    gust_mph: 6.7,
    humidity: 94,
    wind_dir: "S",
    wind_kph: 3.6,
    wind_mph: 2.2,
    condition: {
      code: 1240,
      icon: "//cdn.weatherapi.com/weather/64x64/night/353.png",
      text: "Light rain shower",
    },
    precip_in: 0.01,
    precip_mm: 0.27,
    vis_miles: 1,
    dewpoint_c: 19.6,
    dewpoint_f: 67.2,
    feelslike_c: 21.2,
    feelslike_f: 70.2,
    heatindex_c: 20.4,
    heatindex_f: 68.8,
    pressure_in: 29.97,
    pressure_mb: 1015,
    wind_degree: 181,
    windchill_c: 20.4,
    windchill_f: 68.8,
    last_updated: "2024-11-14 19:15",
    last_updated_epoch: 1731582900,
  },
  location: {
    lat: 30.2553,
    lon: 120.1689,
    name: "Hangzhou",
    tz_id: "Asia/Shanghai",
    region: "Zhejiang",
    country: "China",
    localtime: "2024-11-14 19:15",
    localtime_epoch: 1731582956,
  },
};

export function Weather({
  weatherAtLocation = SAMPLE,
  args,
  loading,
}: {
  weatherAtLocation?: weatherapi.CurrentWeatherResponse;
  args?: { q: string };
  loading?: boolean;
}) {
  const { icon, text } = weatherAtLocation.current.condition;
  const isDay = weatherAtLocation.current.is_day === 1;
  const { uv, humidity, cloud, wind_kph, temp_c } = weatherAtLocation.current;
  const titleClassName = { "text-gray-600": loading };

  return (
    <div className={cn("flex", { skeleton: loading })}>
      <Card
        className={cn("skeleton-bg max-w-[420px] text-white shadow-none", {
          "bg-blue-800": !isDay,
          "bg-blue-400": isDay,
        })}
      >
        <CardContent className="p-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-2 items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="skeleton-div h-12 w-12 rounded-full">
                  <Image
                    className="skeleton-invisible"
                    src={`https:${icon}`}
                    alt={text}
                    width={48}
                    height={48}
                  />
                </div>
                <h2 className="skeleton-text font-medium text-3xl">{temp_c}°</h2>
              </div>
              <div className="text-right ">
                <div className={cn(titleClassName)}>{args?.q}</div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className={cn("text-blue-100 text-sm", titleClassName)}>Humidity</p>
                <p className="skeleton-text text-sm">{humidity}%</p>
              </div>
              <div>
                <div className={cn("text-blue-100 text-sm", titleClassName)}>Wind</div>
                <p className="skeleton-text text-sm">{wind_kph} kph</p>
              </div>
              <div>
                <div className={cn("text-blue-100 text-sm", titleClassName)}>Cloudiness</div>
                <p className="skeleton-text text-sm">{cloud}%</p>
              </div>
              <div>
                <p className={cn("text-blue-100 text-sm", titleClassName)}>UV Index</p>
                <p className="skeleton-text text-sm">{uv} of 11</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
