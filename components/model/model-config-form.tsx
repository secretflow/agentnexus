"use client";

import { X } from "@/components/icons";
import { Button, InfoTooltip, Label, Slider } from "@/components/ui";
import { DEFAULT_MODEL_CONFIG } from "@/lib/constants";
import { type ModelConfigProps, ModelConfigSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import NumberFlow from "@number-flow/react";
import { Radar } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function ModelConfigForm({
  config,
  onSuccess,
  onClose,
}: {
  config?: ModelConfigProps;
  onSuccess?: (data: ModelConfigProps) => void;
  onClose?: () => void;
}) {
  const [temperature, setTemperature] = useState(
    config?.temperature || DEFAULT_MODEL_CONFIG.temperature,
  );
  const [maxTokens, setMaxTokens] = useState(config?.maxTokens || DEFAULT_MODEL_CONFIG.maxTokens);
  const [presencePenalty, setPresencePenalty] = useState(
    config?.presencePenalty || DEFAULT_MODEL_CONFIG.presencePenalty,
  );
  const [frequencyPenalty, setFrequencyPenalty] = useState(
    config?.frequencyPenalty || DEFAULT_MODEL_CONFIG.frequencyPenalty,
  );

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ModelConfigProps>({
    resolver: zodResolver(ModelConfigSchema),
    defaultValues: config || DEFAULT_MODEL_CONFIG,
  });

  const onSubmit = handleSubmit(async (data: ModelConfigProps) => {
    onSuccess?.({
      ...data,
      temperature,
      maxTokens,
      presencePenalty,
      frequencyPenalty,
    });
  });

  return (
    <form onSubmit={onSubmit}>
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-6 items-center justify-center rounded-full bg-gray-100 px-0 sm:size-6 [&>*]:size-3 sm:[&>*]:size-4">
            <Radar className="size-4" />
          </div>
          <h3 className="!mt-0 max-w-sm truncate font-medium text-lg">模型参数配置</h3>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={onClose}
            variant="ghost"
            className="flex size-9 rounded-full p-2 text-gray-500 transition-all duration-75 hover:bg-gray-100 focus:outline-none active:bg-gray-200"
            icon={<X className="size-5" />}
          />
        </div>
      </div>

      <div className="space-y-6 px-6 py-4">
        <div className="grid grid-cols-10">
          <Label
            htmlFor="temperature"
            className="col-span-3 flex items-center space-x-1 text-gray-700"
          >
            <p>温度</p>
            <InfoTooltip content="温度影响生成结果的随机性， 0 意味着几乎是确定性的结果，较高的值意味着更多的随机性" />
          </Label>
          <div className="col-span-6 flex items-center">
            <Slider
              id="temperature"
              value={[temperature]}
              min={0}
              max={1}
              step={0.1}
              onValueChange={(value) => setTemperature(value[0])}
            />
          </div>
          <div className="col-span-1 pl-2 text-gray-500">
            <NumberFlow
              willChange
              value={temperature}
              isolate
              continuous
              opacityTiming={{
                duration: 250,
                easing: "ease-out",
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-10">
          <Label htmlFor="score" className="col-span-3 flex items-center space-x-1 text-gray-700">
            <p>最大生成 Tokens</p>
          </Label>
          <div className="col-span-6 flex items-center">
            <Slider
              id="maxTokens"
              value={[maxTokens]}
              min={1}
              max={4096}
              step={100}
              onValueChange={(value) => setMaxTokens(value[0])}
            />
          </div>
          <div className="col-span-1 pl-2 text-gray-500">
            <NumberFlow
              willChange
              value={maxTokens}
              isolate
              continuous
              opacityTiming={{
                duration: 250,
                easing: "ease-out",
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-10">
          <Label
            htmlFor="presencePenalty"
            className="col-span-3 flex items-center space-x-1 text-gray-700"
          >
            <p>存在惩罚</p>
            <InfoTooltip content="存在惩罚会影响模型重复提示中已有信息的可能性，0 意味着没有惩罚。" />
          </Label>
          <div className="col-span-6 flex items-center">
            <Slider
              id="presencePenalty"
              value={[presencePenalty]}
              min={0}
              max={1}
              step={0.1}
              onValueChange={(value) => setPresencePenalty(value[0])}
            />
          </div>
          <div className="col-span-1 pl-2 text-gray-500">
            <NumberFlow
              willChange
              value={presencePenalty}
              isolate
              continuous
              opacityTiming={{
                duration: 250,
                easing: "ease-out",
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-10">
          <Label
            htmlFor="frequencyPenalty"
            className="col-span-3 flex items-center space-x-1 text-gray-700"
          >
            <p>频率惩罚</p>
            <InfoTooltip content="频率惩罚会影响模型重复使用相同单词或短语的可能性，0 意味着没有惩罚。" />
          </Label>
          <div className="col-span-6 flex items-center">
            <Slider
              id="frequencyPenalty"
              value={[frequencyPenalty]}
              min={0}
              max={1}
              step={0.1}
              onValueChange={(value) => setFrequencyPenalty(value[0])}
            />
          </div>
          <div className="col-span-1 pl-2 text-gray-500">
            <NumberFlow
              willChange
              value={frequencyPenalty}
              isolate
              continuous
              opacityTiming={{
                duration: 250,
                easing: "ease-out",
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end border-gray-100 border-t bg-gray-50 p-4">
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={isSubmitting}
          text="保存"
          className="h-8 w-fit"
        />
      </div>
    </form>
  );
}
