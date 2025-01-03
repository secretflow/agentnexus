"use client";

import { FormCard } from "@/components/ui";
import { DeleteWorkspace } from "@/components/workspace";
import { useWorkspace } from "@/lib/swr";
import { toast } from "sonner";
import { mutate } from "swr";

export default function WorkspaceSettings() {
  const { workspace } = useWorkspace();

  if (!workspace) {
    return null;
  }

  const { id, name } = workspace;

  return (
    <>
      <FormCard
        title="工作空间名称"
        description="更改工作空间的名称"
        inputAttrs={{
          name: "name",
          defaultValue: name,
          placeholder: "工作空间名称",
          minLength: 1,
          maxLength: 32,
        }}
        helpText="1-32 个字符"
        handleSubmit={(updateData) =>
          fetch(`/api/workspaces/${id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
          }).then(async (res) => {
            if (res.status === 200) {
              await Promise.all([mutate("/api/workspaces"), mutate(`/api/workspaces/${id}`)]);
              toast.success("工作空间名称已更新！");
            } else {
              const { message } = await res.json();
              toast.error(message);
            }
          })
        }
      />
      <DeleteWorkspace
        disabledTooltip={workspace.isOwner ? undefined : "仅工作空间所有者可删除工作空间"}
      />
    </>
  );
}
