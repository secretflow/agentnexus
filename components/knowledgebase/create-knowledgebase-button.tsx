"use client";

import { ModalContext } from "@/components/modals";
import { Button } from "@/components/ui";
import { useContext } from "react";

export function CreateKnowledgebaseButton() {
  const { setShowAddKnowledgebaseModal } = useContext(ModalContext);

  return (
    <div>
      <Button
        text="创建知识库"
        className="flex-shrink-0 truncate"
        onClick={() => {
          setShowAddKnowledgebaseModal(true);
        }}
      />
    </div>
  );
}
