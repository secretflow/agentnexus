import { fetcher } from "@/lib/utils";
import type { TokenProps } from "@/lib/zod";
import useSWR from "swr";
import { useApplication } from "./application";

export function useTokens() {
  const { application } = useApplication();

  const {
    data: tokens,
    error,
    mutate,
  } = useSWR<TokenProps[]>(
    application &&
      `/api/applications/${application.id}/tokens?workspaceId=${application.workspaceId}`,
    fetcher,
    {
      dedupingInterval: 60000,
    },
  );

  return {
    tokens,
    error,
    mutate,
    loading: application && !tokens && !error,
  };
}
