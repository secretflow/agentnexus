import { Logo } from "@/components/icons";
import { Button, CopyButton, Modal } from "@/components/ui";
import { useWorkspace } from "@/lib/swr";
import { type Dispatch, type SetStateAction, useCallback, useMemo, useState } from "react";

function InviteCodeModal({
  showInviteCodeModal,
  setShowInviteCodeModal,
}: {
  showInviteCodeModal: boolean;
  setShowInviteCodeModal: Dispatch<SetStateAction<boolean>>;
}) {
  const { workspace, mutate } = useWorkspace();

  const inviteLink = useMemo(() => {
    return `${process.env.NEXT_PUBLIC_APP_URL}/invites/${workspace?.inviteCode}`;
  }, [workspace]);

  const [resetting, setResetting] = useState(false);

  return (
    <Modal
      showModal={showInviteCodeModal}
      setShowModal={setShowInviteCodeModal}
      className="sm:max-w-[500px]"
    >
      <div className="flex w-[500px] flex-col items-center justify-center space-y-3 border-gray-200 border-b px-4 py-4 pt-8 sm:px-16">
        <Logo />
        <h3 className="font-medium text-lg">邀请链接</h3>
        <p className="text-gray-500 text-sm">允许其他人通过下面的链接加入您的工作区。</p>
      </div>

      <div className="flex flex-col space-y-3 bg-gray-50 px-4 py-8 text-left sm:px-16">
        <div className="flex items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-1.5">
          <p className="scrollbar-hide w-[88%] overflow-scroll font-mono text-gray-500 text-xs">
            {inviteLink}
          </p>
          <CopyButton value={inviteLink} className="rounded-md" />
        </div>
        <Button
          text="重置邀请链接"
          variant="secondary"
          loading={resetting}
          onClick={() => {
            setResetting(true);
            fetch(`/api/workspaces/${workspace?.id}/members/invites/reset`, {
              method: "POST",
            }).then(async () => {
              await mutate();
              setResetting(false);
            });
          }}
        />
      </div>
    </Modal>
  );
}

export function useInviteCodeModal() {
  const [showInviteCodeModal, setShowInviteCodeModal] = useState(false);

  const InviteCodeModalCallback = useCallback(() => {
    return (
      <InviteCodeModal
        showInviteCodeModal={showInviteCodeModal}
        setShowInviteCodeModal={setShowInviteCodeModal}
      />
    );
  }, [showInviteCodeModal, setShowInviteCodeModal]);

  return useMemo(
    () => ({
      setShowInviteCodeModal,
      InviteCodeModal: InviteCodeModalCallback,
    }),
    [setShowInviteCodeModal, InviteCodeModalCallback],
  );
}
