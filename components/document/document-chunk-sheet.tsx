import { EmptyState } from "@/components/layout";
import {
  Badge,
  LoadingSpinner,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui";
import { useKnowledgebaseResource } from "@/lib/swr";
import type { KnowledgebaseResourceProps } from "@/lib/zod";
import { ScanBarcode } from "lucide-react";

export function DocumentChunkSheet({
  doc,
  open,
  onOpenChange,
}: {
  doc: KnowledgebaseResourceProps;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { resource, loading } = useKnowledgebaseResource(doc.id);
  const embeddings = resource?.embeddings || [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
      <SheetContent className="!max-w-[660px] top-[109px] w-[660px] overflow-auto p-0">
        <SheetHeader className="px-4 py-2">
          <SheetTitle className="flex items-center text-gray-700">{doc.name}</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className="flex flex-wrap gap-2 overflow-auto border-t p-4">
          {loading ? (
            <div className="flex h-32 w-full items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : embeddings.length > 0 ? (
            embeddings.map((embedding, index) => (
              <div
                key={embedding.id}
                className="relative w-[300px] shrink-0 rounded-xl border border-gray-200 bg-white px-4 py-3 transition-[filter] hover:drop-shadow-card-hover"
              >
                <div className="flex gap-1">
                  <Badge variant="default" className="rounded-md">
                    #{index}
                  </Badge>
                  <Badge variant="default" className="rounded-md">
                    {embedding.content.length} 字符
                  </Badge>
                </div>
                <p className="mt-2 text-gray-500 text-xs">{embedding.content}</p>
              </div>
            ))
          ) : (
            <EmptyState title="No chunks found" icon={ScanBarcode} />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
