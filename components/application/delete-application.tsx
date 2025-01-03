"use client";

import { useDeleteApplicationModal } from "@/components/modals";
import { Button } from "@/components/ui";

export function DeleteApplication() {
  const { setShowDeleteApplicationModal, DeleteApplicationModal } = useDeleteApplicationModal();

  return (
    <div className="rounded-lg border border-red-600 bg-white">
      <DeleteApplicationModal />
      <div className="flex flex-col space-y-3 p-5 sm:p-10">
        <h2 className="font-medium text-xl">删除应用</h2>
        <p className="text-gray-500 text-sm">
          此操作将永久删除您的应用以及所有关联数据，无法撤销。请谨慎操作。
        </p>
      </div>
      <div className="border-red-600 border-b" />

      <div className="flex items-center justify-end px-5 py-4 sm:px-10">
        <div>
          <Button
            text="删除应用"
            variant="danger"
            onClick={() => setShowDeleteApplicationModal(true)}
          />
        </div>
      </div>
    </div>
  );
}
