"use client";

import { RecallConfigForm } from "@/components/knowledgebase/recall-config-form";
import { Modal } from "@/components/ui";
import type { RecallConfigProps } from "@/lib/zod";
import { type Dispatch, type SetStateAction, useCallback, useMemo, useState } from "react";

function RecallConfigModal({
  config,
  onSubmit,
  showRecallConfigModal,
  setShowRecallConfigModal,
}: {
  config?: RecallConfigProps;
  onSubmit?: (data: RecallConfigProps) => void;
  showRecallConfigModal: boolean;
  setShowRecallConfigModal: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Modal
      className="sm:max-w-[450px]"
      showModal={showRecallConfigModal}
      setShowModal={setShowRecallConfigModal}
    >
      <RecallConfigForm
        config={config}
        onSuccess={(config) => {
          onSubmit?.(config);
          setShowRecallConfigModal(false);
        }}
        onClose={() => setShowRecallConfigModal(false)}
      />
    </Modal>
  );
}

export function useRecallConfigModal({
  config,
  onSubmit,
}: {
  config?: RecallConfigProps;
  onSubmit?: (data: RecallConfigProps) => void;
} = {}) {
  const [showRecallConfigModal, setShowRecallConfigModal] = useState(false);

  const RecallConfigModalCallback = useCallback(() => {
    return (
      <RecallConfigModal
        config={config}
        onSubmit={onSubmit}
        showRecallConfigModal={showRecallConfigModal}
        setShowRecallConfigModal={setShowRecallConfigModal}
      />
    );
  }, [showRecallConfigModal, setShowRecallConfigModal]);

  return useMemo(
    () => ({
      setShowRecallConfigModal,
      RecallConfigModal: RecallConfigModalCallback,
    }),
    [setShowRecallConfigModal, RecallConfigModalCallback],
  );
}
