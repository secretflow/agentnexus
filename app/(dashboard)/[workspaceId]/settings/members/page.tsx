"use client";

import { useDeleteMemberModal } from "@/components/modals/delete-member-modal";
import { useInviteCodeModal } from "@/components/modals/invite-code-modal";
import { Avatar, Button, IconMenu, Popover } from "@/components/ui";
import { useMembers, useWorkspace } from "@/lib/swr";
import { cn } from "@/lib/utils";
import type { UserWithRoleProps } from "@/lib/zod";
import { Ellipsis, Link2, UserMinus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";

type TabType = "Members" | "Invitations";
const tabs: { name: TabType; label: string }[] = [{ name: "Members", label: "成员" }];

export default function MemberPage() {
  const { members } = useMembers();

  const { setShowInviteCodeModal, InviteCodeModal } = useInviteCodeModal();
  const [currentTab, setCurrentTab] = useState<TabType>("Members");

  return (
    <>
      <InviteCodeModal />
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="flex flex-col items-center justify-between space-y-3 p-5 sm:flex-row sm:space-y-0 sm:p-10">
          <div className="flex flex-col space-y-3">
            <h2 className="font-medium text-xl">成员</h2>
            <p className="text-gray-500 text-sm">可以访问该工作空间的所有成员</p>
          </div>
          <div className="flex space-x-2">
            <Button
              icon={<Link2 className="h-4 w-4 text-gray-800" />}
              text="邀请链接"
              variant="secondary"
              onClick={() => {
                setShowInviteCodeModal(true);
              }}
              className="h-9 space-x-0"
            />
          </div>
        </div>
        <div className="flex space-x-3 border-gray-200 border-b px-3 sm:px-7">
          {tabs.map(({ name, label }) => (
            <div
              key={name}
              className={`${
                name === currentTab ? "border-black" : "border-transparent"
              } border-b py-1`}
            >
              <button
                onClick={() => setCurrentTab(name)}
                className="rounded-md px-3 py-1.5 text-sm transition-all duration-75 hover:bg-gray-100 active:bg-gray-200"
              >
                {label}
              </button>
            </div>
          ))}
        </div>
        <div className="grid divide-y divide-gray-200">
          {members
            ? members.length > 0
              ? members.map((user) => <UserCard key={user.id} user={user} />)
              : null
            : Array.from({ length: 5 }).map((_, i) => <UserPlaceholder key={i} />)}
        </div>
      </div>
    </>
  );
}

const UserCard = ({
  user,
}: {
  user: UserWithRoleProps;
}) => {
  const { workspace } = useWorkspace();
  const { data: session } = useSession();

  const { id, name, email } = user;
  const [openPopover, setOpenPopover] = useState(false);

  const { DeleteMemberModal, setShowDeleteMemberModal } = useDeleteMemberModal({
    user,
  });

  const hasActionPermission = useMemo(() => {
    if (workspace?.isOwner) {
      return workspace.userId !== user.id;
    }
    return id === session?.user?.id;
  }, [workspace, user]);

  return (
    <>
      <DeleteMemberModal />
      <div key={id} className="flex items-center justify-between space-x-3 px-4 py-3 sm:pl-8">
        <div className="flex items-start space-x-3">
          <div className="flex items-center space-x-3">
            <Avatar user={user} />
            <div className="flex flex-col">
              <h3 className="font-medium text-sm">{name || email}</h3>
              <p className="text-gray-500 text-xs">{email}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-x-3">
          <p className="text-gray-500 text-xs capitalize">
            {user.role === "owner" ? "所有者" : "成员"}
          </p>
          <Popover
            content={
              <div className="grid w-full gap-1 p-2 sm:w-48">
                <button
                  onClick={() => {
                    setOpenPopover(false);
                    setShowDeleteMemberModal(true);
                  }}
                  className="rounded-md p-2 text-left font-medium text-red-600 text-sm transition-all duration-75 hover:bg-red-600 hover:text-white"
                >
                  <IconMenu
                    text={workspace?.isOwner ? "移除成员" : "离开工作空间"}
                    icon={<UserMinus className="h-4 w-4" />}
                  />
                </button>
              </div>
            }
            align="end"
            openPopover={openPopover}
            setOpenPopover={setOpenPopover}
          >
            <div
              className={cn({
                invisible: !hasActionPermission,
              })}
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                onClick={() => {
                  if (hasActionPermission) {
                    setOpenPopover(true);
                  }
                }}
                type="button"
                icon={<Ellipsis className="h-5 w-5 text-gray-500" />}
                className="h-8 space-x-0 px-1 py-2"
                variant="ghost"
              />
            </div>
          </Popover>
        </div>
      </div>
    </>
  );
};

const UserPlaceholder = () => (
  <div className="flex items-center justify-between space-x-3 px-4 py-3 sm:px-8">
    <div className="flex items-center space-x-3">
      <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
      <div className="flex flex-col">
        <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
        <div className="mt-1 h-3 w-32 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
    <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
  </div>
);
