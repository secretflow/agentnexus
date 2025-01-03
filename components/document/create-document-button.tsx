"use client";

import { useUpsertDocumentModal } from "@/components/modals";
import { Button } from "@/components/ui";

export function CreateDocumentButton() {
  const { setShowUpsertDocumentModal, UpsertDocumentModal } = useUpsertDocumentModal();

  return (
    <div>
      <Button
        text="添加文档"
        className="flex-shrink-0 truncate"
        onClick={() => {
          setShowUpsertDocumentModal(true);
        }}
      />
      <UpsertDocumentModal />
    </div>
  );
}
