"use client";

import { Avatar, IconMenu, Popover } from "@/components/ui";
import { LogOut, Settings } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Link } from "next-view-transitions";
import { useState } from "react";

export function UserDropdown() {
  const { data: session } = useSession();
  const [openPopover, setOpenPopover] = useState(false);

  return (
    <div className="relative inline-block pt-1.5">
      <Popover
        content={
          <div className="flex w-full flex-col space-y-px rounded-md bg-white p-3 sm:w-56">
            {session?.user ? (
              <Link href="/workspaces" className="p-2" onClick={() => setOpenPopover(false)}>
                <p className="truncate font-medium text-gray-900 text-sm">
                  {session.user.name || session.user.email?.split("@")[0]}
                </p>
                <p className="truncate text-gray-500 text-sm">{session.user.email}</p>
              </Link>
            ) : (
              <div className="grid gap-2 px-2 py-3">
                <div className="h-3 w-12 animate-pulse rounded-full bg-gray-200" />
                <div className="h-3 w-20 animate-pulse rounded-full bg-gray-200" />
              </div>
            )}
            <Link
              href="/account/settings"
              onClick={() => setOpenPopover(false)}
              className="block w-full rounded-md p-2 text-sm transition-all duration-75 hover:bg-gray-100 active:bg-gray-200"
            >
              <IconMenu text="设置" icon={<Settings className="h-4 w-4" />} />
            </Link>
            <button
              className="w-full rounded-md p-2 text-sm transition-all duration-75 hover:bg-gray-100 active:bg-gray-200"
              onClick={() => {
                signOut({
                  callbackUrl: "/login",
                });
              }}
            >
              <IconMenu text="登出" icon={<LogOut className="h-4 w-4" />} />
            </button>
          </div>
        }
        align="end"
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
      >
        <button onClick={() => setOpenPopover(!openPopover)} className="group relative">
          {session?.user ? (
            <Avatar
              user={session.user}
              className="size-9 transition-all duration-75 group-focus:outline-none group-active:scale-95 sm:h-10 sm:w-10"
            />
          ) : (
            <div className="size-9 animate-pulse rounded-full border border-gray-300 bg-gray-100 sm:h-10 sm:w-10" />
          )}
        </button>
      </Popover>
    </div>
  );
}
