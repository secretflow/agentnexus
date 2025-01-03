import { Book } from "@/components/icons";
import { EmptyState } from "@/components/layout";
import { searchKnowledgebases } from "@/lib/search";
import { useKnowledgebases } from "@/lib/swr";
import { EmptyKnowledgebaseIndicator } from "./empty-knowledgebase-indicator";
import { KnowledgebaseCard } from "./knowledgebase-card";
import { KnowledgebaseCardPlaceholder } from "./knowledgebase-card-placeholder";

export function KnowledgebaseList({ search }: { search?: string }) {
  const { knowledgebases, loading } = useKnowledgebases();
  const filteredKnowledgebases = searchKnowledgebases(knowledgebases || [], search);

  if (loading) {
    return Array.from({ length: 6 }).map((_, i) => <KnowledgebaseCardPlaceholder key={i} />);
  }

  if (!knowledgebases || knowledgebases.length === 0) {
    return <EmptyKnowledgebaseIndicator />;
  }

  if (filteredKnowledgebases.length === 0) {
    return (
      <div className="col-span-3 flex h-[400px] justify-center">
        <EmptyState icon={Book} title="没有符合筛选条件的知识库" />
      </div>
    );
  }

  return filteredKnowledgebases.map((d) => <KnowledgebaseCard key={d.id} {...d} />);
}
