"use client";

import { OfficeBuilding } from "@/components/icons";
import { BlurImage } from "@/components/layout";
import { ModalContext } from "@/components/modals";
import { Popover } from "@/components/ui";
import { DICEBEAR_AVATAR_URL } from "@/lib/constants";
import { useWorkspaces } from "@/lib/swr";
import type { WorkspaceProps } from "@/lib/zod";
import { ChevronsUpDown } from "lucide-react";
import { useSession } from "next-auth/react";
import { Link } from "next-view-transitions";
import { useParams } from "next/navigation";
import { useContext, useMemo, useState } from "react";

export function WorkspaceSwitcher() {
  const { workspaces } = useWorkspaces();
  const { data: session, status } = useSession();
  const { workspaceId } = useParams<{ workspaceId?: string }>();

  const selected = useMemo(() => {
    const selectedWorkspace = workspaces?.find((workspace) => workspace.id === workspaceId);

    if (workspaceId && workspaces && selectedWorkspace) {
      return {
        ...selectedWorkspace,
        image: selectedWorkspace.image || `${DICEBEAR_AVATAR_URL}${selectedWorkspace.name}`,
      };
    } else {
      return {
        id: "",
        name: session?.user?.name || session?.user?.email || "You",
        image: session?.user?.image || `${DICEBEAR_AVATAR_URL}${session?.user?.email}`,
      };
    }
  }, [workspaceId, workspaces, session]);

  const [openPopover, setOpenPopover] = useState(false);

  if (!workspaces || status === "loading") {
    return <WorkspaceSwitcherPlaceholder />;
  }

  return (
    <div>
      <Popover
        content={
          <WorkspaceList
            selected={selected}
            workspaces={workspaces}
            setOpenPopover={setOpenPopover}
          />
        }
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
      >
        <button
          onClick={() => setOpenPopover(!openPopover)}
          className="flex items-center justify-between rounded-lg bg-white p-1.5 text-left text-sm transition-all duration-75 hover:bg-gray-100 focus:outline-none active:bg-gray-200"
        >
          <div className="flex items-center space-x-3 pr-2">
            <BlurImage
              src={selected.image}
              referrerPolicy="no-referrer"
              width={20}
              height={20}
              alt={selected.name}
              className="size-8 flex-none overflow-hidden rounded-full"
            />
            <div className="hidden items-center space-x-3 sm:flex">
              <span className="inline-block max-w-[100px] truncate font-medium text-sm sm:max-w-[200px]">
                {selected.name}
              </span>
            </div>
          </div>
          <ChevronsUpDown className="size-4 text-gray-400" aria-hidden="true" />
        </button>
      </Popover>
    </div>
  );
}

function WorkspaceList({
  selected,
  workspaces,
  setOpenPopover,
}: {
  selected: {
    id: string;
    name: string;
    image: string;
  };
  workspaces: WorkspaceProps[];
  setOpenPopover: (open: boolean) => void;
}) {
  const { setShowAddWorkspaceModal } = useContext(ModalContext);

  return (
    <div className="relative mt-1 max-h-72 w-full space-y-0.5 overflow-auto rounded-md bg-white p-2 text-base sm:w-60 sm:text-sm sm:shadow-lg">
      <div className="flex items-center justify-between px-2 pb-1">
        <p className="text-gray-500 text-xs">我的工作空间</p>
        {workspaces.length > 0 && (
          <Link
            href="/workspaces"
            onClick={() => setOpenPopover(false)}
            className="rounded-md border border-gray-200 px-2 py-1 text-xs transition-colors hover:bg-gray-100"
          >
            查看所有
          </Link>
        )}
      </div>
      {workspaces.map(({ id, name, image }) => {
        return (
          <Link
            key={id}
            className={`relative flex w-full items-center gap-x-2 rounded-md px-2 py-1.5 hover:bg-gray-100 active:bg-gray-200 ${
              selected.id === id ? "font-medium" : ""
            } transition-all duration-75`}
            href={`/${id}`}
            shallow={false}
            onClick={() => setOpenPopover(false)}
          >
            <BlurImage
              src={image || `${DICEBEAR_AVATAR_URL}${name}`}
              width={20}
              height={20}
              alt={id}
              className="size-7 shrink-0 overflow-hidden rounded-full"
            />
            <span
              className={`block truncate text-sm sm:max-w-[140px] ${
                selected.id === id ? "font-medium" : "font-normal"
              }`}
            >
              {name}
            </span>
          </Link>
        );
      })}
      <button
        key="add"
        onClick={() => {
          setOpenPopover(false);
          setShowAddWorkspaceModal(true);
        }}
        className="group flex w-full cursor-pointer items-center gap-x-2 rounded-md p-2 transition-all duration-75 hover:bg-gray-100"
      >
        <div className="flex size-7 items-center justify-center rounded-full border border-gray-200 bg-gradient-to-t from-gray-100 group-hover:bg-white">
          <OfficeBuilding className="size-4 text-gray-700" />
        </div>
        <span className="block truncate">创建工作空间</span>
      </button>
    </div>
  );
}

function WorkspaceSwitcherPlaceholder() {
  return (
    <div className="flex animate-pulse items-center space-x-1.5 rounded-lg px-1.5 py-2 sm:w-60">
      <div className="size-8 animate-pulse rounded-full bg-gray-200" />
      <div className="hidden h-8 w-28 animate-pulse rounded-md bg-gray-200 sm:block sm:w-40" />
      <ChevronsUpDown className="size-4 text-gray-400" aria-hidden="true" />
    </div>
  );
}
