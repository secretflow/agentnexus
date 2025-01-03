import { KnowledgebasesAddBlock } from "@/components/knowledgebase";
import type { ChatConfigProps, ChatKnowledgebaseProps } from "@/lib/zod";

export function KnowledgebasesForm({
  knowledgebases,
  onKnowledgebasesChange,
  recallConfig,
  onRecallConfigChange,
}: {
  knowledgebases: ChatKnowledgebaseProps[] | undefined | null;
  onKnowledgebasesChange: (value: ChatKnowledgebaseProps[]) => void;
  recallConfig?: ChatConfigProps["recall"];
  onRecallConfigChange?: (value: ChatConfigProps["recall"]) => void;
}) {
  return (
    <KnowledgebasesAddBlock
      knowledgebases={knowledgebases}
      onKnowledgebasesChange={onKnowledgebasesChange}
      recallConfig={recallConfig}
      onRecallConfigChange={onRecallConfigChange}
      title="知识库"
      description="Agent 会自主从知识库检索内容作为上下文"
      className="space-y-4 px-6 py-4"
    />
  );
}
