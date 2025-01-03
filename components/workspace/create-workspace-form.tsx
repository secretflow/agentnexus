"use client";

import { Button, InfoTooltip, Input, Label } from "@/components/ui";
import { useMediaQuery } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { type CreateWorkspaceProps, CreateWorkspaceSchema, type WorkspaceProps } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { mutate } from "swr";

export function CreateWorkspaceForm({
  onSuccess,
  className,
}: {
  onSuccess?: (data: WorkspaceProps) => void;
  className?: string;
}) {
  const { isMobile } = useMediaQuery();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<CreateWorkspaceProps>({
    resolver: zodResolver(CreateWorkspaceSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = handleSubmit(async (data: CreateWorkspaceProps) => {
    try {
      const res = await fetch("/api/workspaces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const json = await res.json();
        await mutate("/api/workspaces");
        onSuccess?.(json);
      } else {
        const { message } = await res.json();
        toast.error(message);
      }
    } catch (e) {
      toast.error("创建工作空间失败，请稍后重试！");
    }
  });

  return (
    <form onSubmit={onSubmit} className={cn("flex flex-col space-y-6 text-left", className)}>
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
            placeholder="输入工作空间名称"
            maxLength={32}
            {...register("name")}
          />
          {errors.name && (
            <p className="mt-2 text-red-600 text-sm" id="slug-error">
              {errors.name.message}
            </p>
          )}
        </div>
      </div>
      <Button loading={isSubmitting} disabled={isSubmitting} text="创建工作空间" />
    </form>
  );
}
