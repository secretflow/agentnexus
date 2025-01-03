"use client";

import { Avatar, Button, Modal } from "@/components/ui";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { type Dispatch, type SetStateAction, useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

function DeleteAccountModal({
  showDeleteAccountModal,
  setShowDeleteAccountModal,
}: {
  showDeleteAccountModal: boolean;
  setShowDeleteAccountModal: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [deleting, setDeleting] = useState(false);

  async function deleteAccount() {
    setDeleting(true);
    await fetch(`/api/user`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (res) => {
      if (res.ok) {
        update(null);
        await new Promise((resolve) =>
          setTimeout(() => {
            router.push("/login");
            resolve(null);
          }, 200),
        );
      } else {
        setDeleting(false);
        const { message } = await res.json();
        throw message;
      }
    });
  }

  return (
    <Modal showModal={showDeleteAccountModal} setShowModal={setShowDeleteAccountModal}>
      <div className="flex flex-col items-center justify-center space-y-3 border-gray-200 border-b px-4 py-4 pt-8 sm:px-16">
        <Avatar user={session?.user} />
        <h3 className="font-medium text-lg">注销账号</h3>
        <p className="text-center text-gray-500 text-sm">
          警告：这将永久删除您的账号，并且无法撤销。请谨慎操作。
        </p>
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          toast.promise(deleteAccount(), {
            loading: "注销账号...",
            success: "账号注销成功！",
            error: (err) => err,
          });
        }}
        className="flex flex-col space-y-6 bg-gray-50 px-4 py-8 text-left sm:px-16"
      >
        <div>
          <label htmlFor="verification" className="block text-gray-700 text-sm">
            输入 <span className="font-semibold text-black">确认注销</span> 以确认
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <input
              type="text"
              name="verification"
              id="verification"
              pattern="确认注销"
              required
              autoFocus={false}
              autoComplete="off"
              className="block w-full rounded-md border-gray-300 text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
            />
          </div>
        </div>

        <Button text="确认注销" variant="danger" loading={deleting} />
      </form>
    </Modal>
  );
}

export function useDeleteAccountModal() {
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  const DeleteAccountModalCallback = useCallback(() => {
    return (
      <DeleteAccountModal
        showDeleteAccountModal={showDeleteAccountModal}
        setShowDeleteAccountModal={setShowDeleteAccountModal}
      />
    );
  }, [showDeleteAccountModal, setShowDeleteAccountModal]);

  return useMemo(
    () => ({
      setShowDeleteAccountModal,
      DeleteAccountModal: DeleteAccountModalCallback,
    }),
    [setShowDeleteAccountModal, DeleteAccountModalCallback],
  );
}
