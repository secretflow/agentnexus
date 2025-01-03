import { fetcher } from "@/lib/utils";
import type { ApplicationProps } from "@/lib/zod";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { useWorkspace } from "./workspace";

export function useApplication() {
  const { applicationId, workspaceId } = useParams<{
    applicationId?: string;
    workspaceId?: string;
  }>();

  const {
    data: application,
    error,
    mutate,
  } = useSWR<ApplicationProps>(
    workspaceId && applicationId && `/api/applications/${applicationId}?workspaceId=${workspaceId}`,
    fetcher,
    {
      dedupingInterval: 60000,
    },
  );

  return {
    application,
    error,
    mutate,
    loading: workspaceId && applicationId && !application && !error,
  };
}

export function useApplications() {
  const { workspace } = useWorkspace();

  const { data: applications, error } = useSWR<ApplicationProps[]>(
    workspace && `/api/applications?workspaceId=${workspace.id}`,
    fetcher,
    {
      dedupingInterval: 60000,
    },
  );

  return {
    applications,
    error,
    loading: workspace && !applications && !error,
  };
}
