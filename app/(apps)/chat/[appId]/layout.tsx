import { AppSidebar } from "@/components/chat";
import { SidebarInset, SidebarProvider } from "@/components/ui";
import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { ChatAppAuth } from "./auth";

export default async function ChatLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const isCollapsed = cookieStore.get("sidebar:state")?.value == "false";

  return (
    <ChatAppAuth>
      <SidebarProvider defaultOpen={!isCollapsed}>
        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </ChatAppAuth>
  );
}
