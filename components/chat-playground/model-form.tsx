import { useModelConfigModal } from "@/components/modals";
import { ModelSelector } from "@/components/model";
import { Button } from "@/components/ui";
import type { ModelConfigProps, ModelProps } from "@/lib/zod";
import { Settings2 } from "lucide-react";

export function ModelSelectorForm({
  model,
  onModelChange,
  config,
  onConfigChange,
}: {
  model: ModelProps | null | undefined;
  onModelChange: (value: ModelProps) => void;
  config?: ModelConfigProps;
  onConfigChange?: (value: ModelConfigProps) => void;
}) {
  const { ModelConfigModal, setShowModelConfigModal } = useModelConfigModal({
    config,
    onSubmit(modelConfig) {
      onConfigChange?.(modelConfig);
    },
  });
  return (
    <div className="relative flex flex-col space-y-4 px-6 py-4">
      <div className="flex flex-col space-y-3">
        <h2 className="font-medium text-xl">模型</h2>
        <p className="text-gray-500 text-sm">配置合适的模型和参数</p>
      </div>
      <div className="flex items-center space-x-2">
        <ModelSelector
          type="language"
          value={model || null}
          onChange={onModelChange}
          className="h-10 w-[564px]"
          commandClassName="w-[564px]"
        />
        <Button
          variant="secondary"
          className="size-10 px-0"
          onClick={() => {
            setShowModelConfigModal(true);
          }}
          icon={<Settings2 className="size-4 text-gray-500" />}
        />
      </div>
      <ModelConfigModal />
    </div>
  );
}
