import { ModelSelector } from "@/components/model";
import type { ModelProps } from "@/lib/zod";

export function ModelSelectorForm({
  value,
  onValueChange,
}: {
  value: ModelProps | null | undefined;
  onValueChange: (value: ModelProps) => void;
}) {
  return (
    <div className="relative flex flex-col space-y-4 px-6 py-4">
      <div className="flex flex-col space-y-3">
        <h2 className="font-medium text-xl">模型</h2>
        <p className="text-gray-500 text-sm">配置合适的模型和参数</p>
      </div>
      <ModelSelector
        type="language"
        className="h-10"
        value={value || null}
        onChange={onValueChange}
      />
    </div>
  );
}
