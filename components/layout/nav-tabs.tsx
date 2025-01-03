"use client";

import { useScroll } from "@/lib/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Link } from "next-view-transitions";
import { useParams, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";

export function NavTabs() {
  const pathname = usePathname();
  const { workspaceId, applicationId } = useParams<{
    workspaceId?: string;
    applicationId?: string;
  }>();

  const tabs = useMemo(() => {
    if (workspaceId) {
      if (applicationId) {
        return [
          { name: "工作区", href: `/${workspaceId}/${applicationId}` },
          { name: "数据分析", href: `/${workspaceId}/${applicationId}/analytics` },
          { name: "设置", href: `/${workspaceId}/${applicationId}/settings` },
        ];
      } else {
        return [
          { name: "应用", href: `/${workspaceId}` },
          { name: "知识库", href: `/${workspaceId}/knowledgebases` },
          { name: "工具", href: `/${workspaceId}/tools` },
          { name: "设置", href: `/${workspaceId}/settings` },
        ];
      }
    }

    return [];
  }, [workspaceId, applicationId]);

  const isActive = useCallback(
    (href: string) => {
      if (workspaceId) {
        if (applicationId) {
          if (href === `/${workspaceId}/${applicationId}`) {
            return pathname === href;
          }
        } else {
          if (href === `/${workspaceId}`) {
            return pathname === href;
          }
        }

        return pathname.startsWith(href);
      }

      return false;
    },
    [workspaceId, pathname],
  );

  const scrolled = useScroll(80);

  if (!workspaceId) return null;

  return (
    <div
      className={cn(
        "scrollbar-hide relative flex gap-x-2 overflow-x-auto transition-all",
        scrolled && "sm:translate-x-9",
      )}
    >
      {tabs.map(({ name, href }) => {
        return (
          <Link key={href} href={href} className="relative">
            <div className="mx-1 my-1.5 rounded-md px-3 py-1.5 transition-all duration-75 hover:bg-gray-100 active:bg-gray-200">
              <p className="text-gray-600 text-sm hover:text-black">{name}</p>
            </div>
            {isActive(href) && (
              <motion.div
                layoutId="indicator"
                transition={{
                  duration: 0.25,
                }}
                className="absolute bottom-0 w-full"
              >
                <div className="h-0.5 bg-black" />
              </motion.div>
            )}
          </Link>
        );
      })}
    </div>
  );
}
