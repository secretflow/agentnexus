"use client";

import { ModalContext } from "@/components/modals";
import { Button } from "@/components/ui";
import { useContext } from "react";

export function CreateApplicationButton() {
  const { setShowAddApplicationModal } = useContext(ModalContext);

  return (
    <div>
      <Button
        text="创建应用"
        className="flex-shrink-0 truncate"
        onClick={() => {
          setShowAddApplicationModal(true);
        }}
      />
    </div>
  );
}
