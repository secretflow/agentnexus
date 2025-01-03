"use client";

import { Logo } from "@/components/icons";
import { Modal } from "@/components/ui";
import { UpsertVariableForm } from "@/components/workflow/variable";
import type { VariableProps } from "@/lib/zod";
import { type Dispatch, type SetStateAction, useCallback, useMemo, useState } from "react";

function UpsertVariableModal({
  showUpsertVariableModal,
  setShowUpsertVariableModal,
  props,
  onChange,
}: {
  showUpsertVariableModal: boolean;
  setShowUpsertVariableModal: Dispatch<SetStateAction<boolean>>;
  props?: VariableProps;
  onChange?: (props: VariableProps) => void;
}) {
  return (
    <Modal
      showModal={showUpsertVariableModal}
      setShowModal={setShowUpsertVariableModal}
      className="scrollbar-hide h-fit max-h-[95vh] overflow-auto"
    >
      <div className="flex flex-col items-center justify-center space-y-3 border-gray-200 border-b px-4 py-4 pt-8 sm:px-16">
        <Logo />
        <h3 className="font-medium text-lg">{props ? "编辑" : "添加"}变量</h3>
      </div>

      <UpsertVariableForm
        props={props}
        onSuccess={(data) => {
          onChange?.(data);
        }}
        className="bg-gray-50 px-4 py-8 sm:px-16"
      />
    </Modal>
  );
}

export function useUpsertVariableModal({
  props,
  onChange,
}: { props?: VariableProps; onChange?: (props: VariableProps) => void } = {}) {
  const [showUpsertVariableModal, setShowUpsertVariableModal] = useState(false);

  const UpsertVariableModalCallback = useCallback(() => {
    return (
      <UpsertVariableModal
        showUpsertVariableModal={showUpsertVariableModal}
        setShowUpsertVariableModal={setShowUpsertVariableModal}
        props={props}
        onChange={onChange}
      />
    );
  }, [showUpsertVariableModal, setShowUpsertVariableModal]);

  return useMemo(
    () => ({
      setShowUpsertVariableModal,
      UpsertVariableModal: UpsertVariableModalCallback,
    }),
    [setShowUpsertVariableModal, UpsertVariableModalCallback],
  );
}
