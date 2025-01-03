"use client";

import { OfficeBuilding } from "@/components/icons";
import { EmptyState } from "@/components/layout";
import { Button } from "@/components/ui";
import { redirect, useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function InvitePage() {
  const { code } = useParams<{ code: string }>();
  const [loading, setLoading] = useState(false);

  const joinWorkspace = async () => {
    setLoading(true);
    const res = await fetch(`/api/workspaces/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
      }),
    });
    if (res.ok) {
      const json = await res.json();
      redirect(`/${json.id}`);
    } else {
      const { message } = await res.json();
      toast.error(message);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 text-center">
      <EmptyState
        icon={OfficeBuilding}
        title="加入工作空间"
        description="加入工作空间后，您将拥有该工作空间的完全访问权限"
      />
      <Button text="确认加入" onClick={joinWorkspace} loading={loading} />
    </div>
  );
}
