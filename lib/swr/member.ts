import { fetcher } from "@/lib/utils";
import type { UserWithRoleProps } from "@/lib/zod";
import useSWR from "swr";
import { useWorkspace } from "./workspace";

export function useMembers() {
  const { workspace } = useWorkspace();

  const {
    data: members,
    error,
    mutate,
  } = useSWR<UserWithRoleProps[]>(workspace && `/api/workspaces/${workspace.id}/members`, fetcher, {
    dedupingInterval: 60000,
  });

  return {
    members,
    error,
    mutate,
    loading: workspace && !members && !error,
  };
}
