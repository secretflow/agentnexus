"use client";

import { ArrowTurnLeft, X } from "@/components/icons";
import { Button, InfoTooltip, Input, Label } from "@/components/ui";
import { useMediaQuery } from "@/lib/hooks";
import { type SplitConfigProps, SplitConfigSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SquareSplitVertical } from "lucide-react";
import { useForm } from "react-hook-form";

export function SplitterConfigForm({
  config,
  onSuccess,
  onClose,
}: {
  config?: SplitConfigProps;
  onSuccess?: (data: SplitConfigProps) => void;
  onClose?: () => void;
}) {
  const { isMobile } = useMediaQuery();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SplitConfigProps>({
    resolver: zodResolver(SplitConfigSchema),
    defaultValues: config || {
      chunkSize: 500,
      chunkOverlap: 50,
      separators: "",
    },
  });

  const onSubmit = handleSubmit(async (data: SplitConfigProps) => {
    onSuccess?.(data);
  });

  return (
    <form
      onSubmit={(e) => {
        e.stopPropagation();
        onSubmit();
      }}
    >
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-6 items-center justify-center rounded-full bg-gray-100 px-0 sm:size-6 [&>*]:size-3 sm:[&>*]:size-4">
            <SquareSplitVertical className="size-4" />
          </div>
          <h3 className="!mt-0 max-w-sm truncate font-medium text-lg">分段配置</h3>
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
          <Label htmlFor="separators" className="flex items-center space-x-1 text-gray-700">
            <p>分段标识符</p>
            <InfoTooltip content="文本默认按段落分段。若段落长度超过最大限制，则按行分段；若仍超过限制，则按空格分段。您可以自定义分段标识符，设置多个时用逗号隔开" />
          </Label>
          <div className="mt-2">
            <Input
              id="separators"
              autoComplete="off"
              placeholder="输入分段标识符"
              maxLength={32}
              autoFocus={!isMobile}
              {...register("separators", {
                required: true,
              })}
            />
            {errors.separators && (
              <p className="mt-2 text-red-600 text-sm">{errors.separators.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="chunkSize" className="flex items-center space-x-1 text-gray-700">
            <p>分段最大长度</p>
            <InfoTooltip content="限制每段的最大长度，默认是 500" />
          </Label>
          <div className="mt-2">
            <Input
              id="chunkSize"
              type="number"
              autoComplete="off"
              placeholder="输入分段最大长度"
              min={1}
              {...register("chunkSize", {
                required: true,
                valueAsNumber: true,
              })}
            />
            {errors.chunkSize && (
              <p className="mt-2 text-red-600 text-sm">{errors.chunkSize.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="chunkOverlap" className="flex items-center space-x-1 text-gray-700">
            <p>分段重叠长度</p>
            <InfoTooltip content="设置分段之间的重叠长度可以保留分段之间的语义关系，建议设置成最大分段长度的 10%~25%" />
          </Label>
          <div className="mt-2">
            <Input
              id="chunkOverlap"
              type="number"
              autoComplete="off"
              placeholder="输入分段重叠长度"
              min={1}
              {...register("chunkOverlap", {
                required: true,
                valueAsNumber: true,
              })}
            />
            {errors.chunkOverlap && (
              <p className="mt-2 text-red-600 text-sm">{errors.chunkOverlap.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end border-gray-100 border-t bg-gray-50 p-4">
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={isSubmitting}
          text={
            <span className="flex items-center gap-2">
              <span>保存</span>
              <div className="rounded border border-white/20 p-1">
                <ArrowTurnLeft className="size-3.5" />
              </div>
            </span>
          }
          className="h-8 w-fit pr-1.5 pl-2.5"
        />
      </div>
    </form>
  );
}
