"use client";

import { Logo } from "@/components/icons";
import { Button, Modal } from "@/components/ui";
import { useMediaQuery } from "@/lib/hooks";
import { useWorkspace } from "@/lib/swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { type Dispatch, type SetStateAction, useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";

function DeleteWorkspaceModal({
  showDeleteWorkspaceModal,
  setShowDeleteWorkspaceModal,
}: {
  showDeleteWorkspaceModal: boolean;
  setShowDeleteWorkspaceModal: Dispatch<SetStateAction<boolean>>;
}) {
  const { update } = useSession();
  const router = useRouter();
  const { workspace } = useWorkspace();

  const [deleting, setDeleting] = useState(false);

  async function deleteWorkspace() {
    return new Promise((resolve, reject) => {
      setDeleting(true);
      fetch(`/api/workspaces/${workspace?.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (res) => {
        if (res.ok) {
          await Promise.all([mutate("/api/workspaces"), update()]);
          router.push("/");
          resolve(null);
        } else {
          setDeleting(false);
          const { message } = await res.json();
          reject(message);
        }
      });
    });
  }

  const { isMobile } = useMediaQuery();

  return (
    <Modal showModal={showDeleteWorkspaceModal} setShowModal={setShowDeleteWorkspaceModal}>
      <div className="flex flex-col items-center justify-center space-y-3 border-gray-200 border-b px-4 py-4 pt-8 sm:px-16">
        <Logo />
        <h3 className="font-medium text-lg">删除工作空间</h3>
        <p className="text-center text-gray-500 text-sm">
          警告: 此操作将永久删除您的工作空间下面的应用、知识库和工具，无法撤销。
        </p>
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          toast.promise(deleteWorkspace(), {
            loading: "删除中...",
            success: "工作空间已删除！",
            error: (err) => err,
          });
        }}
        className="flex flex-col space-y-6 bg-gray-50 px-4 py-8 text-left sm:px-16"
      >
        <div>
          <label htmlFor="workspace-name" className="block font-medium text-gray-700 text-sm">
            输入工作空间名称 <span className="font-semibold text-black">{workspace?.name}</span>{" "}
            以继续：
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <input
              type="text"
              name="workspace-name"
              id="workspace-name"
              autoFocus={!isMobile}
              autoComplete="off"
              pattern={workspace?.name}
              required
              className="block w-full rounded-md border-gray-300 text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="verification" className="block text-gray-700 text-sm">
            输入 <span className="font-semibold text-black">确认删除</span> 以确认：
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <input
              type="text"
              name="verification"
              id="verification"
              pattern="确认删除"
              required
              autoComplete="off"
              className="block w-full rounded-md border-gray-300 text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
            />
          </div>
        </div>

        <Button text="确认删除工作空间" variant="danger" loading={deleting} />
      </form>
    </Modal>
  );
}

export function useDeleteWorkspaceModal() {
  const [showDeleteWorkspaceModal, setShowDeleteWorkspaceModal] = useState(false);

  const DeleteWorkspaceModalCallback = useCallback(() => {
    return (
      <DeleteWorkspaceModal
        showDeleteWorkspaceModal={showDeleteWorkspaceModal}
        setShowDeleteWorkspaceModal={setShowDeleteWorkspaceModal}
      />
    );
  }, [showDeleteWorkspaceModal, setShowDeleteWorkspaceModal]);

  return useMemo(
    () => ({
      setShowDeleteWorkspaceModal,
      DeleteWorkspaceModal: DeleteWorkspaceModalCallback,
    }),
    [setShowDeleteWorkspaceModal, DeleteWorkspaceModalCallback],
  );
}
