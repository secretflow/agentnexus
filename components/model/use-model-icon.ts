import type { ModelProps } from "@/lib/zod";
import { useMemo } from "react";
import { MODEL_PROVIDER_ICONS } from "./constants";

export function useModelIcon(model: ModelProps | null | undefined) {
  const Icon = useMemo(() => {
    if (!model) return null;
    const icon = MODEL_PROVIDER_ICONS[model.provider];
    if (!icon) return null;
    return icon;
  }, [model]);

  return Icon;
}
