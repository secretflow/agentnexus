"use client";

import { cn } from "@/lib/utils";
import { Link } from "next-view-transitions";
import { useParams, useSelectedLayoutSegment } from "next/navigation";
import { type ElementType, type ReactNode, useMemo } from "react";

export function NavLink({
  segment,
  icon: Icon,
  children,
}: {
  segment: string | null;
  icon: ElementType;
  children: ReactNode;
}) {
  const selectedLayoutSegment = useSelectedLayoutSegment();
  const { applicationId, workspaceId } = useParams<{
    applicationId?: string;
    workspaceId?: string;
  }>();

  const href = useMemo(() => {
    let base = "";

    if (!workspaceId) {
      base = "/account/settings";
    } else if (!applicationId) {
      base = `/${workspaceId}/settings`;
    } else {
      base = `/${workspaceId}/${applicationId}/settings`;
    }

    return `${base}${segment ? `/${segment}` : ""}`;
  }, [applicationId, workspaceId, segment]);

  const isSelected = selectedLayoutSegment === segment;

  return (
    <Link
      key={href}
      href={href}
      className={cn(
        "mt-0.5 flex items-center gap-2.5 whitespace-nowrap rounded-lg p-2 text-gray-950 text-sm outline-none transition-all duration-75",
        "ring-black/50 focus-visible:ring-2",
        isSelected ? "bg-gray-950/5" : "hover:bg-gray-950/5 active:bg-gray-950/10",
      )}
    >
      {Icon && (
        <Icon className={cn("size-4 shrink-0", isSelected ? "text-gray-950" : "text-gray-700")} />
      )}
      {children}
    </Link>
  );
}
