"use client";

import { useDeleteWorkspaceModal } from "@/components/modals";
import { Button } from "@/components/ui";

export function DeleteWorkspace({
  disabledTooltip,
}: {
  disabledTooltip?: string;
}) {
  const { setShowDeleteWorkspaceModal, DeleteWorkspaceModal } = useDeleteWorkspaceModal();

  return (
    <div className="rounded-lg border border-red-600 bg-white">
      <DeleteWorkspaceModal />
      <div className="flex flex-col space-y-3 p-5 sm:p-10">
        <h2 className="font-medium text-xl">删除工作空间</h2>
        <p className="text-gray-500 text-sm">
          此操作将永久删除您的工作空间下面的应用、知识库和工具，无法撤销。请谨慎操作。
        </p>
      </div>
      <div className="border-red-600 border-b" />

      <div className="flex items-center justify-end px-5 py-4 sm:px-10">
        <div>
          <Button
            text="删除工作空间"
            variant="danger"
            onClick={() => setShowDeleteWorkspaceModal(true)}
            disabledTooltip={disabledTooltip}
          />
        </div>
      </div>
    </div>
  );
}
