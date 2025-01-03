import { Logo } from "@/components/icons";
import { Modal } from "@/components/ui";
import { CreateWorkspaceForm } from "@/components/workspace";
import { useRouter } from "next/navigation";
import { type Dispatch, type SetStateAction, useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

function AddWorkspaceModal({
  showAddWorkspaceModal,
  setShowAddWorkspaceModal,
}: {
  showAddWorkspaceModal: boolean;
  setShowAddWorkspaceModal: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();

  return (
    <Modal showModal={showAddWorkspaceModal} setShowModal={setShowAddWorkspaceModal}>
      <div className="flex flex-col items-center justify-center space-y-3 border-gray-200 border-b px-4 py-4 pt-8 sm:px-16">
        <Logo />
        <h3 className="font-medium text-lg">创建工作空间</h3>
        <p className="text-gray-500 text-sm">工作空间是应用、知识库、工具的集合，相互之间隔离</p>
      </div>

      <CreateWorkspaceForm
        className="bg-gray-50 px-4 py-8 sm:px-16"
        onSuccess={({ id }) => {
          router.push(`/${id}`);
          toast.success("工作空间创建成功!");
          setShowAddWorkspaceModal(false);
        }}
      />
    </Modal>
  );
}

export function useAddWorkspaceModal() {
  const [showAddWorkspaceModal, setShowAddWorkspaceModal] = useState(false);

  const AddWorkspaceModalCallback = useCallback(() => {
    return (
      <AddWorkspaceModal
        showAddWorkspaceModal={showAddWorkspaceModal}
        setShowAddWorkspaceModal={setShowAddWorkspaceModal}
      />
    );
  }, [showAddWorkspaceModal, setShowAddWorkspaceModal]);

  return useMemo(
    () => ({ setShowAddWorkspaceModal, AddWorkspaceModal: AddWorkspaceModalCallback }),
    [setShowAddWorkspaceModal, AddWorkspaceModalCallback],
  );
}
