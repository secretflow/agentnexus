"use client";

import { Tooltip, useSidebar } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/lib/hooks";
import type { ModelProps } from "@/lib/zod";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { SidebarToggle } from "./sidebar-toggle";

export function ChatHeader({ appId, model }: { appId: string; model: ModelProps }) {
  const router = useRouter();
  const { open } = useSidebar();

  const { width: windowWidth } = useMediaQuery() as { width: number };

  return (
    <header className="sticky top-0 flex items-center gap-2 bg-background px-2 py-1.5 md:px-2">
      <SidebarToggle />
      {(!open || windowWidth < 768) && (
        <Tooltip content="新聊天">
          <Button
            variant="secondary"
            className="order-2 ml-auto size-8 px-0 md:order-1 md:ml-0"
            onClick={() => {
              router.push(`/chat/${appId}`);
              router.refresh();
            }}
            icon={<PlusIcon />}
          />
        </Tooltip>
      )}
      <p className="font-medium text-gray-700">{model.id}</p>
    </header>
  );
}
