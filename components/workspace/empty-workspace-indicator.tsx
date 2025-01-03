"use client";

import { ModalContext } from "@/components/modals";
import { Button } from "@/components/ui";
import Image from "next/image";
import { useContext } from "react";

export function EmptyWorkspaceIndicator() {
  const { setShowAddWorkspaceModal } = useContext(ModalContext);

  return (
    <div className="col-span-3 flex flex-col items-center justify-center rounded-md border border-gray-200 bg-white py-10">
      <h2 className="z-10 font-semibold text-gray-700 text-xl">你还没有工作空间</h2>
      <Image
        src="/_static/no-data.svg"
        alt="No workspace yet"
        width={380}
        height={380}
        className="pointer-events-none"
        priority
      />
      <Button
        text="创建工作空间"
        onClick={() => {
          setShowAddWorkspaceModal(true);
        }}
        className="w-auto"
      />
    </div>
  );
}