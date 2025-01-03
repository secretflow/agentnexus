"use client";

import { Button, InfoTooltip, Input, Label, Textarea } from "@/components/ui";
import { useMediaQuery } from "@/lib/hooks";
import { useWorkspace } from "@/lib/swr";
import { cn } from "@/lib/utils";
import {
  type ApplicationProps,
  type CreateApplicationProps,
  CreateApplicationSchema,
} from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { mutate } from "swr";
import { ApplicationTypeRadioSelector } from "./application-types";

export function CreateApplicationForm({
  onSuccess,
  className,
}: {
  onSuccess?: (data: ApplicationProps) => void;
  className?: string;
}) {
  const { isMobile } = useMediaQuery();
  const { workspace } = useWorkspace();

  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<CreateApplicationProps>({
    resolver: zodResolver(CreateApplicationSchema),
    defaultValues: {
      name: "",
      type: "agent",
      description: "",
    },
  });

  const onSubmit = handleSubmit(async (data: CreateApplicationProps) => {
    try {
      const res = await fetch(`/api/applications?workspaceId=${workspace?.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const json = await res.json();
        await mutate(`/api/applications?workspaceId=${workspace?.id}`);
        onSuccess?.(json);
      } else {
        const { message } = await res.json();
        toast.error(message);
      }
    } catch (e) {
      toast.error("应用创建失败，请稍后重试！");
    }
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
              <ApplicationTypeRadioSelector value={value} onChange={onChange} />
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
            placeholder="输入应用名称"
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
          <InfoTooltip content="应用描述信息可帮助你和团队快速了解应用上下文" />
        </Label>
        <div className="mt-2">
          <Textarea
            id="description"
            placeholder="添加描述"
            {...register("description", {
              required: false,
            })}
          />
          {errors.description && (
            <p className="mt-2 text-red-600 text-sm">{errors.description.message}</p>
          )}
        </div>
      </div>

      <Button loading={isSubmitting} disabled={isSubmitting} text="创建应用" />
    </form>
  );
}
