"use client";

import { Button, Tooltip } from "@/components/ui";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from "@/components/ui";
import { PlusIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { SidebarHistory } from "./sidebar-history";

export function AppSidebar() {
  const router = useRouter();
  const { appId } = useParams<{ appId: string }>();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar className="group-data-[side=left]:border-r-0">
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex flex-row items-center justify-between">
            <div
              onClick={() => {
                setOpenMobile(false);
                router.push(`/chat/${appId}`);
                router.refresh();
              }}
              className="flex flex-row items-center gap-3"
            >
              <span className="cursor-pointer rounded-md px-2 font-semibold text-lg hover:bg-muted">
                聊天应用
              </span>
            </div>
            <Tooltip content="New Chat" align="start">
              <Button
                variant="ghost"
                className="size-8 px-0 text-gray-600"
                icon={<PlusIcon size={20} />}
                onClick={() => {
                  setOpenMobile(false);
                  router.push(`/chat/${appId}`);
                  router.refresh();
                }}
              />
            </Tooltip>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarHistory />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
