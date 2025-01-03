import { LoadingSpinner } from "@/components/ui";
import { DICEBEAR_AVATAR_URL } from "@/lib/constants";
import type { firecrawl } from "@agentic/firecrawl";

export function Firecrawl({
  result,
  loading,
  args,
}: {
  result?: firecrawl.ScrapeResponse;
  loading?: boolean;
  args?: { url: string };
}) {
  const metadata = result?.data?.metadata;

  if (loading) {
    return (
      <div className="flex max-w-[400px] items-center gap-1 rounded-md border border-gray-200 bg-white p-3">
        <span className="text-gray-500 text-sm">抓取站点：{args?.url}</span>
        <LoadingSpinner className="size-4" />
      </div>
    );
  }

  return (
    <div className="flex max-w-[400px] items-center space-x-3 rounded-md border border-gray-200 bg-white p-3">
      <img
        alt={metadata?.title}
        referrerPolicy="no-referrer"
        src={metadata?.ogImage || `${DICEBEAR_AVATAR_URL}${metadata?.title}`}
        className="size-10 rounded-full border border-gray-300"
        draggable={false}
      />
      <div className="flex flex-col">
        <h3 className="mb-2 font-medium text-sm">{metadata?.title}</h3>
        <p className="text-gray-500 text-xs">{metadata?.ogDescription}</p>
      </div>
    </div>
  );
}
