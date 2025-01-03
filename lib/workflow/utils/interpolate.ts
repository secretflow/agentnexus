import type { WorkContext } from "../work";

export function interpolateString(message: string, context: WorkContext): string {
  return message.replace(/\{\{([a-zA-Z0-9_.\-]+)\}\}/g, (_, key: string) => {
    const keys = key.split(".");

    const values = context.get(keys[0]);
    if (values === undefined) {
      return key;
    }

    let result = values.output;
    for (let i = 1; i < keys.length; i++) {
      result = result[keys[i]];
      if (result === undefined) {
        return key;
      }
    }

    return result;
  });
}
