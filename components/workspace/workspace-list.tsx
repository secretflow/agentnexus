"use client";

import { useWorkspaces } from "@/lib/swr";
import { EmptyWorkspaceIndicator } from "./empty-workspace-indicator";
import { WorkspaceCard } from "./workspace-card";
import { WorkspaceCardPlaceholder } from "./workspace-card-placeholder";

export function WorkspaceList() {
  const { workspaces, loading } = useWorkspaces();

  if (loading) {
    return Array.from({ length: 6 }).map((_, i) => <WorkspaceCardPlaceholder key={i} />);
  }

  if (!workspaces || workspaces.length === 0) {
    return <EmptyWorkspaceIndicator />;
  }

  return workspaces.map((d) => <WorkspaceCard key={d.id} {...d} />);
}
