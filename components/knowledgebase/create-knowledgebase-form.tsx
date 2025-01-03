"use client";

import { ModelSelector } from "@/components/model";
import { Button, InfoTooltip, Input, Label, Textarea } from "@/components/ui";
import { useMediaQuery } from "@/lib/hooks";
import { useWorkspace } from "@/lib/swr";
import { cn } from "@/lib/utils";
import {
  type CreateKnowledgebaseProps,
  CreateKnowledgebaseSchema,
  type KnowledgebaseProps,
} from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { mutate } from "swr";

export function CreateKnowledgebaseForm({
  onSuccess,
  className,
}: {
  onSuccess?: (data: KnowledgebaseProps) => void;
  className?: string;
}) {
  const { isMobile } = useMediaQuery();
  const { workspace } = useWorkspace();

  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<CreateKnowledgebaseProps>({
    resolver: zodResolver(CreateKnowledgebaseSchema),
    defaultValues: {
      name: "",
      description: "",
      model: {},
    },
  });

  const onSubmit = handleSubmit(async (data: CreateKnowledgebaseProps) => {
    try {
      const res = await fetch(`/api/knowledgebases?workspaceId=${workspace?.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const json = await res.json();
        await mutate(`/api/knowledgebases?workspaceId=${workspace?.id}`);
        onSuccess?.(json);
      } else {
        const { message } = await res.json();
        toast.error(message);
      }
    } catch (e) {
      toast.error("知识库创建失败，请稍后重试！");
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
            maxLength={32}
            placeholder="输入知识库名称"
            {...register("name", {
              required: true,
            })}
          />
          {errors.name && <p className="mt-2 text-red-600 text-sm">{errors.name.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="model" className="flex items-center space-x-1 text-gray-700">
          <p>Embedding 模型</p>
          <InfoTooltip content="使用 Embedding 模型处理文档片段和用户输入消息" />
        </Label>
        <div className="mt-2">
          <Controller
            control={control}
            {...register("model", {
              required: true,
            })}
            render={({ field: { value, onChange } }) => (
              <ModelSelector type="embedding" className="h-10" value={value} onChange={onChange} />
            )}
          />
          {errors?.model?.id && (
            <p className="mt-2 text-red-600 text-sm">{errors.model.id.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="description" className="flex items-center space-x-1 text-gray-700">
          <p>描述</p>
          <InfoTooltip content="知识库描述信息可帮助你和团队快速了解知识库上下文" />
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

      <Button loading={isSubmitting} disabled={isSubmitting} text="创建知识库" />
    </form>
  );
}
