import { Book } from "@/components/icons";
import { KnowledgebaseSelector } from "@/components/knowledgebase";
import { useRecallConfigModal } from "@/components/modals";
import { Button, Switch } from "@/components/ui";
import { useKnowledgebases } from "@/lib/swr";
import { cn } from "@/lib/utils";
import type { ChatConfigProps, ChatKnowledgebaseProps, KnowledgebaseProps } from "@/lib/zod";
import { Settings2, Trash2 } from "lucide-react";
import { useCallback } from "react";
import { useMemo } from "react";
import { toast } from "sonner";

export function KnowledgebasesAddBlock({
  knowledgebases,
  onKnowledgebasesChange,
  recallConfig,
  onRecallConfigChange,
  title,
  description,
  enableSwitch = true,
  className,
}: {
  knowledgebases: ChatKnowledgebaseProps[] | undefined | null;
  onKnowledgebasesChange: (value: ChatKnowledgebaseProps[]) => void;
  recallConfig?: ChatConfigProps["recall"];
  onRecallConfigChange?: (value: ChatConfigProps["recall"]) => void;
  title?: string;
  description?: string;
  enableSwitch?: boolean;
  className?: string;
}) {
  const { knowledgebases: allKnowledgebases } = useKnowledgebases();

  const { RecallConfigModal, setShowRecallConfigModal } = useRecallConfigModal({
    config: recallConfig,
    onSubmit: onRecallConfigChange,
  });

  const availableKnowledgebases = useMemo(() => {
    return (allKnowledgebases || []).filter((t) => !knowledgebases?.find((v) => v.id === t.id));
  }, [knowledgebases, allKnowledgebases]);

  const handleAddKnowledgebase = useCallback(
    (knowledgebase: KnowledgebaseProps) => {
      if (knowledgebases?.find((v) => v.id === knowledgebase.id)) {
        toast.info("知识库已经存在");
        return;
      }
      onKnowledgebasesChange([
        ...(knowledgebases || []),
        { id: knowledgebase.id, name: knowledgebase.name, enabled: true },
      ]);
    },
    [knowledgebases],
  );

  const handleDeleteKnowledgebase = useCallback(
    (id: string) => {
      onKnowledgebasesChange((knowledgebases || []).filter((v) => v.id !== id));
    },
    [knowledgebases],
  );

  const handleToggleKnowledgebaseStatus = useCallback(
    (id: string, enabled: boolean) => {
      onKnowledgebasesChange(
        (knowledgebases || []).map((v) => {
          if (v.id === id) {
            return { ...v, enabled };
          }
          return v;
        }),
      );
    },
    [knowledgebases],
  );

  return (
    <div className={cn("relative flex flex-col", className)}>
      <div className="flex flex-col space-y-3">
        {title && <h2 className="font-medium text-xl">{title}</h2>}
        <div className="flex items-center justify-between">
          <p className="text-gray-500 text-sm">{description}</p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="size-8 px-0"
              onClick={() => setShowRecallConfigModal(true)}
              icon={<Settings2 className="size-4 text-gray-500" />}
            />
            <KnowledgebaseSelector
              onSelect={handleAddKnowledgebase}
              knowledgebases={availableKnowledgebases}
            />
          </div>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-1 gap-3">
        {(knowledgebases || []).map((v) => {
          const knowledgebase = allKnowledgebases?.find((k) => k.id === v.id);

          if (!knowledgebase) {
            return null;
          }

          return (
            <div
              key={v.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white px-4 py-2"
            >
              <KnowledgebaseCardTitleColumn knowledgebase={knowledgebase} />
              <div className="flex items-center space-x-3">
                {enableSwitch && (
                  <Switch
                    checked={v.enabled}
                    fn={(checked: boolean) => {
                      handleToggleKnowledgebaseStatus(v.id, checked);
                    }}
                  />
                )}
                <Trash2
                  className="size-4 cursor-pointer text-red-500 hover:text-red-600"
                  onClick={() => handleDeleteKnowledgebase(v.id)}
                />
              </div>
            </div>
          );
        })}
      </div>
      <RecallConfigModal />
    </div>
  );
}

function KnowledgebaseCardTitleColumn({
  knowledgebase,
}: {
  knowledgebase: KnowledgebaseProps;
}) {
  return (
    <div className="flex min-w-0 items-center gap-4">
      <div className="hidden rounded-full border border-gray-200 sm:block">
        <div className="rounded-full border border-white bg-gradient-to-t from-gray-100 p-1 md:p-2">
          <Book className="size-4" />
        </div>
      </div>
      <div className="overflow-hidden">
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <p className="truncate font-medium text-sm">{knowledgebase.name}</p>
        </div>
        <div className="mt-1 flex items-center gap-1 text-xs">
          <span className="whitespace-pre-wrap text-gray-500">{knowledgebase.description}</span>
        </div>
      </div>
    </div>
  );
}
