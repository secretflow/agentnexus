"use client";

import { DeleteAccount, UpdateSubscription } from "@/components/account";
import { FormCard } from "@/components/ui";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function AccountSettings() {
  const { data: session, update, status } = useSession();

  return (
    <>
      <FormCard
        title="用户名"
        description="修改你的用户名"
        inputAttrs={{
          name: "name",
          defaultValue: status === "loading" ? undefined : session?.user?.name || "",
          placeholder: "agentnexus",
          maxLength: 32,
        }}
        helpText="限制 1-32 个字符"
        handleSubmit={(data) =>
          fetch("/api/user", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }).then(async (res) => {
            if (res.ok) {
              const json = await res.json();
              update(json);
              toast.success("用户名更新成功");
            } else {
              const { message } = await res.json();
              toast.error(message);
            }
          })
        }
      />
      <FormCard
        title="邮箱"
        description="修改你的邮箱"
        inputAttrs={{
          name: "email",
          type: "email",
          defaultValue: session?.user?.email || undefined,
          placeholder: "support@example.com",
        }}
        helpText={<UpdateSubscription />}
        handleSubmit={(data) =>
          fetch("/api/user", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }).then(async (res) => {
            if (res.ok) {
              const json = await res.json();
              update(json);
              toast.success("邮箱更新成功！");
            } else {
              const { message } = await res.json();
              toast.error(message);
            }
          })
        }
      />
      <DeleteAccount />
    </>
  );
}
