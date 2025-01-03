"use client";

import { Button, InfoTooltip, Input, Label } from "@/components/ui";
import { useMediaQuery } from "@/lib/hooks";
import { useApplication } from "@/lib/swr";
import { cn } from "@/lib/utils";
import { type CreateTokenProps, CreateTokenSchema } from "@/lib/zod";
import type { TokenProps } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { mutate } from "swr";

export function UpsertTokenForm({
  token,
  onSuccess,
  className,
}: {
  token?: TokenProps;
  onSuccess?: (data: { token: string }) => void;
  className?: string;
}) {
  const { application } = useApplication();
  const { isMobile } = useMediaQuery();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<CreateTokenProps>({
    resolver: zodResolver(CreateTokenSchema),
    defaultValues: {
      name: token?.name || "",
    },
  });

  const endpoint = useMemo(() => {
    if (token) {
      return {
        method: "PATCH",
        url: `/api/applications/${application?.id}/tokens/${token.id}?workspaceId=${application?.workspaceId}`,
        successMessage: "API 秘钥更新成功！",
      };
    } else {
      return {
        method: "POST",
        url: `/api/applications/${application?.id}/tokens?workspaceId=${application?.workspaceId}`,
        successMessage: "API 秘钥创建成功!",
      };
    }
  }, [token]);

  const onSubmit = handleSubmit(async (data: CreateTokenProps) => {
    try {
      const res = await fetch(endpoint.url, {
        method: endpoint.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const json = await res.json();
        await mutate(
          `/api/applications/${application?.id}/tokens?workspaceId=${application?.workspaceId}`,
        );
        toast.success(endpoint.successMessage);
        onSuccess?.(json);
      } else {
        const { message } = await res.json();
        toast.error(message);
      }
    } catch (e) {
      toast.error("API 秘钥创建失败，请稍后重试！");
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
            placeholder="输入 API 秘钥名称"
            {...register("name")}
          />
          {errors.name && (
            <p className="mt-2 text-red-600 text-sm" id="slug-error">
              {errors.name.message}
            </p>
          )}
        </div>
      </div>
      <Button
        loading={isSubmitting}
        disabled={isSubmitting}
        text={token ? "编辑 API 秘钥" : "创建 API 秘钥"}
      />
    </form>
  );
}
