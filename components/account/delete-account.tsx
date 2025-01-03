"use client";
import { useDeleteAccountModal } from "@/components/modals";
import { Button } from "@/components/ui";

export function DeleteAccount() {
  const { setShowDeleteAccountModal, DeleteAccountModal } = useDeleteAccountModal();

  return (
    <div className="rounded-lg border border-red-600 bg-white">
      <DeleteAccountModal />
      <div className="flex flex-col space-y-3 p-5 sm:p-10">
        <h2 className="font-medium text-xl">注销账号</h2>
        <p className="text-gray-500 text-sm">
          警告：这将永久删除您的账号，并且无法撤销。请谨慎操作。
        </p>
      </div>
      <div className="border-red-600 border-b" />

      <div className="flex items-center justify-end p-3 sm:px-10">
        <div>
          <Button
            text="注销账号"
            variant="danger"
            onClick={() => setShowDeleteAccountModal(true)}
          />
        </div>
      </div>
    </div>
  );
}
