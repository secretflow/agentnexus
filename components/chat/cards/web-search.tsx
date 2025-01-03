import { Globe2 } from "@/components/icons";
import { Separator } from "@/components/ui";
import type { exa } from "@agentic/exa";
import { ArrowRight } from "lucide-react";
import { Link } from "next-view-transitions";

export function WebSearch({
  result,
  loading,
  args,
}: {
  result?: exa.SearchResponse;
  loading?: boolean;
  args?: { numResults: number; query: string };
}) {
  const results = (result?.results || []).filter((item) => item.url && item.title);
  return (
    <div className="w-full max-w-[400px] rounded-2xl p-4 ring-1 ring-gray-700/10">
      <div className="flex items-center gap-2">
        <Globe2 className="h-4 w-4" />
        <h4 className="max-w-[330px] truncate text-sm">互联网搜索-{args?.query}</h4>
      </div>
      <Separator className="my-4" />
      {loading ? (
        <SearchResultPlachholder />
      ) : results.length > 0 ? (
        <SearchResults results={results} />
      ) : (
        <div className="text-gray-400 text-sm">未查询到相关内容</div>
      )}
    </div>
  );
}

function SearchResults({
  results,
}: {
  results: exa.SearchResult[];
}) {
  return (
    <div className="space-y-2">
      {results.map((item) => (
        <div key={item.id} className="group flex items-center">
          <ArrowRight className="size-4 text-gray-400" />
          <Link
            href={item.url}
            target="_blank"
            className="ml-1 max-w-[340px] truncate text-gray-400 text-sm hover:underline hover:underline-offset-2"
          >
            {item.title}
          </Link>
        </div>
      ))}
    </div>
  );
}

function SearchResultPlachholder() {
  return (
    <div className="space-y-2">
      <div className="h-5 w-full animate-pulse rounded-md bg-gray-200" />
      <div className="h-5 w-full animate-pulse rounded-md bg-gray-200" />
      <div className="h-5 w-full animate-pulse rounded-md bg-gray-200" />
    </div>
  );
}
