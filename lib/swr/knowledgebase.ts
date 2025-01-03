import { fetcher } from "@/lib/utils";
import type { KnowledgebaseProps, KnowledgebaseResourceProps } from "@/lib/zod";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { useWorkspace } from "./workspace";

export function useKnowledgebase() {
  const { knowledgebaseId, workspaceId } = useParams<{
    knowledgebaseId?: string;
    workspaceId?: string;
  }>();

  const {
    data: knowledgebase,
    error,
    mutate,
  } = useSWR<KnowledgebaseProps>(
    workspaceId &&
      knowledgebaseId &&
      `/api/knowledgebases/${knowledgebaseId}?workspaceId=${workspaceId}`,
    fetcher,
    {
      dedupingInterval: 60000,
    },
  );

  return {
    knowledgebase,
    error,
    mutate,
    loading: workspaceId && knowledgebaseId && !knowledgebase && !error,
  };
}

export function useKnowledgebases() {
  const { workspace } = useWorkspace();

  const { data: knowledgebases, error } = useSWR<KnowledgebaseProps[]>(
    workspace && `/api/knowledgebases?workspaceId=${workspace.id}`,
    fetcher,
    {
      dedupingInterval: 60000,
    },
  );

  return {
    knowledgebases,
    error,
    loading: workspace && !knowledgebases && !error,
  };
}

export function useKnowledgebaseResource(resourceId: string) {
  const { workspaceId, knowledgebaseId } = useParams<{
    workspaceId?: string;
    knowledgebaseId?: string;
  }>();

  const { data: resource, error } = useSWR<KnowledgebaseResourceProps>(
    workspaceId &&
      knowledgebaseId &&
      `/api/knowledgebases/${knowledgebaseId}/resources/${resourceId}?workspaceId=${workspaceId}`,
    fetcher,
    {
      dedupingInterval: 60000,
    },
  );

  return {
    resource,
    error,
    loading: workspaceId && knowledgebaseId && !resource && !error,
  };
}

export function useKnowledgebaseResources() {
  const { workspaceId, knowledgebaseId } = useParams<{
    workspaceId?: string;
    knowledgebaseId?: string;
  }>();

  const { data: resources, error } = useSWR<KnowledgebaseResourceProps[]>(
    workspaceId &&
      knowledgebaseId &&
      `/api/knowledgebases/${knowledgebaseId}/resources?workspaceId=${workspaceId}`,
    fetcher,
    {
      dedupingInterval: 60000,
    },
  );

  return {
    resources,
    error,
    loading: workspaceId && knowledgebaseId && !resources && !error,
  };
}
