"use client";

import { Logo } from "@/components/icons";
import { Button, Modal } from "@/components/ui";
import { useMediaQuery } from "@/lib/hooks";
import { useApplication } from "@/lib/swr";
import { useRouter } from "next/navigation";
import { type Dispatch, type SetStateAction, useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";

function DeleteApplicationModal({
  showDeleteApplicationModal,
  setShowDeleteApplicationModal,
}: {
  showDeleteApplicationModal: boolean;
  setShowDeleteApplicationModal: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const { application } = useApplication();

  const [deleting, setDeleting] = useState(false);

  async function deleteApplication() {
    return new Promise((resolve, reject) => {
      setDeleting(true);
      fetch(`/api/applications/${application?.id}?workspaceId=${application?.workspaceId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (res) => {
        if (res.ok) {
          await mutate("/api/applications");
          router.push(`/${application?.workspaceId}`);
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
    <Modal showModal={showDeleteApplicationModal} setShowModal={setShowDeleteApplicationModal}>
      <div className="flex flex-col items-center justify-center space-y-3 border-gray-200 border-b px-4 py-4 pt-8 sm:px-16">
        <Logo />
        <h3 className="font-medium text-lg">删除应用</h3>
        <p className="text-center text-gray-500 text-sm">
          警告: 此操作将永久删除您的应用以及所有关联的数据，无法撤销。
        </p>
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          toast.promise(deleteApplication(), {
            loading: "删除中...",
            success: "应用已删除！",
            error: (err) => err,
          });
        }}
        className="flex flex-col space-y-6 bg-gray-50 px-4 py-8 text-left sm:px-16"
      >
        <div>
          <label htmlFor="application-name" className="block font-medium text-gray-700 text-sm">
            输入应用名称 <span className="font-semibold text-black">{application?.name}</span>{" "}
            以继续：
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <input
              type="text"
              name="application-name"
              id="application-name"
              autoFocus={!isMobile}
              autoComplete="off"
              pattern={application?.name}
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

        <Button text="确认删除应用" variant="danger" loading={deleting} />
      </form>
    </Modal>
  );
}

export function useDeleteApplicationModal() {
  const [showDeleteApplicationModal, setShowDeleteApplicationModal] = useState(false);

  const DeleteApplicationModalCallback = useCallback(() => {
    return (
      <DeleteApplicationModal
        showDeleteApplicationModal={showDeleteApplicationModal}
        setShowDeleteApplicationModal={setShowDeleteApplicationModal}
      />
    );
  }, [showDeleteApplicationModal, setShowDeleteApplicationModal]);

  return useMemo(
    () => ({
      setShowDeleteApplicationModal,
      DeleteApplicationModal: DeleteApplicationModalCallback,
    }),
    [setShowDeleteApplicationModal, DeleteApplicationModalCallback],
  );
}
