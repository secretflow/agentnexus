import type { VariableProps } from "@/lib/zod";
import { z } from "zod";

export function variableToZod(variable: VariableProps) {
  if (variable.type === "string") {
    let zod = z.string();
    if (variable.maxLength) {
      zod = zod.max(variable.maxLength);
    }
    if (variable.required) {
      zod = zod.min(1);
    }
    if (variable.description) {
      zod = zod.describe(variable.description);
    }
    return zod;
  } else if (variable.type === "number") {
    let zod = z.number();
    if (variable.description) {
      zod = zod.describe(variable.description);
    }
    return zod;
  }

  return z.any();
}

export function variablesToZod(variables: VariableProps[]) {
  let o = z.object({});
  for (const variable of variables) {
    const zod = variableToZod(variable);
    o = o.extend({
      [variable.name]: zod,
    });
  }
  return o;
}
