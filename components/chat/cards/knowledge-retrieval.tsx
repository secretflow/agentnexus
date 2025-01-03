import { Book, ExpandingArrow } from "@/components/icons";
import { HoverCard, HoverCardContent, HoverCardTrigger, LoadingSpinner } from "@/components/ui";
import { toPercentage } from "@/lib/utils";
import type { RetrievalResultProps } from "@/lib/zod";
import { motion } from "framer-motion";

export function KnowledgeRetrieval({
  result,
  loading,
  args,
}: {
  result?: RetrievalResultProps[];
  loading?: boolean;
  args?: { question: string };
}) {
  return (
    <div className="w-[350px] rounded-md text-sm shadow-lg">
      <div className="rounded-t-xl bg-gray-800 p-3 text-white">
        <div className="flex items-center gap-1">
          <Book className="size-5" />
          <span>知识库检索</span>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center gap-1 p-3">
          <p className="max-w-[260px] truncate text-gray-700">{args?.question}</p>
          <LoadingSpinner className="size-4" />
        </div>
      ) : !result || result.length === 0 ? (
        <div className="flex justify-center p-3 text-gray-400">未找到相关知识</div>
      ) : (
        <motion.div
          initial={{ height: 40, opacity: 0 }}
          animate={{ height: 52 + result.length * 33, opacity: 1 }}
          transition={{ duration: 1, ease: "easeIn" }}
          className="overflow-hidden p-3"
        >
          <p className="max-w-[260px] truncate text-gray-700">{args?.question}</p>
          <div className="mt-2 grid divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
            {result.map((item) => {
              return (
                <HoverCard key={item.id}>
                  <HoverCardTrigger asChild>
                    <div className="group flex items-center justify-between p-2">
                      <p className="w-[280px] truncate text-gray-600 text-xs">{item.content}</p>
                      <div className="mr-5">
                        <ExpandingArrow className="text-gray-500" />
                      </div>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80" side="right">
                    <RetrievalResultCard result={item} />
                  </HoverCardContent>
                </HoverCard>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function RetrievalResultCard({
  result,
}: {
  result: RetrievalResultProps;
}) {
  return (
    <div className="space-y-2">
      <p className="text-gray-600 text-xs">{result.content}</p>
      <div className="flex flex-col pt-2">
        <span className="text-muted-foreground text-xs">知识库ID：{result.knowledgebaseId}</span>
        <span className="text-muted-foreground text-xs">
          相识度：{toPercentage(result.similarity)}
        </span>
      </div>
    </div>
  );
}
