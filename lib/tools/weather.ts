import { TOOL_ATTRS } from "@/lib/constants";
import { WeatherClient } from "@agentic/weather";
import { registerToolProvider } from "./registry";

registerToolProvider({
  ...TOOL_ATTRS.weather,

  async call(city: string) {
    const weather = new WeatherClient();
    return await weather.getCurrentWeather(city);
  },

  getAiFunction() {
    return new WeatherClient();
  },
});
