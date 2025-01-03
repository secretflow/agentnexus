"use client";

import { Button } from "@/components/ui";
import { useApplication } from "@/lib/swr";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export function PublishChatAppButton() {
  const { application, mutate } = useApplication();
  const [loading, setLoading] = useState(false);

  const togglePublishState = useCallback(async () => {
    if (!application) {
      return;
    }

    const publishState = !application.published;

    try {
      setLoading(true);
      const res = await fetch(
        `/api/applications/${application?.id}?workspaceId=${application?.workspaceId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            published: publishState,
          }),
        },
      );
      if (res.ok) {
        await mutate();
        toast.success(publishState ? "发布成功！" : "取消发布成功！");
      } else {
        const { message } = await res.json();
        toast.error(message);
      }
    } catch (e) {
      toast.error(`${publishState ? "发布" : "取消发布"}失败，请稍后重试！`);
    } finally {
      setLoading(false);
    }
  }, [application]);

  if (!application) {
    return null;
  }

  return (
    <div>
      <Button
        text={application.published ? "取消发布" : "发布"}
        variant="secondary"
        className="flex-shrink-0 truncate"
        onClick={togglePublishState}
        loading={loading}
      />
    </div>
  );
}
