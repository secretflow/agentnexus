import { fetcher } from "@/lib/utils";
import type { WorkflowProps } from "@/lib/zod";
import useSWR from "swr";
import { useApplication } from "./application";

export function useWorkflow() {
  const { application } = useApplication();

  const {
    data: workflow,
    error,
    mutate,
  } = useSWR<WorkflowProps>(
    application &&
      `/api/applications/${application.id}/workflow?workspaceId=${application.workspaceId}`,
    fetcher,
    {
      dedupingInterval: 60000,
    },
  );

  return {
    workflow,
    error,
    mutate,
    loading: application && !workflow && !error,
  };
}
