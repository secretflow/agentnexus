"use client";

import { ArrowTurnLeft, X } from "@/components/icons";
import { useSplitterConfigModal } from "@/components/modals";
import { Button, FileUpload, InfoTooltip, Input, Label } from "@/components/ui";
import { useMediaQuery } from "@/lib/hooks";
import { useKnowledgebase } from "@/lib/swr";
import { getFileExtension, truncate } from "@/lib/utils";
import {
  type CreateKnowledgebaseResourceProps,
  CreateKnowledgebaseResourceSchema,
  type KnowledgebaseResourceProps,
  UpdateKnowledgebaseResourceSchema,
} from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FilePlus, SquareSplitVertical } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { mutate } from "swr";

export function UpsertDocumentForm({
  doc,
  onClose,
}: {
  doc?: KnowledgebaseResourceProps;
  onClose?: () => void;
}) {
  const { isMobile } = useMediaQuery();
  const { knowledgebase } = useKnowledgebase();

  const { SplitterConfigModal, setShowSplitterConfigModal } = useSplitterConfigModal({
    config: doc?.splitConfigs,
    onSubmit(data) {
      setValue("splitConfigs", data);
      setShowSplitterConfigModal(false);
    },
  });

  const {
    watch,
    register,
    control,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<CreateKnowledgebaseResourceProps>({
    resolver: zodResolver(
      doc ? UpdateKnowledgebaseResourceSchema : CreateKnowledgebaseResourceSchema,
    ),
    defaultValues: doc || {
      name: "",
      enabled: true,
      metadata: {
        size: 0,
        filename: "",
        fileType: "",
      },
      splitConfigs: {
        chunkSize: 500,
        chunkOverlap: 50,
        separators: "",
      },
    },
  });

  const uploadFile = watch("file");

  const onSubmit = handleSubmit(async (data: CreateKnowledgebaseResourceProps) => {
    let res: Response;

    if (doc) {
      res = await fetch(
        `/api/knowledgebases/${knowledgebase?.id}/resources/${doc.id}?workspaceId=${knowledgebase?.workspaceId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );
    } else {
      const { file, ...rest } = data;
      const formData = new FormData();

      if (file instanceof File) {
        const fileType = getFileExtension(file.name);

        formData.append("file", file);
        formData.append("fileType", fileType);

        rest.metadata.size = file.size;
        rest.metadata.filename = file.name;
        rest.metadata.fileType = fileType;
      }
      formData.append("data", JSON.stringify(rest));

      res = await fetch(
        `/api/knowledgebases/${knowledgebase?.id}/resources?workspaceId=${knowledgebase?.workspaceId}`,
        {
          method: "POST",
          body: formData,
        },
      );
    }

    if (res) {
      if (res.ok) {
        await mutate(
          `/api/knowledgebases/${knowledgebase?.id}/resources?workspaceId=${knowledgebase?.workspaceId}`,
        );
        toast.success(`文档${doc ? "编辑" : "添加"}成功！`);
        onClose?.();
      } else {
        const { message } = await res.json();
        toast.error(message);
      }
    }
  });

  return (
    <form onSubmit={onSubmit}>
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-6 items-center justify-center rounded-full bg-gray-100 px-0 sm:size-6 [&>*]:size-3 sm:[&>*]:size-4">
            <FilePlus className="size-4" />
          </div>
          <h3 className="!mt-0 max-w-sm truncate font-medium text-lg">
            {doc ? "编辑" : "添加"}文档
          </h3>
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
          <Label htmlFor="file" className="flex items-center space-x-2 text-gray-700">
            <p>上传文件</p>
            <InfoTooltip content="文件格式支持 TXT、PDF、DOCX、HTML、MARKDOWN" />
          </Label>
          <div className="mt-2">
            <Controller
              control={control}
              name="file"
              render={({ field: { onChange } }) => (
                <FileUpload
                  accept="any"
                  disabled={!!doc}
                  maxFileSizeMB={1024}
                  onChange={({ file }) => {
                    onChange(file);
                    setValue("name", file.name);
                    clearErrors("name");
                  }}
                  content={
                    doc
                      ? doc.metadata.filename
                      : uploadFile
                        ? truncate(uploadFile.name, 25)
                        : "点击或者拖拽上传文档"
                  }
                  className="aspect-auto h-24"
                  iconClassName="size-6"
                />
              )}
            />
            {errors.file && <p className="mt-2 text-red-600 text-sm">{errors.file.message}</p>}
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
              className="max-w-[550px]"
              autoComplete="off"
              placeholder="输入文档名称"
              maxLength={32}
              autoFocus={!isMobile}
              {...register("name", {
                required: true,
              })}
            />
            {errors.name && <p className="mt-2 text-red-600 text-sm">{errors.name.message}</p>}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-gray-100 border-t bg-gray-50 p-4">
        <div>
          <Button
            icon={<SquareSplitVertical className="size-3.5" />}
            type="button"
            onClick={() => setShowSplitterConfigModal(true)}
            variant="secondary"
            className="h-8 w-fit pr-1.5 pl-2.5"
            text="分段配置"
            disabled={!!doc}
          />
        </div>
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={isSubmitting}
          text={
            <span className="flex items-center gap-2">
              {doc ? "保存" : "创建"}
              <div className="rounded border border-white/20 p-1">
                <ArrowTurnLeft className="size-3.5" />
              </div>
            </span>
          }
          className="h-8 w-fit pr-1.5 pl-2.5"
        />
      </div>
      <SplitterConfigModal />
    </form>
  );
}
