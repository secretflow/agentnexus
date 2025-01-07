import { ModelSelector } from "@/components/model";
import { Button } from "@/components/ui";
import type { ModelProps } from "@/lib/zod";
import { Settings2 } from "lucide-react";

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
      <div className="flex items-center space-x-2">
        <ModelSelector
          type="language"
          className="h-10 w-[564px]"
          value={value || null}
          onChange={onValueChange}
        />
        <Button
          variant="secondary"
          className="size-10 px-0"
          onClick={() => {}}
          icon={<Settings2 className="size-4 text-gray-500" />}
        />
      </div>
    </div>
  );
}
