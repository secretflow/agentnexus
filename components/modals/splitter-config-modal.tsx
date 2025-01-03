"use client";

import { SplitterConfigForm } from "@/components/document";
import { Modal } from "@/components/ui";
import type { SplitConfigProps } from "@/lib/zod";
import { type Dispatch, type SetStateAction, useCallback, useMemo, useState } from "react";

function SplitterConfigModal({
  config,
  onSubmit,
  showSplitterConfigModal,
  setShowSplitterConfigModal,
}: {
  config?: SplitConfigProps;
  onSubmit?: (data: SplitConfigProps) => void;
  showSplitterConfigModal: boolean;
  setShowSplitterConfigModal: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Modal
      className="sm:max-w-[450px]"
      showModal={showSplitterConfigModal}
      setShowModal={setShowSplitterConfigModal}
    >
      <SplitterConfigForm
        config={config}
        onSuccess={onSubmit}
        onClose={() => setShowSplitterConfigModal(false)}
      />
    </Modal>
  );
}

export function useSplitterConfigModal({
  config,
  onSubmit,
}: {
  config?: SplitConfigProps;
  onSubmit?: (data: SplitConfigProps) => void;
} = {}) {
  const [showSplitterConfigModal, setShowSplitterConfigModal] = useState(false);

  const SplitterConfigModalCallback = useCallback(() => {
    return (
      <SplitterConfigModal
        config={config}
        onSubmit={onSubmit}
        showSplitterConfigModal={showSplitterConfigModal}
        setShowSplitterConfigModal={setShowSplitterConfigModal}
      />
    );
  }, [showSplitterConfigModal, setShowSplitterConfigModal]);

  return useMemo(
    () => ({ setShowSplitterConfigModal, SplitterConfigModal: SplitterConfigModalCallback }),
    [setShowSplitterConfigModal, SplitterConfigModalCallback],
  );
}
