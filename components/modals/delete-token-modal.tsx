"use client";

import { Logo } from "@/components/icons";
import { Badge, Button, Modal } from "@/components/ui";
import { useMediaQuery } from "@/lib/hooks";
import { useApplication } from "@/lib/swr";
import { timeAgo } from "@/lib/utils";
import type { TokenProps } from "@/lib/zod";
import { type Dispatch, type SetStateAction, useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";

function DeleteTokenModal({
  showDeleteTokenModal,
  setShowDeleteTokenModal,
  token,
}: {
  showDeleteTokenModal: boolean;
  setShowDeleteTokenModal: Dispatch<SetStateAction<boolean>>;
  token: TokenProps;
}) {
  const { isMobile } = useMediaQuery();
  const { application } = useApplication();
  const [removing, setRemoving] = useState(false);

  const handleDelete = () => {
    setRemoving(true);
    fetch(
      `/api/applications/${application?.id}/tokens/${token.id}?workspaceId=${application?.workspaceId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      },
    ).then(async (res) => {
      setRemoving(false);
      if (res.ok) {
        toast.success(`API 秘钥删除成功！`);
        mutate(
          `/api/applications/${application?.id}/tokens?workspaceId=${application?.workspaceId}`,
        );
        setShowDeleteTokenModal(false);
      } else {
        const { message } = await res.json();
        toast.error(message);
      }
    });
  };

  return (
    <Modal showModal={showDeleteTokenModal} setShowModal={setShowDeleteTokenModal}>
      <div className="flex flex-col items-center justify-center space-y-3 border-gray-200 border-b px-4 py-4 pt-8 sm:px-16">
        <Logo />
        <h3 className="font-medium text-lg">删除 API 秘钥</h3>
        <p className="text-center text-gray-500 text-sm">
          删除 API 秘钥将永久撤销应用访问权限。请谨慎操作。确定继续吗？
        </p>
      </div>

      <div className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 text-left sm:px-16">
        <div className="relative flex items-center space-x-3 rounded-md border border-gray-300 bg-white px-1 py-3">
          <Badge variant="neutral" className="absolute top-2 right-2">
            {token.partialKey}
          </Badge>
          <div className="flex flex-col">
            <h3 className="line-clamp-1 w-48 font-semibold text-gray-700">{token.name}</h3>
            <p className="text-gray-500 text-xs" suppressHydrationWarning>
              Last used {timeAgo(token.lastUsed, { withAgo: true })}
            </p>
          </div>
        </div>
        <Button
          text="确认"
          variant="danger"
          autoFocus={!isMobile}
          loading={removing}
          onClick={handleDelete}
        />
      </div>
    </Modal>
  );
}

export function useDeleteTokenModal({ token }: { token: TokenProps }) {
  const [showDeleteTokenModal, setShowDeleteTokenModal] = useState(false);

  const DeleteTokenModalCallback = useCallback(() => {
    return (
      <DeleteTokenModal
        showDeleteTokenModal={showDeleteTokenModal}
        setShowDeleteTokenModal={setShowDeleteTokenModal}
        token={token}
      />
    );
  }, [showDeleteTokenModal, setShowDeleteTokenModal]);

  return useMemo(
    () => ({
      setShowDeleteTokenModal,
      DeleteTokenModal: DeleteTokenModalCallback,
    }),
    [setShowDeleteTokenModal, DeleteTokenModalCallback],
  );
}
