import { fetcher } from "@/lib/utils";
import { toast } from "sonner";
import useSWR from "swr";

export function useOptimisticUpdate<T>(
  url: string,
  toastCopy?: { loading: string; success: string; error: string },
) {
  const { data, isLoading, mutate } = useSWR<T>(url, fetcher);

  return {
    data,
    isLoading,
    update: async (fn: (data: T) => Promise<T>, optimisticData: T) => {
      return toast.promise(
        mutate(fn(data as T), {
          optimisticData,
          rollbackOnError: true,
          populateCache: true,
          revalidate: true,
        }),
        {
          loading: toastCopy?.loading || "更新中...",
          success: toastCopy?.success || "更新成功！",
          error: toastCopy?.error || "更新失败！",
        },
      );
    },
  };
}
