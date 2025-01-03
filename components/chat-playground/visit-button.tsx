"use client";

import { Button } from "@/components/ui";
import { useApplication } from "@/lib/swr";
import { useCallback } from "react";

export function VisitChatAppButton() {
  const { application } = useApplication();

  const visitWebApp = useCallback(() => {
    if (!application) {
      return;
    }
    // Open web app
    window.open(`${location.origin}/chat/${application.id}`, "_blank");
  }, [application]);

  return (
    <div>
      <Button
        text="访问"
        className="flex-shrink-0 truncate"
        onClick={visitWebApp}
        disabledTooltip={!application?.published ? "应用未发布" : undefined}
      />
    </div>
  );
}
