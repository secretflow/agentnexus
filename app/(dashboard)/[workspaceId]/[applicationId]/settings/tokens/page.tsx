"use client";

import { Key } from "@/components/icons";
import { EmptyState } from "@/components/layout";
import {
  useDeleteTokenModal,
  useTokenCreatedModal,
  useUpsertTokenModal,
} from "@/components/modals";
import { Avatar, Button, LoadingSpinner, Popover, Tooltip } from "@/components/ui";
import { useTokens } from "@/lib/swr";
import { timeAgo } from "@/lib/utils";
import type { TokenProps } from "@/lib/zod";
import { Edit3, MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";

export default function TokensPage() {
  const { tokens, loading } = useTokens();

  const [createdToken, setCreatedToken] = useState<string | null>(null);
  const { TokenCreatedModal, setShowTokenCreatedModal } = useTokenCreatedModal({
    token: createdToken || "",
  });

  const onTokenCreated = (token: string) => {
    setCreatedToken(token);
    setShowTokenCreatedModal(true);
  };

  const { UpsertTokenModal, AddTokenButton } = useUpsertTokenModal({
    onTokenCreated,
  });

  return (
    <>
      <TokenCreatedModal />
      <UpsertTokenModal />
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="flex flex-col items-center justify-between gap-4 space-y-3 border-gray-200 border-b p-5 sm:flex-row sm:space-y-0 sm:p-10">
          <div className="flex max-w-screen-sm flex-col space-y-3">
            <h2 className="font-medium text-xl">应用 API 秘钥</h2>
            <p className="text-gray-500 text-sm">
              API 秘钥赋予其他应用访问你应用的权限。
              为了安全起见，请务必保密，切勿与他人共享或在客户端代码中公开。
            </p>
          </div>
          <AddTokenButton />
        </div>
        {loading || !tokens ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-20">
            <LoadingSpinner className="size-6 text-gray-500" />
            <p className="text-gray-500 text-sm">获取 API 秘钥...</p>
          </div>
        ) : tokens.length > 0 ? (
          <div>
            <div className="grid grid-cols-5 border-gray-200 border-b px-5 py-2 font-medium text-gray-500 text-sm sm:px-10">
              <div className="col-span-3">Name</div>
              <div>Key</div>
              <div className="text-center">Last used</div>
            </div>
            <div className="divide-y divide-gray-200">
              {tokens.map((token) => (
                <TokenRow key={token.id} {...token} />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-y-4 py-20">
            <EmptyState icon={Key} title="该应用下没有 API 秘钥" />
            <AddTokenButton />
          </div>
        )}
      </div>
    </>
  );
}

const TokenRow = (token: TokenProps) => {
  const [openPopover, setOpenPopover] = useState(false);

  const { setShowUpsertTokenModal, UpsertTokenModal } = useUpsertTokenModal({
    token,
  });

  const { DeleteTokenModal, setShowDeleteTokenModal } = useDeleteTokenModal({
    token,
  });

  return (
    <>
      <UpsertTokenModal />
      <DeleteTokenModal />
      <div className="relative grid grid-cols-5 items-center px-5 py-3 sm:px-10">
        <div className="col-span-3 flex items-center space-x-3">
          <div className="flex flex-col gap-y-px">
            <div className="flex items-center gap-x-2">
              <p className="font-semibold text-gray-700">{token.name}</p>
            </div>
            <div className="flex items-center gap-x-1">
              <Tooltip
                content={
                  <div className="w-full max-w-xs p-4">
                    <Avatar user={token.user} className="size-10" />
                    <div className="mt-2 flex items-center gap-x-1.5">
                      <p className="font-semibold text-gray-700 text-sm">
                        {token.user.name || "Anonymous User"}
                      </p>
                    </div>
                    <p className="mt-1 text-gray-500 text-xs">
                      创建于
                      {new Date(token.createdAt).toLocaleDateString("zh-CN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                }
              >
                <div>
                  <Avatar user={token.user} className="h-4 w-4" />
                </div>
              </Tooltip>
              <p className="text-gray-500 text-sm" suppressHydrationWarning>
                创建于{timeAgo(token.createdAt)}
              </p>
            </div>
          </div>
        </div>
        <div className="font-mono text-sm">{token.partialKey}</div>
        <div className="text-center text-gray-500 text-sm" suppressHydrationWarning>
          {timeAgo(token.lastUsed)}
        </div>
        <Popover
          content={
            <div className="w-full sm:w-48">
              <div className="grid gap-px p-2">
                <Button
                  text="编辑 API 秘钥"
                  variant="ghost"
                  icon={<Edit3 className="h-4 w-4" />}
                  className="h-9 justify-start px-2 font-medium"
                  onClick={() => {
                    setOpenPopover(false);
                    setShowUpsertTokenModal(true);
                  }}
                />
                <Button
                  text="删除 API 秘钥"
                  variant="danger-ghost"
                  icon={<Trash2 className="h-4 w-4" />}
                  className="h-9 justify-start px-2 font-medium"
                  onClick={() => {
                    setOpenPopover(false);
                    setShowDeleteTokenModal(true);
                  }}
                />
              </div>
            </div>
          }
          align="end"
          openPopover={openPopover}
          setOpenPopover={setOpenPopover}
        >
          <button
            onClick={() => {
              setOpenPopover(!openPopover);
            }}
            className="absolute right-4 rounded-md px-1 py-2 transition-all duration-75 hover:bg-gray-100 active:bg-gray-200"
          >
            <MoreVertical className="size-5 text-gray-500" />
          </button>
        </Popover>
      </div>
    </>
  );
};
