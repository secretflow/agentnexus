"use client";

import { Button, InfoTooltip, Input, Label, Textarea } from "@/components/ui";
import { useMediaQuery } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { type VariableProps, VariableSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { VariableTypeSelector } from ".";

export function UpsertVariableForm({
  props,
  onSuccess,
  className,
}: {
  props?: VariableProps;
  onSuccess?: (data: VariableProps) => void;
  className?: string;
}) {
  const { isMobile } = useMediaQuery();

  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<VariableProps>({
    resolver: zodResolver(VariableSchema),
    defaultValues: props || {
      type: "string",
      name: "",
      required: false,
      maxLength: 48,
      description: "",
    },
  });

  const onSubmit = handleSubmit(async (data: VariableProps) => {
    onSuccess?.(data);
  });

  return (
    <form onSubmit={onSubmit} className={cn("flex flex-col space-y-6 text-left", className)}>
      <div>
        <Label htmlFor="type" className="flex items-center space-x-2 text-gray-700">
          类型
        </Label>
        <div className="mt-2">
          <Controller
            control={control}
            name="type"
            render={({ field: { onChange, value } }) => (
              <VariableTypeSelector value={value} onChange={onChange} />
            )}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="name" className="flex items-center space-x-1 text-gray-700">
          <p>名称</p>
          <InfoTooltip content="名称需要唯一，长度限制为 1-32 个字符" />
        </Label>
        <div className="mt-2">
          <Input
            id="name"
            autoFocus={!isMobile}
            autoComplete="off"
            placeholder="输入变量名称"
            {...register("name", {
              required: true,
            })}
          />
          {errors.name && <p className="mt-2 text-red-600 text-sm">{errors.name.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="description" className="flex items-center space-x-1 text-gray-700">
          <p>描述</p>
          <InfoTooltip content="通过给变量添加一些描述信息，让你和你的团队快速获取变量的上下文信息" />
        </Label>
        <div className="mt-2">
          <Textarea
            id="description"
            autoComplete="off"
            placeholder="输入变量描述信息"
            {...register("description")}
          />
          {errors.description && (
            <p className="mt-2 text-red-600 text-sm">{errors.description.message}</p>
          )}
        </div>
      </div>

      <Button
        loading={isSubmitting}
        disabled={isSubmitting}
        text={`${props ? "编辑" : "添加"}变量`}
      />
    </form>
  );
}
