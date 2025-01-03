import { useConfirmModal } from "@/components/modals";
import { Button, IconMenu, Popover } from "@/components/ui";
import { Ellipsis, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";

export function KnowledgebaseCardActions({
  id,
  workspaceId,
}: {
  id: string;
  workspaceId: string;
}) {
  const [openPopover, setOpenPopover] = useState(false);
  const { setShowConfirmModal, ConfirmModal } = useConfirmModal({
    title: "删除知识库",
    content: "此操作无法撤销。这将永久删除您的知识库，是否继续？",
    onConfirm: () => {
      fetch(`/api/knowledgebases/${id}?workspaceId=${workspaceId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (res) => {
        if (res.ok) {
          await mutate("/api/knowledgebases?workspaceId=" + workspaceId);
          toast.success("知识库已删除！");
        } else {
          const { message } = await res.json();
          toast.error(message);
        }
      });
    },
  });

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Popover
        content={
          <div className="grid w-full gap-1 p-2 sm:w-48">
            <button
              onClick={() => {
                setOpenPopover(false);
                setShowConfirmModal(true);
              }}
              className="rounded-md p-2 text-left font-medium text-red-600 text-sm transition-all duration-75 hover:bg-red-600 hover:text-white"
            >
              <IconMenu text="删除知识库" icon={<Trash2 className="h-4 w-4" />} />
            </button>
          </div>
        }
        align="start"
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
      >
        <div>
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpenPopover(true);
            }}
            type="button"
            icon={<Ellipsis className="h-5 w-5 text-gray-500" />}
            className="h-8 space-x-0 px-1 py-2"
            variant="ghost"
          />
        </div>
      </Popover>
      <ConfirmModal />
    </div>
  );
}
