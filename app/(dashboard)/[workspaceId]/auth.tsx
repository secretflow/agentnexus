"use client";

import { LayoutLoader } from "@/components/layout";
import { WorkspaceNotFound } from "@/components/workspace";
import { useWorkspace } from "@/lib/swr";
import type { ReactNode } from "react";

export function WorkspaceAuth({ children }: { children: ReactNode }) {
  const { loading, error } = useWorkspace();

  if (loading) {
    return <LayoutLoader />;
  }

  if (error && error.status === 404) {
    return <WorkspaceNotFound />;
  }

  return children;
}
