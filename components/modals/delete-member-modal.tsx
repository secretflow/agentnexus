import { Logo } from "@/components/icons";
import { Avatar, Button, Modal } from "@/components/ui";
import { useMediaQuery } from "@/lib/hooks";
import { useWorkspace } from "@/lib/swr";
import type { UserProps } from "@/lib/zod";
import { useRouter } from "next/navigation";
import { type Dispatch, type SetStateAction, useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";

function DeleteMemberModal({
  user,
  showDeleteMemberModal,
  setShowDeleteMemberModal,
}: {
  user: UserProps;
  showDeleteMemberModal: boolean;
  setShowDeleteMemberModal: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const [removing, setRemoving] = useState(false);
  const { workspace } = useWorkspace();
  const { id, name, email } = user;
  const { isMobile } = useMediaQuery();

  return (
    <Modal
      showModal={showDeleteMemberModal}
      setShowModal={setShowDeleteMemberModal}
      className="sm:max-w-[500px]"
    >
      <div className="flex w-[500px] flex-col items-center justify-center space-y-3 border-gray-200 border-b px-4 py-4 pt-8 sm:px-16">
        <Logo />
        <h3 className="font-medium text-lg">{workspace?.isOwner ? "移除成员" : "离开工作空间"}</h3>
        <p className="text-gray-500 text-sm">
          {workspace?.isOwner
            ? `你将要移除成员${name}，`
            : "离开工作空间后，您将失去对该工作区的所有访问权限，"}
          是否继续？
        </p>
      </div>

      <div className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 text-left sm:px-16">
        <div className="flex items-center space-x-3 rounded-md border border-gray-300 bg-white p-3">
          <Avatar user={user} />
          <div className="flex flex-col">
            <h3 className="font-medium text-sm">{name || email}</h3>
            <p className="text-gray-500 text-xs">{email}</p>
          </div>
        </div>
        <Button
          text="确认"
          variant="danger"
          autoFocus={!isMobile}
          loading={removing}
          onClick={() => {
            setRemoving(true);
            fetch(`/api/workspaces/${workspace?.id}/members?deleteUserId=${id}`, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
            }).then(async (res) => {
              if (res.ok) {
                if (workspace?.isOwner) {
                  await mutate(`/api/workspaces/${workspace?.id}/members`);
                  setShowDeleteMemberModal(false);
                } else {
                  await mutate("/api/workspaces");
                  router.push("/");
                }
                toast.success(workspace?.isOwner ? "成员已删除！" : "您已离开工作空间！");
              } else {
                const { message } = await res.json();
                toast.error(message);
              }
              setRemoving(false);
            });
          }}
        />
      </div>
    </Modal>
  );
}

export function useDeleteMemberModal({
  user,
}: {
  user: UserProps;
}) {
  const [showDeleteMemberModal, setShowDeleteMemberModal] = useState(false);

  const DeleteMemberModalCallback = useCallback(() => {
    return (
      <DeleteMemberModal
        user={user}
        showDeleteMemberModal={showDeleteMemberModal}
        setShowDeleteMemberModal={setShowDeleteMemberModal}
      />
    );
  }, [showDeleteMemberModal, setShowDeleteMemberModal]);

  return useMemo(
    () => ({
      setShowDeleteMemberModal,
      DeleteMemberModal: DeleteMemberModalCallback,
    }),
    [setShowDeleteMemberModal, DeleteMemberModalCallback],
  );
}
