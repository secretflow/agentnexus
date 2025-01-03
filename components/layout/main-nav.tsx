"use client";

import { Divider, Logo } from "@/components/icons";
import { UserDropdown } from "@/components/layout";
import { WorkspaceSwitcher } from "@/components/workspace";
import { useScroll } from "@/lib/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { Link } from "next-view-transitions";
import { useParams } from "next/navigation";

export function MainNav() {
  const { workspaceId } = useParams<{ workspaceId?: string }>();
  const scrolled = useScroll(80);
  const sink = !!workspaceId && scrolled;

  return (
    <div className="flex h-16 items-center justify-between">
      <div className="flex items-center">
        <Link
          href={`/${workspaceId || "workspaces"}`}
          className={cn("hidden transition-all sm:block", sink && "translate-y-[3.4rem]")}
        >
          <Logo
            className={cn("transition-all duration-75 active:scale-95", sink ? "size-6" : "size-8")}
          />
        </Link>
        <Divider className="hidden size-8 text-gray-200 sm:ml-3 sm:block" />
        <WorkspaceSwitcher />
      </div>
      <div className="flex items-center space-x-6">
        <UserDropdown />
      </div>
    </div>
  );
}
