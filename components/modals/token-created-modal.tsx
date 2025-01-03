"use client";

import { Logo } from "@/components/icons";
import { Button, CopyButton, Modal } from "@/components/ui";
import { type Dispatch, type SetStateAction, useCallback, useMemo, useState } from "react";

function TokenCreatedModal({
  showTokenCreatedModal,
  setShowTokenCreatedModal,
  token,
}: {
  showTokenCreatedModal: boolean;
  setShowTokenCreatedModal: Dispatch<SetStateAction<boolean>>;
  token: string;
}) {
  return (
    <Modal showModal={showTokenCreatedModal} setShowModal={setShowTokenCreatedModal}>
      <div className="flex flex-col items-center justify-center space-y-3 border-gray-200 border-b px-4 py-4 pt-8 sm:px-16">
        <Logo />
        <h3 className="font-medium text-lg">API 秘钥创建成功</h3>
        <p className="text-center text-gray-500 text-sm">
          出于安全考虑，此钥匙仅显示一次。请务必复制并妥善保存。
        </p>
      </div>

      <div className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 text-left sm:px-16">
        <div className="flex items-center justify-between rounded-md border border-gray-300 bg-white p-3">
          <p className="font-mono text-gray-500 text-sm">{token}</p>
          <CopyButton value={token} className="rounded-md" variant="neutral" />
        </div>
        <Button text="完成" variant="secondary" onClick={() => setShowTokenCreatedModal(false)} />
      </div>
    </Modal>
  );
}

export function useTokenCreatedModal({ token }: { token: string }) {
  const [showTokenCreatedModal, setShowTokenCreatedModal] = useState(false);

  const TokenCreatedModalCallback = useCallback(() => {
    return (
      <TokenCreatedModal
        showTokenCreatedModal={showTokenCreatedModal}
        setShowTokenCreatedModal={setShowTokenCreatedModal}
        token={token}
      />
    );
  }, [showTokenCreatedModal, setShowTokenCreatedModal]);

  return useMemo(
    () => ({
      setShowTokenCreatedModal,
      TokenCreatedModal: TokenCreatedModalCallback,
    }),
    [setShowTokenCreatedModal, TokenCreatedModalCallback],
  );
}
