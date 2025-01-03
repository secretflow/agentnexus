import { fetcher } from "@/lib/utils";
import type { WorkspaceWithRoleProps } from "@/lib/zod";
import { useParams } from "next/navigation";
import useSWR from "swr";

export function useWorkspace() {
  const { workspaceId } = useParams<{ workspaceId?: string }>();

  const {
    data: workspace,
    error,
    mutate,
  } = useSWR<WorkspaceWithRoleProps>(workspaceId && `/api/workspaces/${workspaceId}`, fetcher, {
    dedupingInterval: 60000,
  });

  return {
    workspace,
    error,
    mutate,
    loading: workspaceId && !workspace && !error,
  };
}

export function useWorkspaces() {
  const { data: workspaces, error } = useSWR<WorkspaceWithRoleProps[]>("/api/workspaces", fetcher, {
    dedupingInterval: 60000,
  });

  return {
    workspaces,
    error,
    loading: !workspaces && !error,
  };
}
