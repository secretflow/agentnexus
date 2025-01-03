import { TOOL_ATTRS } from "@/lib/constants";
import { ExaClient } from "@agentic/exa";
import { registerToolProvider } from "./registry";

registerToolProvider({
  ...TOOL_ATTRS.webSearch,

  async call() {
    // pass
  },

  getAiFunction() {
    return new ExaClient();
  },
});
