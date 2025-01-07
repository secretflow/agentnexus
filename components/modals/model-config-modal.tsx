"use client";

import { ModelConfigForm } from "@/components/model/model-config-form";
import { Modal } from "@/components/ui";
import type { RecallConfigProps } from "@/lib/zod";
import { type Dispatch, type SetStateAction, useCallback, useMemo, useState } from "react";

function ModelConfigModal({
  config,
  onSubmit,
  showModelConfigModal,
  setShowModelConfigModal,
}: {
  config?: RecallConfigProps;
  onSubmit?: (data: RecallConfigProps) => void;
  showModelConfigModal: boolean;
  setShowModelConfigModal: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Modal
      className="sm:max-w-[450px]"
      showModal={showModelConfigModal}
      setShowModal={setShowModelConfigModal}
    >
      <ModelConfigForm
        config={config}
        onSuccess={(config) => {
          onSubmit?.(config);
          setShowModelConfigModal(false);
        }}
        onClose={() => setShowModelConfigModal(false)}
      />
    </Modal>
  );
}

export function useModelConfigModal({
  config,
  onSubmit,
}: {
  config?: RecallConfigProps;
  onSubmit?: (data: RecallConfigProps) => void;
} = {}) {
  const [showModelConfigModal, setShowModelConfigModal] = useState(false);

  const ModelConfigModalCallback = useCallback(() => {
    return (
      <ModelConfigModal
        config={config}
        onSubmit={onSubmit}
        showModelConfigModal={showModelConfigModal}
        setShowModelConfigModal={setShowModelConfigModal}
      />
    );
  }, [showModelConfigModal, setShowModelConfigModal]);

  return useMemo(
    () => ({
      setShowModelConfigModal,
      ModelConfigModal: ModelConfigModalCallback,
    }),
    [setShowModelConfigModal, ModelConfigModalCallback],
  );
}
