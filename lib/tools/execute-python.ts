import { TOOL_ATTRS } from "@/lib/constants";
import { e2b } from "@agentic/e2b";
import { registerToolProvider } from "./registry";

function formatFuncParams(params: Record<string, string | number | null>) {
  return Object.entries(params)
    .map(([name, value]) => {
      if (value === null) {
        return null;
      } else if (typeof value === "string") {
        return `${name}=${JSON.stringify(value)}`;
      }
      return `${name}=${value}`;
    })
    .filter((p) => p !== null)
    .join(", ");
}

registerToolProvider({
  ...TOOL_ATTRS.executePython,

  async call(code: string, params: Record<string, string | number | null>) {
    const args = formatFuncParams(params);
    const completedCode = `${code}\nmain(${args})`;
    const res = await e2b(JSON.stringify({ code: completedCode }));
    return res[0]?.json;
  },

  getAiFunction() {
    return e2b;
  },
});
