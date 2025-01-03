import { CreateApplicationForm } from "@/components/application";
import { Logo } from "@/components/icons";
import { Modal } from "@/components/ui";
import { useRouter } from "next/navigation";
import { type Dispatch, type SetStateAction, useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

function AddApplicationModal({
  showAddApplicationModal,
  setShowAddApplicationModal,
}: {
  showAddApplicationModal: boolean;
  setShowAddApplicationModal: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();

  return (
    <Modal
      className="sm:max-w-[500px]"
      showModal={showAddApplicationModal}
      setShowModal={setShowAddApplicationModal}
    >
      <div className="flex w-[500px] flex-col items-center justify-center space-y-3 border-gray-200 border-b px-4 py-4 pt-8 sm:px-16">
        <Logo />
        <h3 className="font-medium text-lg">创建应用</h3>
        <p className="text-gray-500 text-sm">开发并且发布你的应用，让世界都能体验你的创意！</p>
      </div>

      <CreateApplicationForm
        className="bg-gray-50 px-4 py-8 sm:px-16"
        onSuccess={({ id, workspaceId }) => {
          router.push(`/${workspaceId}/${id}`);
          toast.success("应用创建成功!");
          setShowAddApplicationModal(false);
        }}
      />
    </Modal>
  );
}

export function useAddApplicationModal() {
  const [showAddApplicationModal, setShowAddApplicationModal] = useState(false);

  const AddApplicationModalCallback = useCallback(() => {
    return (
      <AddApplicationModal
        showAddApplicationModal={showAddApplicationModal}
        setShowAddApplicationModal={setShowAddApplicationModal}
      />
    );
  }, [showAddApplicationModal, setShowAddApplicationModal]);

  return useMemo(
    () => ({ setShowAddApplicationModal, AddApplicationModal: AddApplicationModalCallback }),
    [setShowAddApplicationModal, AddApplicationModalCallback],
  );
}
