"use client";

import { ModalContext } from "@/components/modals";
import { Button } from "@/components/ui";
import { useContext } from "react";

export function CreateWorkspaceButton() {
  const { setShowAddWorkspaceModal } = useContext(ModalContext);

  return (
    <div>
      <Button
        text="创建工作空间"
        className="flex-shrink-0 truncate"
        onClick={() => {
          setShowAddWorkspaceModal(true);
        }}
      />
    </div>
  );
}
