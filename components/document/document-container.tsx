import { EmptyState } from "@/components/layout";
import { useConfirmModal } from "@/components/modals";
import { useUpsertDocumentModal } from "@/components/modals";
import { Button, Popover, Switch } from "@/components/ui";
import { useKnowledgebaseResources } from "@/lib/swr";
import { formatFileSize } from "@/lib/utils";
import type { KnowledgebaseResourceProps } from "@/lib/zod";
import { FileType } from "lucide-react";
import { Edit3, FilePlus, MoreVertical, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import { DOCUMENT_ICONS } from "./constants";
import { DocumentCardPlaceholder } from "./document-card-placeholder";
import { DocumentChunkSheet } from "./document-chunk-sheet";
import { EmptyDocumentIndicator } from "./empty-document-indicator";

export function DocumentContainer({
  search,
}: {
  search?: string;
}) {
  const { resources, loading } = useKnowledgebaseResources();
  const filteredResources = (resources || []).filter((resource) =>
    resource.name.toLowerCase().includes(search?.toLowerCase() || ""),
  );

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <DocumentCardPlaceholder key={i} />
        ))}
      </div>
    );
  }

  if (!resources || resources.length === 0) {
    return <EmptyDocumentIndicator />;
  }

  if (filteredResources.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <EmptyState icon={FilePlus} title="没有符合筛选条件的文档" />
      </div>
    );
  }

  return <DocumentList documents={filteredResources} />;
}

function DocumentList({
  documents,
}: {
  documents: KnowledgebaseResourceProps[];
}) {
  const { workspaceId, knowledgebaseId } = useParams<{
    workspaceId: string;
    knowledgebaseId: string;
  }>();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [activeDocument, setActiveDocument] = useState<KnowledgebaseResourceProps | null>(null);

  const handleDelete = async (id: string) => {
    const deleteDoc = fetch(
      `/api/knowledgebases/${knowledgebaseId}/resources/${id}?workspaceId=${workspaceId}`,
      {
        method: "DELETE",
      },
    );

    toast.promise(deleteDoc, {
      loading: "正在删除文档...",
      success: () => {
        mutate(`/api/knowledgebases/${knowledgebaseId}/resources?workspaceId=${workspaceId}`);
        return "文档删除成功！";
      },
      error: () => {
        return "文档删除失败！";
      },
    });
  };

  const { setShowConfirmModal, ConfirmModal } = useConfirmModal({
    title: "删除文档",
    content: "此操作将永久删除您的文档数据，无法撤销，是否继续？",
    onConfirm: () => {
      if (deleteId) {
        handleDelete(deleteId);
      }
    },
  });

  return (
    <div className="grid grid-cols-1 gap-3">
      {documents.map((doc) => (
        <div
          key={doc.id}
          onClick={() => {
            setActiveDocument(doc);
          }}
          className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-white p-4 transition-[filter] hover:drop-shadow-card-hover"
        >
          <DocumentCardTitle document={doc} />
          <DocumentCardControl
            workspaceId={workspaceId}
            knowledgebaseId={knowledgebaseId}
            document={doc}
            onDelete={(id) => {
              setShowConfirmModal(true);
              setDeleteId(id);
            }}
          />
        </div>
      ))}
      <ConfirmModal />
      {activeDocument && (
        <DocumentChunkSheet
          doc={activeDocument}
          open={!!activeDocument}
          onOpenChange={(open) => {
            if (!open) {
              setActiveDocument(null);
            }
          }}
        />
      )}
    </div>
  );
}

function DocumentCardTitle({
  document,
}: {
  document: KnowledgebaseResourceProps;
}) {
  const { name, metadata } = document;
  const Icon = DOCUMENT_ICONS[metadata.fileType] || FileType;

  return (
    <div className="flex min-w-0 items-center gap-4">
      <div className="hidden rounded-full border border-gray-200 sm:block">
        <div className="rounded-full border border-white bg-gradient-to-t from-gray-100 p-1 md:p-2">
          <Icon className="size-4" />
        </div>
      </div>
      <div className="overflow-hidden">
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <p className="truncate font-medium text-sm">{name}</p>
        </div>
        <div className="mt-1 flex items-center gap-3 text-xs">
          <span className="whitespace-pre-wrap text-gray-500">
            文件大小：{formatFileSize(metadata.size)}
          </span>
        </div>
      </div>
    </div>
  );
}

function DocumentCardControl({
  workspaceId,
  knowledgebaseId,
  document,
  onDelete,
}: {
  workspaceId: string;
  knowledgebaseId: string;
  document: KnowledgebaseResourceProps;
  onDelete: (id: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);

  const { setShowUpsertDocumentModal, UpsertDocumentModal } = useUpsertDocumentModal({
    document,
  });

  const handleChangeState = async (id: string, state: boolean) => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/knowledgebases/${knowledgebaseId}/resources/${id}?workspaceId=${workspaceId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, enabled: state }),
        },
      );
      if (res.ok) {
        await mutate(`/api/knowledgebases/${knowledgebaseId}/resources?workspaceId=${workspaceId}`);
        toast.success(`文档${state ? "启用" : "禁用"}成功！`);
      } else {
        const { message } = await res.json();
        toast.error(message);
      }
    } catch (e) {
      toast.error("操作失败，请稍后重试！");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
      <Switch
        loading={loading}
        checked={document.enabled}
        fn={(checked: boolean) => {
          handleChangeState(document.id, checked);
        }}
      />
      <Popover
        content={
          <div className="w-full sm:w-48">
            <div className="grid gap-px p-2">
              <Button
                text="编辑文档"
                variant="ghost"
                icon={<Edit3 className="h-4 w-4" />}
                className="h-9 justify-start px-2 font-medium"
                onClick={() => {
                  setOpenPopover(false);
                  setShowUpsertDocumentModal(true);
                }}
              />
              <Button
                text="删除文档"
                variant="danger-ghost"
                icon={<Trash2 className="h-4 w-4" />}
                className="h-9 justify-start px-2 font-medium"
                onClick={() => {
                  setOpenPopover(false);
                  onDelete(document.id);
                }}
              />
            </div>
          </div>
        }
        align="end"
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
      >
        <button
          onClick={() => {
            setOpenPopover(!openPopover);
          }}
          className="rounded-md px-1 py-2 transition-all duration-75 hover:bg-gray-100 active:bg-gray-200"
        >
          <MoreVertical className="size-5 text-gray-500" />
        </button>
      </Popover>
      <UpsertDocumentModal />
    </div>
  );
}
