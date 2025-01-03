import { TOOL_ATTRS } from "@/lib/constants";
import { getToolProvider } from "@/lib/tools";
import { log } from "@/lib/utils";
import type { VariableProps } from "@/lib/zod";
import type { weatherapi } from "@agentic/weather";
import { FailureWorkReport, SuccessWorkReport } from "../report";
import { interpolateString, registerWork } from "../utils";
import { type Work, type WorkContext, WorkStatus } from "../work";

export type WeatherWorkConfig = {
  city: string;
  variables: VariableProps[];
};

const toolId = TOOL_ATTRS.weather.id;
@registerWork(toolId)
class WeatherWork implements Work {
  public id: string;
  public config: WeatherWorkConfig;

  constructor(id: string, config: WeatherWorkConfig) {
    this.id = id;
    this.config = config;
  }

  async call(workContext: WorkContext) {
    const weatherToolProvider = getToolProvider(toolId);
    const city = interpolateString(this.config.city, workContext);

    if (!weatherToolProvider) {
      const errMsg = `Tool provider not found: ${toolId}`;
      workContext.set(this.id, {
        input: { city },
        output: null,
        status: WorkStatus.FAILED,
        error: errMsg,
      });
      return new FailureWorkReport(workContext, new Error(errMsg));
    }

    const res = (await weatherToolProvider.call(city)) as weatherapi.CurrentWeatherResponse;

    workContext.set(this.id, {
      input: { city },
      output: res.current,
      status: WorkStatus.SUCCESS,
    });

    log.success(`WeatherWork ${this.id} successed!`);

    return new SuccessWorkReport(workContext);
  }
}

export { WeatherWork };
