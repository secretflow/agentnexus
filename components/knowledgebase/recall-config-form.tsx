"use client";

import { X } from "@/components/icons";
import { Button, InfoTooltip, Input, Label, Slider } from "@/components/ui";
import { DEFAULT_RECALL_CONFIG } from "@/lib/constants";
import { useMediaQuery } from "@/lib/hooks";
import { type RecallConfigProps, RecallConfigSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import NumberFlow from "@number-flow/react";
import { Radar } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function RecallConfigForm({
  config,
  onSuccess,
  onClose,
}: {
  config?: RecallConfigProps;
  onSuccess?: (data: RecallConfigProps) => void;
  onClose?: () => void;
}) {
  const { isMobile } = useMediaQuery();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<RecallConfigProps>({
    resolver: zodResolver(RecallConfigSchema),
    defaultValues: config || DEFAULT_RECALL_CONFIG,
  });

  const [semantics, setSemantics] = useState(config?.semantics || DEFAULT_RECALL_CONFIG.semantics);

  const onSubmit = handleSubmit(async (data: RecallConfigProps) => {
    onSuccess?.({
      ...data,
      semantics,
    });
  });

  return (
    <form onSubmit={onSubmit}>
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-6 items-center justify-center rounded-full bg-gray-100 px-0 sm:size-6 [&>*]:size-3 sm:[&>*]:size-4">
            <Radar className="size-4" />
          </div>
          <h3 className="!mt-0 max-w-sm truncate font-medium text-lg">召回配置</h3>
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
        <div>
          <Label htmlFor="semantics" className="flex items-center space-x-1 text-gray-700">
            <p>权重</p>
            <InfoTooltip content="配置语义检索和关键字检索的权重占比" />
          </Label>
          <div className="mt-2">
            <Slider
              id="semantics"
              value={[semantics]}
              min={0}
              max={1}
              step={0.1}
              onValueChange={(value) => setSemantics(value[0])}
              autoFocus={!isMobile}
            />
            <div className="mt-1 flex justify-between text-gray-500 text-sm">
              <div className="space-x-1">
                <span>语义</span>
                <NumberFlow
                  willChange
                  value={semantics}
                  isolate
                  continuous
                  opacityTiming={{
                    duration: 250,
                    easing: "ease-out",
                  }}
                />
              </div>
              <div className="space-x-1">
                <span>关键字</span>
                <NumberFlow
                  willChange
                  value={1 - semantics}
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
        </div>
      </div>

      <div className="space-y-6 px-6 py-4">
        <div>
          <Label htmlFor="topK" className="flex items-center space-x-1 text-gray-700">
            <p>TopK</p>
            <InfoTooltip content="筛选出与用户问题相关的文本片段数量" />
          </Label>
          <div className="mt-2">
            <Input
              id="topK"
              type="number"
              autoComplete="off"
              placeholder="输入 TopK"
              min={1}
              {...register("topK", {
                required: true,
                valueAsNumber: true,
              })}
            />
            {errors.topK && <p className="mt-2 text-red-600 text-sm">{errors.topK.message}</p>}
          </div>
        </div>
      </div>

      <div className="space-y-6 px-6 py-4">
        <div>
          <Label htmlFor="score" className="flex items-center space-x-1 text-gray-700">
            <p>Score</p>
            <InfoTooltip content="文本片段与用户问题相识度阈值" />
          </Label>
          <div className="mt-2">
            <Input
              id="score"
              type="number"
              autoComplete="off"
              placeholder="输入 Score"
              step={0.01}
              min={0.1}
              max={1}
              {...register("score", {
                required: true,
                valueAsNumber: true,
              })}
            />
            {errors.score && <p className="mt-2 text-red-600 text-sm">{errors.score.message}</p>}
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
