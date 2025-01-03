"use client";

import { DeleteApplication } from "@/components/application";
import { FormCard } from "@/components/ui";
import { useApplication } from "@/lib/swr";
import { toast } from "sonner";
import { mutate } from "swr";

export default function ApplicationSettings() {
  const { application } = useApplication();

  if (!application) {
    return null;
  }

  const { id, name, workspaceId } = application;

  return (
    <>
      <FormCard
        title="应用名称"
        description="更改应用的名称"
        inputAttrs={{
          name: "name",
          defaultValue: name,
          placeholder: "应用名称",
          minLength: 1,
          maxLength: 32,
        }}
        helpText="1-32 个字符"
        handleSubmit={(updateData) =>
          fetch(`/api/applications/${id}?workspaceId=${workspaceId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
          }).then(async (res) => {
            if (res.status === 200) {
              await Promise.all([
                mutate(`/api/applications?workspaceId=${workspaceId}`),
                mutate(`/api/applications/${id}?workspaceId=${workspaceId}`),
              ]);
              toast.success("应用名称已更新！");
            } else {
              const { message } = await res.json();
              toast.error(message);
            }
          })
        }
      />
      <DeleteApplication />
    </>
  );
}
