import { TOOL_ATTRS } from "@/lib/constants";
import { FirecrawlClient } from "@agentic/firecrawl";
import { registerToolProvider } from "./registry";

registerToolProvider({
  ...TOOL_ATTRS.firecrawl,

  async call(url: string) {
    const firecrawl = new FirecrawlClient();
    const res = await firecrawl.scrapeUrl({
      url,
    });
    return res;
  },

  getAiFunction() {
    return new FirecrawlClient();
  },
});
