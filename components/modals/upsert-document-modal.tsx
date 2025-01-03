"use client";

import { UpsertDocumentForm } from "@/components/document";
import { Modal } from "@/components/ui";
import type { KnowledgebaseResourceProps } from "@/lib/zod";
import { type Dispatch, type SetStateAction, useCallback, useMemo, useState } from "react";

function UpsertDocumentModal({
  document,
  showUpsertDocumentModal,
  setShowUpsertDocumentModal,
}: {
  document?: KnowledgebaseResourceProps;
  showUpsertDocumentModal: boolean;
  setShowUpsertDocumentModal: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Modal
      className="sm:max-w-[600px]"
      showModal={showUpsertDocumentModal}
      setShowModal={setShowUpsertDocumentModal}
    >
      <UpsertDocumentForm doc={document} onClose={() => setShowUpsertDocumentModal(false)} />
    </Modal>
  );
}

export function useUpsertDocumentModal({
  document,
}: {
  document?: KnowledgebaseResourceProps;
} = {}) {
  const [showUpsertDocumentModal, setShowUpsertDocumentModal] = useState(false);

  const UpsertDocumentModalCallback = useCallback(() => {
    return (
      <UpsertDocumentModal
        document={document}
        showUpsertDocumentModal={showUpsertDocumentModal}
        setShowUpsertDocumentModal={setShowUpsertDocumentModal}
      />
    );
  }, [showUpsertDocumentModal, setShowUpsertDocumentModal]);

  return useMemo(
    () => ({ setShowUpsertDocumentModal, UpsertDocumentModal: UpsertDocumentModalCallback }),
    [setShowUpsertDocumentModal, UpsertDocumentModalCallback],
  );
}
