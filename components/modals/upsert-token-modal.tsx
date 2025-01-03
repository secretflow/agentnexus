"use client";

import { Logo } from "@/components/icons";
import { UpsertTokenForm } from "@/components/token";
import { Button, type ButtonProps, Modal } from "@/components/ui";
import type { TokenProps } from "@/lib/zod";
import { type Dispatch, type SetStateAction, useCallback, useMemo, useState } from "react";

function UpsertTokenModal({
  showUpsertTokenModal,
  setShowUpsertTokenModal,
  token,
  onTokenCreated,
}: {
  showUpsertTokenModal: boolean;
  setShowUpsertTokenModal: Dispatch<SetStateAction<boolean>>;
  token?: TokenProps;
  onTokenCreated?: (token: string) => void;
}) {
  return (
    <Modal showModal={showUpsertTokenModal} setShowModal={setShowUpsertTokenModal}>
      <div className="flex flex-col items-center justify-center space-y-3 border-gray-200 border-b px-4 py-4 pt-8 sm:px-16">
        <Logo />
        <h3 className="font-medium text-lg">{token ? "编辑" : "创建"} API 秘钥</h3>
      </div>

      <UpsertTokenForm
        token={token}
        className="bg-gray-50 px-4 py-8 sm:px-16"
        onSuccess={({ token }) => {
          onTokenCreated?.(token);
          setShowUpsertTokenModal(false);
        }}
      />
    </Modal>
  );
}

function AddTokenButton({
  setShowUpsertTokenModal,
  buttonProps,
}: {
  setShowUpsertTokenModal: Dispatch<SetStateAction<boolean>>;
  buttonProps?: Partial<ButtonProps>;
}) {
  return (
    <div>
      <Button text="创建" onClick={() => setShowUpsertTokenModal(true)} {...buttonProps} />
    </div>
  );
}

export function useUpsertTokenModal(
  {
    token,
    onTokenCreated,
  }: {
    token?: TokenProps;
    onTokenCreated?: (token: string) => void;
  } = { onTokenCreated: () => {} },
) {
  const [showUpsertTokenModal, setShowUpsertTokenModal] = useState(false);

  const UpsertTokenModalCallback = useCallback(() => {
    return (
      <UpsertTokenModal
        showUpsertTokenModal={showUpsertTokenModal}
        setShowUpsertTokenModal={setShowUpsertTokenModal}
        token={token}
        onTokenCreated={onTokenCreated}
      />
    );
  }, [showUpsertTokenModal, setShowUpsertTokenModal]);

  const AddTokenButtonCallback = useCallback(() => {
    return <AddTokenButton setShowUpsertTokenModal={setShowUpsertTokenModal} />;
  }, [setShowUpsertTokenModal]);

  return useMemo(
    () => ({
      setShowUpsertTokenModal,
      UpsertTokenModal: UpsertTokenModalCallback,
      AddTokenButton: AddTokenButtonCallback,
    }),
    [setShowUpsertTokenModal, UpsertTokenModalCallback, AddTokenButtonCallback],
  );
}
