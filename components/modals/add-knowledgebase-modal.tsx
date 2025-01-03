import { Logo } from "@/components/icons";
import { CreateKnowledgebaseForm } from "@/components/knowledgebase";
import { Modal } from "@/components/ui";
import { useRouter } from "next/navigation";
import { type Dispatch, type SetStateAction, useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

function AddKnowledgebaseModal({
  showAddKnowledgebaseModal,
  setShowAddKnowledgebaseModal,
}: {
  showAddKnowledgebaseModal: boolean;
  setShowAddKnowledgebaseModal: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();

  return (
    <Modal
      className="sm:max-w-[500px]"
      showModal={showAddKnowledgebaseModal}
      setShowModal={setShowAddKnowledgebaseModal}
    >
      <div className="flex w-[500px] flex-col items-center justify-center space-y-3 border-gray-200 border-b px-4 py-4 pt-8 sm:px-16">
        <Logo />
        <h3 className="font-medium text-lg">创建知识库</h3>
        <p className="text-gray-500 text-sm">
          将知识库集成到应用中，利用其上下文信息提高应用的准确性和可靠性。
        </p>
      </div>

      <CreateKnowledgebaseForm
        className="bg-gray-50 px-4 py-8 sm:px-16"
        onSuccess={({ id, workspaceId }) => {
          router.push(`/${workspaceId}/knowledgebases/${id}`);
          toast.success("知识库创建成功!");
          setShowAddKnowledgebaseModal(false);
        }}
      />
    </Modal>
  );
}

export function useAddKnowledgebaseModal() {
  const [showAddKnowledgebaseModal, setShowAddKnowledgebaseModal] = useState(false);

  const AddKnowledgebaseModalCallback = useCallback(() => {
    return (
      <AddKnowledgebaseModal
        showAddKnowledgebaseModal={showAddKnowledgebaseModal}
        setShowAddKnowledgebaseModal={setShowAddKnowledgebaseModal}
      />
    );
  }, [showAddKnowledgebaseModal, setShowAddKnowledgebaseModal]);

  return useMemo(
    () => ({ setShowAddKnowledgebaseModal, AddKnowledgebaseModal: AddKnowledgebaseModalCallback }),
    [setShowAddKnowledgebaseModal, AddKnowledgebaseModalCallback],
  );
}
