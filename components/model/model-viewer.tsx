import type { ModelProps } from "@/lib/zod";
import { useModelIcon } from "./use-model-icon";

export function ModelViewer({ model }: { model: ModelProps | null }) {
  const Icon = useModelIcon(model);

  return (
    <div className="flex h-8 items-center rounded-sm border bg-gray-50 px-2 py-1 text-gray-500">
      {model ? (
        <>
          {Icon && <Icon className="mt-0.5 mr-2 size-4 text-gray-700" />}
          <span>{model.id}</span>
        </>
      ) : (
        "选择模型..."
      )}
    </div>
  );
}
