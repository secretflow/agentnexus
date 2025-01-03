import { fetcher } from "@/lib/utils";
import type { ModelProviderProps } from "@/lib/zod";
import { useParams } from "next/navigation";
import useSWR from "swr";

export function useModelProviders() {
  const { workspaceId } = useParams<{
    workspaceId?: string;
  }>();

  const {
    data: modelProviders,
    error,
    mutate,
  } = useSWR<ModelProviderProps[]>(
    workspaceId && `/api/workspaces/${workspaceId}/models`,
    fetcher,
    {
      dedupingInterval: 60000,
    },
  );

  return {
    modelProviders,
    error,
    mutate,
    loading: workspaceId && !modelProviders && !error,
  };
}
